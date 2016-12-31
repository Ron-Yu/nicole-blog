import User from '../models/user'

export default async (ctx, next) => {
  const token = ctx.get('x-auth')

	try {
		const user = await User.findByToken(token)
		if (!user) {
			ctx.status = 401
			return
		}
		ctx.state.user = user
    ctx.state.token = token
		next()
	} catch (err) {
		console.log(JSON.stringify(err))
		ctx.status = 401
		ctx.body = ''
	}
}
