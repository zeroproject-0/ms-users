import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import usersRoutes from './routes/users.routes';
import authRoutes from './routes/auth.routes';

const app = express();

const { PORT, ENV } = process.env;

app.set('port', Number(PORT || 3000));

app.use(
	cors({
		origin: ENV === 'dev' ? 'http://localhost:5173' : 'https://zeroproject.dev',
		credentials: true,
	})
);
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/v1/', usersRoutes);
app.use('/v1/auth', authRoutes);

app.listen(app.get('port'), () => {
	console.log(`Server running on port ${app.get('port')}`);
});
