import * as Yup from 'yup';
import { addMonths } from 'date-fns';
import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';

class RegistrationController {
  async index(req, res) {
    const { student_id } = req.params;

    const registration = await Registration.findAll({ where: student_id });
    if (!registration) {
      return res
        .status(400)
        .json({ message: 'This student do not have any registration.' });
    }

    return res.json(registration);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails ' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const registrationExists = await Registration.findOne({
      where: { student_id },
    });

    if (registrationExists) {
      return res
        .status(400)
        .json({ message: 'This student already have registration.' });
    }

    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      return res.status(400).json({ message: 'Student do not exists.' });
    }

    const planExists = await Plan.findByPk(plan_id);

    if (!planExists) {
      return res.status(400).json({ message: 'Plan do not exists.' });
    }

    const end_date = addMonths(new Date(start_date), planExists.duration);
    const price = planExists.duration * planExists.price;

    const { id } = await Registration.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    return res.json({
      id,
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails ' });
    }

    const { id } = req.params;
    const { student_id, plan_id, start_date } = req.body;

    const registration = await Registration.findByPk(id);

    if (!registration) {
      return res.status(400).json({ message: 'Registration not found.' });
    }

    const studentExists = await Student.findByPk(student_id);

    if (!studentExists) {
      return res.status(400).json({ message: 'Student do not exists.' });
    }

    if (registration.student_id !== student_id) {
      const registrationExists = await Registration.findOne({
        where: { student_id },
      });

      if (registrationExists) {
        return res
          .status(400)
          .json({ message: 'This student already have registration.' });
      }
    }

    const planExists = await Plan.findByPk(plan_id);

    if (!planExists) {
      return res.status(400).json({ message: 'Plan do not exists.' });
    }

    const end_date = addMonths(new Date(start_date), planExists.duration);
    const price = planExists.duration * planExists.price;

    await registration.update({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    return res.json(registration);
  }

  async destroy(req, res) {
    const registration = await Registration.findByPk(req.params.id);

    if (!registration) {
      return res.status(400).json({ message: 'Registration not found.' });
    }

    await registration.destroy();

    return res.json({ message: 'Registration deleted successfully.' });
  }
}

export default new RegistrationController();
