import combineRouters from '../helpers/koa-compose-routers'
import postsRouter from './posts'
import usersRouter from './users'

const combinedRouters = combineRouters([
	postsRouter,
	usersRouter
])

export default combinedRouters
