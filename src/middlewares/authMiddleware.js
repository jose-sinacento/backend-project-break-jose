const jwt = require('jsonwebtoken')
const hashedSecret = require('../config/crypto')

function generateToken(user) {
    return jwt.sign({ user: user.id }, hashedSecret, {expiresIn: '1h'})
}

function verifyToken (req, res, next) {
    const token= req.session.token
    if(!token) {
        res.token(401).json({mensaje: 'Token not generated'})
    }
    jwt.verify(token, hashedSecret, (error, decode) => {
        if(error) {
            res.status(401).json({mensaje: 'Token invalid'})
        }
        req.user = decoded.user
        next()
    }) 
}

module.exports = {
    generateToken,
    verifyToken
}