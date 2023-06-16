import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';

export const validateToken = async (req: Request, res: Response) => {
	const token =
		req.body.token ?? req.headers['auth-token'] ?? req.cookies.token;

	if (!token) return res.status(401).json({ message: 'Acceso denegado' });

	try {
		const payload = jwt.verify(
			token,
			process.env.TOKEN_SECRET || 'token'
		) as jwt.JwtPayload;

		const user = await User.findById(payload._id).populate('contacts').exec();
		const { password, ...userToSend } = user!.toObject();

		res.json({
			message: 'Token valido',
			data: userToSend,
		});
	} catch (error) {
		res.status(400).json({ message: 'Token invalido' });
	}
};
