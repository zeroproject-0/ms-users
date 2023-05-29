import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { Prisma } from '../db';
import {
	encryptPassword,
	validateJson,
	verifyPassword,
} from '../libs/validate';

export const signup = async (req: Request, res: Response) => {
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

export const signin = async (req: Request, res: Response) => {
	if (!validateJson(req.body, ['email', 'password']))
		return res.status(400).json({ message: 'Campos incompletos' });

	const user = await Prisma.user.findUnique({
		where: {
			email: req.body.email,
		},
	});

	if (user === null)
		return res.status(404).json({ message: 'Usuario no encontrado' });

	const isCorrectPassword = await verifyPassword(
		req.body.password,
		user.password
	);

	if (!isCorrectPassword)
		return res.status(401).json({ message: 'Contraseña incorrecta' });

	const token: string = jwt.sign(
		{ _id: user.id },
		process.env.TOKEN_SECRET || 'token',
		{
			expiresIn: 60 * 60 * 24,
		}
	);

	res
		.header('auth-token', token)
		.json({ message: 'Inicio de sesión correcto', data: user });
};

export const validateToken = async (req: Request, res: Response) => {};
