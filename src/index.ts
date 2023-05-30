import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan';

import usersRoutes from './routes/users.routes';
import authRoutes from './routes/auth.routes';

const app = express();

app.set('port', Number(process.env.PORT));

app.use(express.json());
app.use(morgan('dev'));

app.use('/', usersRoutes);
app.use('/auth', authRoutes);

app.listen(app.get('port'), () => {
	console.log('Servidor en el puerto 3000');
});
