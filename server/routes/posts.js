import Router from 'koa-router'
import {ObjectId} from 'mongodb'
import Post from '../models/post'

const router = new Router()

router.post('/posts', async ctx => {
	const body = ctx.request.body

	const post = new Post({
		text: body.text
	})

	try {
		const doc = await post.save()
		ctx.status = 200
		ctx.body = doc
	} catch (err) {
		ctx.status = 400
		throw err
	}
})

router.get('/posts', async ctx => {
	try {
		const posts = await Post.find({})
		ctx.status = 200
		ctx.body = {posts}
	} catch (err) {
		ctx.status = 400
		throw err
	}
})

router.get('/posts/:id', async ctx => {
	const id = ctx.params.id

	if (!ObjectId.isValid(id)) {
		ctx.status = 404
		return
	}

	try {
		const post = await Post.findOne({_id: id})
		if (!post) {
			ctx.status = 404
			return
		}
		ctx.status = 200
		ctx.body = {post}
	} catch (err) {
		ctx.status = 404
		throw err
	}
})

router.patch('/posts/:id', async ctx => {
	const {text} = ctx.request.body
	const id = ctx.params.id

	if (!ObjectId.isValid(id)) {
		ctx.status = 404
		return
	}

	try {
		const post = await Post.findOneAndUpdate(
        {_id: id},
        {$set: {text}},
        {new: true},
      )
		if (!post) {
			ctx.status = 404
			return
		}
		ctx.status = 200
		ctx.body = {post}
	} catch (err) {
		ctx.status = 404
		throw err
	}
})

router.delete('/posts/:id', async ctx => {
	const id = ctx.params.id

	if (!ObjectId.isValid(id)) {
		ctx.status = 404
		return
	}

	try {
		const post = await Post.findOneAndRemove({_id: id})
		if (!post) {
			ctx.status = 404
			return
		}
		ctx.status = 200
		ctx.body = {post}
	} catch (err) {
		ctx.status = 404
		throw err
	}
})

export default router
