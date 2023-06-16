import { Router } from 'express';

import {
	addContact,
	createUser,
	deleteUser,
	getAllUsers,
	getUser,
	updateUser,
} from '../controllers/users.controller';

const router = Router();

router.get('/', getAllUsers);

router.get('/:id', getUser);

router.delete('/:id', deleteUser);

router.put('/:id', updateUser);

router.post('/', createUser);

router.post('/contact/:id', addContact);

export default router;
