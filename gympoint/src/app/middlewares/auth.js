import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  console.log(req.headers.authorization);
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader) {
    return res.status(401).json({ message: 'Token not provided.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    console.log(decoded);
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid.' });
  }
};
