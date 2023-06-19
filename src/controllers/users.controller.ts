import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// import { Prisma } from '../db';
import { encryptPassword, validateJson } from '../libs/validate';
import { User } from '../models/User.model';
import { sendLog } from '../libs/logs';

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const users = await User.find({}).populate('contacts').exec();
		sendLog({
			metodo: 'GET',
			servicio: 'users',
			peticion: 'frontend',
			respuesta: 'Usuarios obtenidos',
		});
		return res.status(200).json({ message: 'Usuarios obtenidos', data: users });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error al obtener los usuarios' });
	}
};

export const getUser = async (req: Request, res: Response) => {
	try {
		const user = await User.findById(req.params.id).populate('contacts').exec();
		if (!user)
			return res.status(404).json({ message: 'Usuario no encontrado' });

		return res.status(200).json({ message: 'Usuario obtenido', data: user });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error al obtener el usuario' });
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	const id = req.params.id;

	try {
		const user = await User.findOneAndUpdate(
			{ _id: id },
			{ state: false }
		).exec();
		if (!user)
			return res.status(404).json({ message: 'Usuario no encontrado' });

		res.json({ message: 'Usuario eliminado', data: user });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error al eliminar el usuario' });
	}
};

export const updateUser = async (req: Request, res: Response) => {
	const id = req.params.id;

	try {
		const user = await User.findOneAndUpdate({ _id: id }, req.body).exec();
		if (!user)
			return res.status(404).json({ message: 'Usuario no encontrado' });

		res.json({ message: 'Usuario actualizado', data: user });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error al actualizar el usuario' });
	}
};

export const createUser = async (req: Request, res: Response) => {
	const user = req.body;

	const fields = ['name', 'email', 'password', 'nickname', 'name', 'lastname'];

	if (!validateJson(user, fields))
		return res.status(400).json({ message: 'Campos incompletos' });

	user.password = await encryptPassword(user.password);

	try {
		const newUser = await (await User.create(user)).save();
		if (newUser === null)
			return res.status(500).json({ message: 'Error al crear el usuario' });

		const token: string = jwt.sign(
			{ _id: newUser.id },
			process.env.TOKEN_SECRET!,
			{ expiresIn: 60 * 60 * 24 }
		);

		sendLog({
			metodo: 'POST',
			servicio: 'users',
			peticion: 'frontend',
			respuesta: 'Usuario creado',
		});

		res
			.status(200)
			.cookie('token', token, { maxAge: 60 * 60 * 24 })
			.header('auth-token', token)
			.json({ message: 'Usuario creado', data: newUser });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error al crear el usuario' });
	}
};

export const addContact = async (req: Request, res: Response) => {
	const id = req.params.id;
	const { contactID } = req.body;

	try {
		let user = await User.findById(id).exec();
		if (!user)
			return res.status(404).json({ message: 'Usuario no encontrado' });

		const contact = await User.findById(contactID).exec();
		if (!contact)
			return res.status(404).json({ message: 'Contacto no encontrado' });

		user.contacts.push(contactID);
		contact.contacts.push(id as any);
		await user.save();
		user = await user.populate('contacts');
		await contact.save();

		sendLog({
			metodo: 'POST',
			servicio: 'users/addContact',
			peticion: 'frontend',
			respuesta: 'Contacto agregado',
		});

		res.json({ message: 'Contacto agregado', data: user });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error al agregar el contacto' });
	}
};
