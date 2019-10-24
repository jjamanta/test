import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails ' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const { id, name, email, administrator } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      administrator,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('old{assword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails ' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists.' });
      }
    }

    if (!(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ message: 'Password does not match' });
    }

    const { id, name, administrator } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
      administrator,
    });
  }
}

export default new UserController();
