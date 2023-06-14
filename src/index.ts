import dotenv from 'dotenv';
dotenv.config();

import { connect } from './db';
import app from './app';

connect();

app.listen(app.get('port'), () => {
	console.log(`Server running on port ${app.get('port')}`);
});
