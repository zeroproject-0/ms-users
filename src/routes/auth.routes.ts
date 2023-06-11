import { Router } from 'express';

import { validateToken, login, logout } from '../controllers/auth.controller';
import { createUser } from '../controllers/users.controller';

const router = Router();

router.post('/signup', createUser);
router.post('/signin', login);
router.post('logout', logout);
router.get('/validate', validateToken);

export default router;
