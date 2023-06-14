import { Router } from 'express';

import { login, logout } from '../controllers/auth.controller';
import { createUser } from '../controllers/users.controller';
import { validateToken } from '../middleware/validateToken';

const router = Router();

router.post('/signup', createUser);
router.post('/signin', login);
router.post('/logout', logout);
router.post('/validate', validateToken);
router.get('/validate', validateToken);

export default router;
