"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientIp = exports.clientIpMiddleware = void 0;
/**
 * Middleware для определения реального IP-адреса клиента
 * Учитывает работу за reverse-proxy (Nginx, AWS ELB и т.д.)
 */
const clientIpMiddleware = async (ctx, next) => {
    let clientIp;
    // 1. Проверяем X-Forwarded-For (стандарт для reverse-proxy)
    // Формат: X-Forwarded-For: client, proxy1, proxy2
    const forwardedFor = ctx.get('X-Forwarded-For');
    if (forwardedFor) {
        // Берем первый IP из списка (это IP клиента)
        const ips = forwardedFor.split(',').map(ip => ip.trim());
        clientIp = ips[0];
    }
    // 2. Проверяем X-Real-IP (используется Nginx)
    if (!clientIp) {
        const realIp = ctx.get('X-Real-IP');
        if (realIp) {
            clientIp = realIp;
        }
    }
    // 3. Проверяем CF-Connecting-IP (Cloudflare)
    if (!clientIp) {
        const cfIp = ctx.get('CF-Connecting-IP');
        if (cfIp) {
            clientIp = cfIp;
        }
    }
    // 4. Проверяем True-Client-IP (Akamai и Cloudflare Enterprise)
    if (!clientIp) {
        const trueClientIp = ctx.get('True-Client-IP');
        if (trueClientIp) {
            clientIp = trueClientIp;
        }
    }
    // 5. Проверяем X-Client-IP
    if (!clientIp) {
        const xClientIp = ctx.get('X-Client-IP');
        if (xClientIp) {
            clientIp = xClientIp;
        }
    }
    // 6. Fallback: используем IP из socket connection
    if (!clientIp) {
        clientIp = ctx.request.ip;
    }
    // Сохраняем IP в state для использования в других middleware и маршрутах
    ctx.state.clientIp = clientIp;
    await next();
};
exports.clientIpMiddleware = clientIpMiddleware;
/**
 * Утилита для получения IP-адреса клиента из контекста
 */
const getClientIp = (ctx) => {
    return ctx.state.clientIp || ctx.request.ip || 'unknown';
};
exports.getClientIp = getClientIp;
