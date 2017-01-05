import mongoose from 'mongoose'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import _ from 'lodash'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		minlength: 1,
		unique: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email'
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	tokens: [{
		access: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		}
	}]
})

UserSchema.methods.toJSON = function () {
	const user = this
	const userObject = user.toObject()

	return _.pick(userObject, ['_id', 'email'])
}

UserSchema.methods.generateAuthToken = async function () {
	const user = this
	const access = 'auth'
	const token =
		jwt
			.sign(
				{_id: user._id.toHexString(), access},
				process.env.JWT_SECRET
			)
			.toString()

	user.tokens.push({access, token})

	await user.save()
	return token
}

UserSchema.methods.removeToken = async function (token) {
	const user = this

	return await user.update({
		$pull: {
			tokens: {token}
		}
	})
}

UserSchema.statics.findByToken = async function (token) {
	const User = this
	let decoded

	try {
		decoded = jwt.verify(token, process.env.JWT_SECRET)
	} catch (err) {
		throw err
	}

	return await User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

UserSchema.statics.findByCredentials = async function (email, password) {
	const User = this

	const user = await User.findOne({email})
	if (!user) {
		return Promise.reject()
	}
	const result = await bcrypt.compare(password, user.password)
	return result ? user : Promise.reject()
}

UserSchema.pre('save', async function (next) {
	const user = this

	if (user.isModified('password')) {
		const saltRounds = 10
		const hash = await bcrypt.hash(user.password, saltRounds)

		user.password = hash
		next()
	} else {
		next()
	}
})

const User = mongoose.model('User', UserSchema)

export default User
