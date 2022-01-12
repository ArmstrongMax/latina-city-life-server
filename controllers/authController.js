const {promisify} = require('util')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const JWT = require('../utils/JWT')
const User = require('../models/usersModel')
const CatchAsync = require('../utils/CatchAsync')
const AppError = require('../utils/AppError')

exports.protect = CatchAsync(async (req, res, next) => {
    // 1) Getting token and check of it's there
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt
    }
    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401))
    }

    // 2) Verification token
    const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    // 3) Check if user still exists
    const currentUser = await User.findById(decodedToken.id)
    if (!currentUser) return next(new AppError('The user belonging to this token does no longer exist.', 401))

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decodedToken.iat)) {
        return next(new AppError('User recently changed password! Please log in again.', 401))
    }
    //5) Grant access
    req.user = currentUser
    next()
})
exports.accessFor = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.systemRole)) return next(new AppError('You don\'t have permission for this action', 403))
        next()
    }
}
exports.signup = CatchAsync(async (req, res, next) => {
    const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    })
    const url = `${req.protocol}://${req.get('host')}/me`

//TODO   await new Email(newUser, url).sendWelcome();

    JWT.creatAndSendToken(newUser, 201, req, res)
})
exports.login = CatchAsync(async (req, res, next) => {
    const {email, password} = req.body

    if (!email || !password) return next(new AppError('Please provide email and password!', 400))
    const user = await User.findOne({email}).select('+password')

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }
    JWT.creatAndSendToken(user, 200, req, res)
})
exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    res.status(200).json({status: 'success'})
}
exports.forgotPassword = CatchAsync(async (req, res, next) => {
    //Get User
    const user = await User.findOne({email: req.body.email})
    if (!user) return next(new AppError('There is no user with email address.', 404))

    //Generate reset token
    const resetToken = user.createPasswordResetToken()
    await user.save({validateBeforeSave: false})

    //Send token to user
    try {
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/user/resetPassword/${resetToken}`
        //TODO await new Email (user, resetUrl).sendPasswordReset()
        res.status(200).json({
            status: 'success',
            message: 'Reset token has been send to email'
        })
    } catch (e) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({validateBeforeSave:false})
        return next(new AppError('There was an error sending the email. Try again later!',500))
    }
})
exports.resetPassword = CatchAsync(async (req, res, next)=>{
    //Get user based on token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    })

    //If token has not expired and there is user, set the new password
    if (!user) return next(new AppError('Token is invalid or has expired', 400))
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()

    //login the user, send JWT
    JWT.creatAndSendToken(user, 200, req, res)
})
exports.updatePasword = CatchAsync(async (req, res, next)=>{
    //get user
    const user = await User.findById(req.user.id).select('+password')

    //Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))){
        return next(new AppError('Your current password is wrong.', 401))
    }

    //Update password
    user.password = req.body.password
    user.passwordConfirm = req.body.passwordConfirm
    await user.save()

    //Login user, send JWT
    JWT.creatAndSendToken(user, 200, req, res)
})

