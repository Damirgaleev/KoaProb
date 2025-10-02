"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = koaErrorMiddleware;
async function koaErrorMiddleware(ctx, next) {
    var _a, _b, _c;
    try {
        await next();
    }
    catch (koaError) {
        const error = koaError;
        const responseData = (_b = (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.status;
        ctx.status = ((responseData === null || responseData === void 0 ? void 0 : responseData.code) === 401 ? 403 : responseData === null || responseData === void 0 ? void 0 : responseData.code) || ((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.status) || (error === null || error === void 0 ? void 0 : error.status) || 500;
        if (ctx.status === 401) {
            error.type = error.message;
            error.msg = 'Необходима базовая авторизация';
        }
        return ctx.body = {
            type: error === null || error === void 0 ? void 0 : error.type,
            message: (error === null || error === void 0 ? void 0 : error.msg) || (error === null || error === void 0 ? void 0 : error.message) || 'Произошла синтаксическая ошибка при обработке запроса',
        };
    }
}
