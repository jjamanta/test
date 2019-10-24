import User from '../models/User';

export default async (req, res, next) => {
  const user = await User.findByPk(req.userId);
  try {
    if (!user) {
      return res.status(400).json({ message: 'Could not find this user.' });
    }

    if (!user.administrator) {
      return res.status(400).json({ message: 'User is not administrator.' });
    }

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid user.' });
  }
};
