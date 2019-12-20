import { startOfDay, endOfDay, parseISO, setHours, setMinutes, setSeconds, format, isAfter } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Appointment from '../models/Appointment';
import { Op } from 'sequelize';

class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    const searchDate = Number(date);
    console.log("searchDate");
    console.log(parseISO(searchDate));

    const test = Number(1576846682547);
    const test2 = new Date();
    console.log('Date');
    console.log(test2);
    console.log(format(test2, "yyyy-MM-dd HH:mm:ssxxx", { locale: pt }));
    console.log(format(test2, "yyyy-MM-dd HH:mm:ssxxx"));
    console.log("-----");
    console.log(format(test, "yyyy-MM-dd HH:mm:ssxxx"));

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });

    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
      '19:00',
      '20:00',
    ];

    const available = schedule.map(time => {
      const [hour, minute] = time.split(':');
      console.log(format(searchDate, "yyyy-MM-dd'T'HH:mm:ssxxx"));
      const value = setSeconds(setMinutes(setHours(searchDate, hour), minute), 0);
      console.log(time);
      console.log(value);

      return {
        time,
        value: format(value, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        available: isAfter(value, new Date()) &&
          !appointments.find(a => format(a.date, 'HH:mm') === time),
      };
    });

    return res.json(available);
  }
}

export default new AvailableController();
