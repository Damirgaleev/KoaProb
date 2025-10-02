import Koa from 'koa';
import 'dotenv/config'; 
import { router } from './routes/routes';
import bodyParser from '@koa/bodyparser';
import koaErrorMiddleware from './middlewares/errors.middlewares';
import auth from 'koa-basic-auth';
import { clientIpMiddleware } from './middlewares/client-ip.middleware';
import { initializeDatabase } from './config/database';

const port = 3500;

const app = new Koa();

app.use(koaErrorMiddleware)

// Basic Auth для всего приложения
app.use(auth({ 
	name: process.env.BASIC_AUTH_API || 'client_api', 
	pass: process.env.BASIC_AUTH_API_PASSWORD || 'edecdvtrhr%' 
}));

// Middleware для определения IP клиента
app.use(clientIpMiddleware);

app.use(bodyParser({ jsonLimit: '50mb', formLimit: '50mb', textLimit: '20mb', encoding: 'utf-8', parsedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'] }))

app.use(router.routes())

// Инициализация базы данных и запуск сервера
const startServer = async () => {
    try {
        // Инициализируем подключение к БД
        await initializeDatabase();
        
        // Запускаем сервер
        app.listen(port, () => {
            console.log(`🚀 Сервер запущен на http://localhost:${port}/`);
            console.log(`📊 API для идей: http://localhost:${port}/api/ideas`);
        });
    } catch (error) {
        console.error('❌ Ошибка при запуске сервера:', error);
        process.exit(1);
    }
};

startServer();