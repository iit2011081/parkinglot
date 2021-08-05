import dotenv from 'dotenv'
dotenv.config();
const config = {
	port: process.env.PORT || 8081,
	DB: {
		username: process.env.POSTGRES_USER || 'db_user',
		password: process.env.POSTGRES_PASSWORD || 'db_password',
		database: process.env.DATABASE || 'db_name',
		host: process.env.POSTGRES_HOST || 'localhost',
		port: process.env.POSTGRES_PORT || '5432',
		dialect: 'postgres',
	}
};
export default config