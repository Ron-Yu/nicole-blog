// Reference
// http://stackoverflow.com/questions/30285683/how-can-i-split-my-koa-routes-into-separate-files
// https://github.com/saadq/koa-combine-routers/blob/master/index.js
// https://github.com/koajs/compose

import convert from 'koa-convert'

export default function combineRouters(...separatedRouters) {
	const routers = Array.isArray(separatedRouters[0]) ? separatedRouters[0] : separatedRouters
	const middleware = []
	const PREFIX = '/api'

	routers.forEach(router => {
		router.prefix(PREFIX)
		middleware.push(router.routes())
		middleware.push(router.allowedMethods())
	})

	return convert.compose(middleware)
}
