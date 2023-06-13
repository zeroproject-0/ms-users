import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { Prisma } from '../db';
import { validateJson, verifyPassword } from '../libs/validate';

export const login = async (req: Request, res: Response) => {
	if (!validateJson(req.body, ['email', 'password']))
		return res.status(400).json({ message: 'Campos incompletos' });

	const user = await Prisma.user.findUnique({
		where: {
			email: req.body.email,
		},
	});

	if (user === null)
		return res.status(404).json({ message: 'Usuario no encontrado' });

	const { password, ...userToSend } = user;

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
		.cookie('token', token)
		.setHeader('auth-token', token)
		.json({
			message: 'Inicio de sesión correcto',
			data: { user: userToSend, token },
		});
};

export const logout = async (req: Request, res: Response) => {
	return res
		.status(200)
		.cookie('token', '', { expires: new Date(0) })
		.header('auth-token', '')
		.json({ message: 'Sesión cerrada' });
};

export const validateToken = async (req: Request, res: Response) => {
	const token =
		req.body.token ?? req.headers['auth-token'] ?? req.cookies.token;

	if (!token) return res.status(401).json({ message: 'Acceso denegado' });

	try {
		const payload = jwt.verify(
			token,
			process.env.TOKEN_SECRET || 'token'
		) as jwt.JwtPayload;

		res.json({
			message: 'Token valido',
			data: await Prisma.user.findUnique({
				where: {
					id: payload._id,
				},
			}),
		});
	} catch (error) {
		res.status(400).json({ message: 'Token invalido' });
	}
};
