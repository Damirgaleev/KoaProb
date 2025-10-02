import type { AxiosError } from "axios"
import type { Context, Next } from "koa"

interface KoaError extends Error {
	msg?: string
	type?: string
}

export default async function koaErrorMiddleware (ctx: Context, next: Next) {
	try {
		await next()
	} catch (koaError) {
		const error = koaError as KoaError & AxiosError<any>
		const responseData = error?.response?.data?.status

		ctx.status = (responseData?.code === 401 ? 403 : responseData?.code) || error?.response?.status || error?.status || 500

		if (ctx.status === 401) {
			error.type = error.message
			error.msg = 'Необходима базовая авторизация'
		}

		return ctx.body = {
			type: error?.type,
			message: error?.msg || error?.message || 'Произошла синтаксическая ошибка при обработке запроса',
		}
	}
}