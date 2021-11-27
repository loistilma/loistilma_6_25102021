const jwt = require('jsonwebtoken')
const { ErrorHandler } = require('../helpers/error.helper')

const requireAuth = (req, res, next) => {
    try {
        if (!req.headers.authorization) throw new ErrorHandler(403, 'Requête invalide')
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        if (req.body.userId && req.body.userId !== decodedToken.userId) throw new ErrorHandler(403, 'Utilisateur invalide')
        req.currentUser = decodedToken.userId
        next()

    } catch (error) {
        next(error)
    }
}

module.exports = {
    requireAuth
}