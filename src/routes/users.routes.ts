import { Router } from 'express';

import {
	createUser,
	deleteUser,
	getAllUsers,
	getUser,
	updateUser,
} from '../controllers/users.controller';

const router = Router();

router.get('/users', getAllUsers);

router.get('/users/:id', getUser);

router.delete('/users/:id', deleteUser);

router.put('/users/:id', updateUser);

router.post('/users', createUser);

export default router;
