import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plan = await Plan.findAll({ raw: true });
    if (!plan) {
      return res.status(400).json({ message: 'No plans found.' });
    }
    return res.json(plan);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .required()
        .positive(),
      price: Yup.number()
        .required()
        .positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ message: 'Validation fails ' });
    }

    const planExists = await Plan.findOne({
      where: { title: req.body.title },
    });

    if (planExists) {
      return res.status(400).json({ message: 'Plan already exists.' });
    }

    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    const { id } = req.params;

    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(400).json({ message: 'Plan not found.' });
    }

    const { title, duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async destroy(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ message: 'Plan not found.' });
    }

    await plan.destroy();

    return res.json({ message: '"Plan deleted successfully.' });
  }
}

export default new PlanController();
