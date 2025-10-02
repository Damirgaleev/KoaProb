"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
require("dotenv/config");
const routes_1 = require("./routes");
const bodyparser_1 = __importDefault(require("@koa/bodyparser"));
const errors_middlewares_1 = __importDefault(require("./middlewares/errors.middlewares"));
const koa_basic_auth_1 = __importDefault(require("koa-basic-auth"));
const client_ip_middleware_1 = require("./middlewares/client-ip.middleware");
const port = 3500;
const app = new koa_1.default();
// Basic Auth для всего приложения
app.use((0, koa_basic_auth_1.default)({
    name: process.env.BASIC_AUTH_API || 'admin',
    pass: process.env.BASIC_AUTH_API_PASSWORD || 'secret'
}));
// Middleware для определения IP клиента
app.use(client_ip_middleware_1.clientIpMiddleware);
app.use((0, bodyparser_1.default)({ jsonLimit: '50mb', formLimit: '50mb', textLimit: '20mb', encoding: 'utf-8', parsedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'] }));
app.use(errors_middlewares_1.default);
app.use(routes_1.router.routes());
app.listen(port, () => {
    console.log(`🚀 Сервер запущен на http://localhost:${port}/`);
});
