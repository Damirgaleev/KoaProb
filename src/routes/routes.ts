import Router from '@koa/router';
import { ideasRouter } from './api/ideas.api.routes';
import { getClientIp } from '../middlewares/client-ip.middleware';

export const router = new Router();

// API маршруты для идей
router.use(ideasRouter.routes(), ideasRouter.allowedMethods());

router.get('/', (ctx) => {
	const clientIp = getClientIp(ctx);
	ctx.body = {
		message: '🚀 API сервер работает!',
		timestamp: new Date().toISOString(),
		version: '1.0.0',
		yourIp: clientIp,
		endpoints: {
			ideas: '/api/ideas',
			posts: '/api/posts'
		}
	};
});
