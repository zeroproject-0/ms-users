declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DATABASE_URL: string;
			TOKEN_SECRET: string;
			PORT: string;
			ENV: 'dev' | 'prod' | 'debug';
		}
	}
}

export {};
