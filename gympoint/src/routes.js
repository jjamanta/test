import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import CheckinController from './app/controllers/CheckinController';
import RegistrationController from './app/controllers/RegistrationController';
// middlewares
import authMiddleware from './app/middlewares/auth';
import adminMiddleware from './app/middlewares/admin';

const routes = new Router();

// sessions

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.use(adminMiddleware);

// User
routes.post('/users', UserController.store);

// students
routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);

// checkin
routes.get('/students/:student_id/checkins', CheckinController.index);
routes.post('/students/:student_id/checkins', CheckinController.store);

// plans
routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.destroy);

// registration

routes.get('/registrations', RegistrationController.index);
routes.post('/registrations', RegistrationController.store);
routes.put('/registrations/:id', RegistrationController.update);
routes.delete('/registrations/:id', RegistrationController.destroy);

export default routes;
