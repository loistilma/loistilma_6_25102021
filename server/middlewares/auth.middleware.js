const jwt = require('jsonwebtoken')
const { ErrorHandler } = require('../helpers/error.helper')
const Sauce = require('../models/sauce.model')
const User = require('../models/user.model')

const userIdFromToken = (req) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        return decodedToken.userId
    } else {
        throw new ErrorHandler(403, 'Requête invalide')
    }
}

const requireAuth = (req, res, next) => {
    try {
            const currentUser = userIdFromToken(req)
            //console.log(currentUser)
            if (req.body.userId && req.body.userId !== currentUser) throw new ErrorHandler(403, 'Utilisateur invalide')
            next()

    } catch(error) {
        next(error)
    }
}

const checkSauceAdmin = async (req, res, next) => {
    try {
            const currentUser = userIdFromToken(req)
            const sauceFound = await Sauce.findOne({ _id: req.params.id })
            if(!sauceFound) throw new ErrorHandler(404, 'Erreur lors de la récupération de la sauce')
            if (sauceFound.userId !== currentUser) throw new ErrorHandler(403, 'Utilisateur invalide')
            next()

    } catch(error) {
        next(error)
    }
}

module.exports = {
	requireAuth,
    checkSauceAdmin
}