import { Router } from 'express';

import { signup, signin, validateToken } from '../controllers/auth.controller';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/validate', validateToken);

export default router;
