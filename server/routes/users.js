import Router from 'koa-router'
import _ from 'lodash'
import User from '../models/user'
import authenticate from '../middlewares/authenticate'

const router = new Router()

router.post('/users', async ctx => {
	const body = _.pick(ctx.request.body, ['email', 'password'])
	const user = new User(body)

	try {
		const [, token] =
			await Promise.all([
				user.save(),
				user.generateAuthToken()
			])

		ctx.set('x-auth', token)
		ctx.body = user
	} catch (err) {
		ctx.status = 400
		ctx.body = err
		throw err
	}
})

router.get('/users/me', authenticate, ctx => {
  ctx.body = ctx.state.user
})

router.post('/users/login', async ctx => {
  const body = _.pick(ctx.request.body, ['email', 'password'])

	try {
		const user = await User.findByCredentials(body.email, body.password)
		const token = await user.generateAuthToken()
		ctx.set('x-auth', token)
		ctx.status = 200
		ctx.body = user
	} catch (err) {
		ctx.status = 400
		ctx.body = ''
	}
})

router.delete('/users/me/token', authenticate, async ctx => {
	try {
		console.log('yaya')
		await ctx.state.user.removeToken(ctx.state.token) // something wrong
		console.log('yaya~~~~~~~~~~~~~~')
		ctx.status = 200
	} catch (err) {
		ctx.status = 400
	}
})

export default router
