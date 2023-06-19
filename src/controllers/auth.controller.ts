import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// import { Prisma } from '../db';
import { validateJson, verifyPassword } from '../libs/validate';
import { User } from '../models/User.model';
import { sendLog } from '../libs/logs';

const LOG_URL = process.env.LOG_URL || 'http://localhost:5000/log';

export const login = async (req: Request, res: Response) => {
	if (!validateJson(req.body, ['email', 'password'])) {
		sendLog({
			metodo: 'POST',
			servicio: 'auth/login',
			peticion: req.body,
			respuesta: { message: 'Campos incompletos' },
		});
		return res.status(400).json({ message: 'Campos incompletos' });
	}

	try {
		const user = await User.findOne({ email: req.body.email })
			.populate('contacts')
			.exec();
		if (user === null) {
			sendLog({
				metodo: 'POST',
				servicio: 'auth/login',
				peticion: 'frontend',
				respuesta: 'Usuario o contraseña incorrectos',
			});
			return res
				.status(404)
				.json({ message: 'Usuario o contraseña incorrecto' });
		}

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

		fetch(LOG_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Allow-Control-Allow-Origin': '*',
			},
			body: JSON.stringify({
				metodo: 'POST',
				servicio: 'auth/login',
				peticion: 'frontend',
				respuesta: token,
			}),
		})
			.then((res) => res.text())
			.then(console.log);

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
	fetch(LOG_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Allow-Control-Allow-Origin': '*',
		},
		body: JSON.stringify({
			metodo: 'POST',
			servicio: 'auth/logout',
			peticion: 'frontend',
			respuesta: 'Sesión cerrada',
		}),
	})
		.then((res) => res.text())
		.then(console.log);

	return res
		.status(200)
		.cookie('token', '', { expires: new Date(0) })
		.header('auth-token', '')
		.json({ message: 'Sesión cerrada' });
};
