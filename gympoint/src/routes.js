import { Router } from 'express';

import UserController from './app/controllers/UserController';
import StudentController from './app/controllers/StudentController';

const routes = new Router();

// User

routes.post('/users', UserController.store);

// Student
routes.post('/students', StudentController.store);

export default routes;
