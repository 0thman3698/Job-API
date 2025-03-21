const User = require('../models/User')
const { UnauthenticatedError } = require('../errors')
const jwt = require('jsonwebtoken')

const auth = (req, res, next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError('Authenication Invaild')
    }
    const token = authHeader.split(' ')[1]

     
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = {userId:payload.userId, name:payload.name}

        next();
    } catch (error) {
        throw new UnauthenticatedError('Authenication Invaild')

    }
}
module.exports= auth