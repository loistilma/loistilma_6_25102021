const jwt = require('jsonwebtoken')

const extractUserId = (req) => {

    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decodedToken.userId
    
    if (req.body.userId && req.body.userId !== userId) {
        throw 'Invalid user ID'
    } else {
        return userId
    }

}

module.exports = { extractUserId }