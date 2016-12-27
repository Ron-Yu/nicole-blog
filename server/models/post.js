import mongoose from 'mongoose'

export default mongoose.model('Post', {
	coverTitle: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	coverDesc: {
		type: String,
		trim: true,
		default: ''
	},
	coverImageUrl: {
		type: String,
		required: true,
		trim: true
	},
	contentTitle: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	contentImageUrl: {
		type: [String],
		default: []
	},
	contentBody: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	tag: {
		type: [String],
		default: []
	},
	published: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Number,
		default: null
	}
})
