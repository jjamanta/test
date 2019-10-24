import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Registration from '../models/Registration';

class CheckinController {
  async index(req, res) {
    /*     const schema = Yup.object().shape({
          student_id: Yup.number().required(),
        });

        if (!(await schema.isValid(req.body))) {
          return res.status(400).json({ message: 'Validation fails ' });
        } */

    const { student_id } = req.params;

    if (!student_id) {
      return res
        .status(400)
        .json({ message: 'Please provide the student id.' });
    }

    const checkin = await Checkin.findAll({ where: { student_id } });
    if (!checkin) {
      return res.status(400).json({ message: 'No checkin for this student.' });
    }
    return res.json(checkin);
  }

  async store(req, res) {
    /*     const schema = Yup.object().shape({
          student_id: Yup.number().required(),
        });

        if (!(await schema.isValid(req.body))) {
          return res.status(400).json({ message: 'Validation fails ' });
        } */

    const { student_id } = req.params;
    console.log('checkin.store');
    console.log(student_id);

    const dateNow = new Date();

    const registrationExists = await Registration.findOne({
      where: { student_id, end_date: { [Op.gt]: dateNow } },
    });

    // , end_date: { $gte: dateNow }

    if (!registrationExists) {
      return res.status(400).json({
        message: 'This student do not have a any registration.',
      });
    }

    if (registrationExists.date_end < dateNow) {
      return res.status(400).json({
        message: 'This student do not have a valid registration.',
      });
    }

    const date_minus7 = dateNow - 7;

    const checkins_made = await Checkin.count({
      where: {
        student_id,
        created_at: { [Op.gt]: date_minus7 },
      },
    });

    console.log(checkins_made);

    if (checkins_made >= 5) {
      return res.status(400).json({
        message: 'This student already check-in 5 times on the last 7 days.',
      });
    }

    const { created_at } = await Checkin.create({ student_id });

    return res.json({
      student_id,
      created_at,
    });
  }
}

export default new CheckinController();
