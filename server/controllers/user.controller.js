const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const { ErrorHandler, formatDBError } = require('../helpers/error.helper')

exports.signup = async (req, res, next) => {
	const user = new User({
		email: req.body.email,
		password: req.body.password
	})

	try {
        await user.save()
        res.status(201).json({ message: 'Utilisateur créé !' })
    } catch (error) {
        next(new ErrorHandler(400, formatDBError(error.message)))
    }
}

exports.login = async (req, res, next) => {
    try{
        const user = await User.findOne({ email: req.body.email })
        if (!user) throw new ErrorHandler(400, 'Utilisateur non trouvé !')
        
        user.comparePassword(req.body.password, function(err, isMatch) {
            if (err) return res.status(500).json({ message: 'Internal Server Error' })
            if(!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect !' })

            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE }
                )
            })
        })

    } catch (error) {
        next(error)
    }
}