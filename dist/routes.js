"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const client_ip_middleware_1 = require("./middlewares/client-ip.middleware");
exports.router = new koa_router_1.default();
exports.router.get('/', (ctx) => {
    const clientIp = (0, client_ip_middleware_1.getClientIp)(ctx);
    ctx.body = {
        message: 'Привет, мир!',
        yourIp: clientIp
    };
});
exports.router.get('/api/posts', async (ctx) => {
    const clientIp = (0, client_ip_middleware_1.getClientIp)(ctx);
    console.log(`Запрос на /api/posts от IP: ${clientIp}`);
    ctx.body = {
        posts: [],
        requestFrom: clientIp
    };
});
