const User = require('../models/user.model')
const jwt = require('jsonwebtoken')

exports.signup = async (req, res, next) => {
	const user = new User({
		email: req.body.email,
		password: req.body.password
	})

	try {
        await user.save()
        res.status(201).json({ message: 'Utilisateur créé !' })
    } catch (e) {
        res.status(400).json(e.message)
    }
}