"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const koa_basic_auth_1 = __importDefault(require("koa-basic-auth"));
const fs_1 = __importDefault(require("fs"));
const apiGroupRoutes = new router_1.default({ prefix: '/api/' });
const basicAuthName = process.env.BASIC_AUTH_API || '';
const basicAuthPassword = process.env.BASIC_AUTH_API_PASSWORD || '';
// Добавляем базовую аутентификацию только если указаны учетные данные
if (basicAuthName && basicAuthPassword) {
    apiGroupRoutes.use((0, koa_basic_auth_1.default)({ name: basicAuthName, pass: basicAuthPassword }));
}
// Функция для загрузки всех файлов маршрутов
function loadRoutes() {
    const routesDir = __dirname;
    try {
        const files = fs_1.default.readdirSync(routesDir);
        const routeFiles = files.filter(file => file.endsWith('.routes.js') || file.endsWith('.api.routes.js'));
        // Синхронная загрузка маршрутов
        for (const routerFileName of routeFiles) {
            try {
                // Используем require для синхронной загрузки
                const routerModule = require('./' + routerFileName);
                const router = routerModule.default || routerModule;
                apiGroupRoutes.use(router);
            }
            catch (importError) {
                console.error(`Ошибка при загрузке маршрута ${routerFileName}:`, importError);
            }
        }
    }
    catch (error) {
        console.error('Ошибка при загрузке маршрутов:', error);
    }
}
// Загружаем маршруты
loadRoutes();
exports.default = apiGroupRoutes.routes();
