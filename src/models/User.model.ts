import { Schema, Types, model } from 'mongoose';

interface IUser {
	email: string;
	password: string;
	name: string;
	nickname: string;
	avatar: string;
	lastname: string;
	contacts: Types.ObjectId[];
	state: boolean;
}

const UserSchema = new Schema<IUser>(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
		},
		nickname: {
			type: String,
			required: true,
			trim: true,
		},
		avatar: {
			type: String,
		},
		lastname: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
		},
		contacts: [
			{
				type: Types.ObjectId,
				ref: 'User',
				default: [],
			},
		],
		state: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

export const User = model<IUser>('User', UserSchema);
