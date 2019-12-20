import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import User from '../models/User';

import * as Yup from 'yup';

class ScheduleController {
  async index(req, res) {
    //const { page = 1, limit = 20 } = req.query;

    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [
            startOfDay(parsedDate), endOfDay(parsedDate)
          ],
        },
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name']
        }
      ],
      order: ['date'],
/*       attributes: ['id', 'date'],
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
 */    });

    return res.json(appointments);
  }
}

export default new ScheduleController();
