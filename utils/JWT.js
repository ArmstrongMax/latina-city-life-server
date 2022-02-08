const jwt = require('jsonwebtoken')

const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN}
    )
}

exports.creatAndSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id)
    res.cookie('jwt', token, {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_IN * 24*60*60*1000
        ),
        httpOnly: true,
        sameSite: "none",
        secure:true
    })
    user.password = undefined
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {user}
    })
}
