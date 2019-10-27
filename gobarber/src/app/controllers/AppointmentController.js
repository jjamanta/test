import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

import Mail from '../../lib/Mail';

import * as Yup from 'yup';

class AppointmentController {
  async index(req, res) {
    const { page = 1, limit = 20 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: limit,
      offset: (page - 1) * limit,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async strore(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      provider_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    // Check if provider id is a provider
    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!checkIsProvider) {
      return res.status(401).json({ error: 'You can only create appointments with providers' });
    }

    // Check for past dates
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    // Check date availability
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart
      },
    });

    if (checkAvailability) {
      return res.status(400).json({ error: 'Appointmernt date is not available' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    // Notify appointment provider

    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'para o dia' dd 'de' MMMM', as 'H:mm'h'",
      { locale: pt },
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} ${formattedDate}`,
      user: provider_id,
    })

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (!appointment) {
      return res.status(401).json({ error: 'Appointment not found' })
    }

    if (appointment.canceled_at !== null) {
      return res.status(401).json({ error: 'Appointment is already cancelled' })
    }

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({ error: "You don't have permission to cancel this appoint" });
    }

    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({ error: "You can only cancel appointments 2 hours in advance." });
    }

    appointment.canceled_at = new Date();

    //console.log(appointment.provider.name);
    //console.log(appointment.provider.email);

    //await appointment.save();

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(appointment.date,
          "'para o dia' dd 'de' MMMM', as 'H:mm'h'",
          { locale: pt },
        ),
      },
    });

    return res.json(appointment)
  }
}

export default new AppointmentController();
