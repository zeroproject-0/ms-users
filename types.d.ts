declare namespace Express {
	export interface Request {
		userId: string;
	}
}

declare namespace JsonWebToken {
	export interface JwtPayload {
		_id: string;
	}
}
