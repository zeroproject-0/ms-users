import { Request, Response } from 'express';
import { genSalt, hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model';

export function validateJson(json: any, fields: string[]) {
	for (const field of fields) {
		if (json[field] === null || json[field] === undefined) return false;
	}

	return true;
}

interface IPayload {
	_id: string;
	iat: number;
	exp: number;
}

export const tokenValidation = async (req: Request, res: Response) => {
	const token = req.header('auth-token');

	if (!token) return false;

	const payload: IPayload = jwt.verify(
		token,
		process.env.TOKEN_SECRET || 'token'
	) as IPayload;

	req.userId = payload._id;

	return true;
};

export async function encryptPassword(password: string) {
	return await hash(password, await genSalt(10));
}

export async function verifyPassword(password: string, hash: string) {
	return await compare(password, hash);
}

export async function verifyToken(req: Request) {
	const token =
		req.body.token ?? req.headers['auth-token'] ?? req.cookies.token;

	if (!token) return null;

	try {
		const payload = jwt.verify(
			token,
			process.env.TOKEN_SECRET || 'token'
		) as jwt.JwtPayload;

		const user = await User.findById(payload._id).populate('Contacts').exec();
		const { password, ...userToSend } = user!.toObject();

		return userToSend;
	} catch (error) {
		return null;
	}
}
