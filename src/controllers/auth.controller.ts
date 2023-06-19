import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// import { Prisma } from '../db';
import { validateJson, verifyPassword } from '../libs/validate';
import { User } from '../models/User.model';

export const login = async (req: Request, res: Response) => {
	if (!validateJson(req.body, ['email', 'password']))
		return res.status(400).json({ message: 'Campos incompletos' });

	try {
		const user = await User.findOne({ email: req.body.email })
			.populate('contacts')
			.exec();
		if (user === null)
			return res
				.status(404)
				.json({ message: 'Usuario o contraseña incorrecto' });

		const { password, ...userToSend } = user!.toObject();
		const isCorrectPassword = await verifyPassword(
			req.body.password,
			user.password
		);

		if (!isCorrectPassword)
			return res
				.status(401)
				.json({ message: 'Usuario o contraseña incorrecto' });

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
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error al iniciar sesión' });
	}
};

export const logout = async (req: Request, res: Response) => {
	return res
		.status(200)
		.cookie('token', '', { expires: new Date(0) })
		.header('auth-token', '')
		.json({ message: 'Sesión cerrada' });
};
