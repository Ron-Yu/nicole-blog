import combineRouters from '../helpers/koa-compose-routers'
import postsRouter from './posts'

const combinedRouters = combineRouters([
	postsRouter
])

export default combinedRouters
