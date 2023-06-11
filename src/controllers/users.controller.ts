import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { Prisma } from '../db';
import { encryptPassword, validateJson } from '../libs/validate';

export const getAllUsers = async (req: Request, res: Response) => {
	const users = await Prisma.user.findMany();
	res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
	const user = await Prisma.user.findUnique({
		where: {
			id: Number(req.params.id),
		},
	});

	if (user === null)
		return res.status(404).json({ message: 'Usuario no encontrado' });

	res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
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
};

export const updateUser = async (req: Request, res: Response) => {
	const id = Number(req.params.id);

	const user = await Prisma.user.update({
		where: {
			id: id,
		},
		data: req.body,
	});

	if (user === null)
		return res.status(404).json({ message: 'Usuario no encontrado' });

	res.json({ message: 'Usuario modificado', data: user });
};

export const createUser = async (req: Request, res: Response) => {
	const user = req.body;

	const fields = ['name', 'email', 'password', 'nickname', 'name', 'lastname'];

	if (!validateJson(user, fields))
		return res.status(400).json({ message: 'Campos incompletos' });

	user.password = await encryptPassword(user.password);

	const newUser = await Prisma.user.create({
		data: user,
	});

	if (newUser === null)
		return res.status(500).json({ message: 'Error al crear el usuario' });

	const token: string = jwt.sign(
		{ _id: newUser.id },
		process.env.TOKEN_SECRET || 'token'
	);

	res
		.header('auth-token', token)
		.json({ message: 'Usuario creado', data: newUser });
};
