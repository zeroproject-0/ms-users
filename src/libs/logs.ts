const LOG_URL = process.env.LOG_URL || 'http://localhost:5000/log';

export function sendLog({ metodo, peticion, respuesta, servicio }: any) {
	fetch(LOG_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Allow-Control-Allow-Origin': '*',
		},
		body: JSON.stringify({
			metodo,
			servicio,
			peticion,
			respuesta,
		}),
	})
		.then((res) => res.text())
		.then(console.log);
}
