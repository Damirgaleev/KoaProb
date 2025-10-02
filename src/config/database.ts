import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST || 'localhost',
	port: parseInt(process.env.DB_PORT || '5432'),
	username: process.env.DB_USERNAME || 'postgres',
	password: process.env.DB_PASSWORD || 'password',
	database: process.env.DB_NAME || 'testpr_db',
	synchronize: process.env.NODE_ENV === 'development',
	logging: process.env.NODE_ENV === 'development',
	entities: [
			__dirname + '/../entities/*.{ts,js}',
			__dirname + '/../entities/**/*.{ts,js}'
	],
});

// Функция для инициализации подключения к БД
export const initializeDatabase = async (): Promise<void> => {
	try {
			await AppDataSource.initialize();
			console.log('✅ Подключение к базе данных установлено');
	} catch (error) {
			console.error('❌ Ошибка подключения к базе данных:', error);
			throw error;
	}
};

// Функция для закрытия подключения к БД
export const closeDatabase = async (): Promise<void> => {
	try {
			await AppDataSource.destroy();
			console.log('✅ Подключение к базе данных закрыто');
	} catch (error) {
			console.error('❌ Ошибка при закрытии подключения к БД:', error);
			throw error;
	}
};
