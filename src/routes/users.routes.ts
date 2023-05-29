import { Router } from 'express';
import { genSalt, hash } from 'bcryptjs';

import { Prisma } from '../db';

const router = Router();

router.get('/users', async (req, res) => {
	const users = await Prisma.user.findMany();
	res.json(users);
});

router.get('/users/:id', async (req, res) => {
	const user = await Prisma.user.findUnique({
		where: {
			id: Number(req.params.id),
		},
	});

	if (user === null)
		return res.status(404).json({ message: 'Usuario no encontrado' });

	res.json(user);
});

router.delete('/users/:id', async (req, res) => {
	const id = Number(req.params.id);

	const user = await Prisma.user.update({
		where: {
			id: id,
		},
		data: {
			state: false,
		},
	});

	if (user === null)
		return res.status(404).json({ message: 'Usuario no encontrado' });

	res.json({ message: 'Usuario eliminado', data: user });
});

router.put('/users/:id', async (req, res) => {
	const id = Number(req.params.id);

	const user = await Prisma.user.update({
		where: {
			id: id,
		},
		data: req.body,
	});

	if (user === null)
		return res.status(404).json({ message: 'Usuario no encontrado' });

	res.json({ message: 'Usuario eliminado', data: user });
});

router.post('/users', async (req, res) => {});

export default router;
