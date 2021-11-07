const User = require('../models/user.model')
const jwt = require('jsonwebtoken')

const errorValidationFormatter = (e) => {
    const err = []
    const errStr = e.substring(e.indexOf(':') + 1).trim()
    const errArray = errStr.split(',').map(e => e.trim())
    errArray.forEach(e => {
        err.push(e.substring(e.indexOf(':') + 1).trim() + '\n')
    })
    return err.join('')
}

exports.signup = async (req, res, next) => {
	const user = new User({
		email: req.body.email,
		password: req.body.password
	})

	try {
        await user.save()
        res.status(201).json({ message: 'Utilisateur créé !' })
    } catch (e) {
        res.status(400).json({ message: errorValidationFormatter(e.message) })
    }
}

exports.login = async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email })
	if (!user) return res.status(401).json({ error: 'Utilisateur non trouvé !' })
	user.comparePassword(req.body.password, function(err, isMatch) {
		if (err) throw err
        if(!isMatch) res.status(401).json({ error: 'Mot de passe incorrect !' })		
		else res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.JWT_SECRET,
              { expiresIn: '24h' }
            )
        })
	})
}