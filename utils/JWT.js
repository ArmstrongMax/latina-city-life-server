const jwt = require('jsonwebtoken')

const tokenExpires = process.env.JWT_EXPIRES_IN

exports.signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: tokenExpires}
    )
}

exports.creatAndSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id)
    res.cookie('jwt', token, {
        expires: new Date(
            Date.now() + tokenExpires * 24*60*60*1000
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    })
    user.password = undefined
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {user}
    })
}
