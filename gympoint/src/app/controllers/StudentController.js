import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      height: Yup.number().required(),
      weight: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails ' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });
    if (studentExists) {
      return res.status(400).json({ message: 'Student already exists.' });
    }

    const { id, name, email, age, height, weight } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      height,
      weight,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      height: Yup.number().required(),
      weight: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails ' });
    }

    const { id, name, email, age, height, weight } = await Student.update(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      height,
      weight,
    });
  }
}

export default new StudentController();
