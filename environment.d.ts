declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DATABASE_URL: string;
			TOKEN_SECRET: string;
			PORT: string;
			ENVIRONMENT: 'dev' | 'prod' | 'debug';
		}
	}
}

export {};
