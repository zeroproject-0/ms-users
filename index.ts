import dotenv from 'dotenv';
dotenv.config();

import { connect } from './src/db';
import app from './src/app';

connect();

app.listen(app.get('port'), () => {
	console.log(`Server running on port ${app.get('port')}`);
});
