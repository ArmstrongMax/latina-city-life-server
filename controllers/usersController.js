const sharp = require('sharp')
const User = require('./../models/usersModel')
const catchAsync = require('../utils/CatchAsync')
const factory = require('./handlerFactory')
const AppError = require('./../utils/AppError')
const upload = require('../utils/multerImages')
const filterObject = require('../utils/filterObject')


exports.uploadUserPhoto = upload.single('photo')
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next()
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`
    await sharp(req.file.buffer)
        .resize(500)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public/images/users/${req.file.filename}`)
    req.file.filenamesmall = `user-${req.user.id}-${Date.now()}-small.jpeg`
    await sharp(req.file.buffer)
        .resize(100, 100)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public/images/users/${req.file.filenamesmall}`)
    next()
})

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id
    next()
}
exports.updateMe = catchAsync(async (req,res, next)=> {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This rout is not for changing password. Please use updateMyPassword', 400))
    }
    const filteredBody = filterObject(req.body, 'firstName', 'lastName', 'email', 'dancingSince', 'danceStyles', 'school', 'communityStatus')
    if (req.file) {
        filteredBody.photo = `http://127.0.0.1:8000/images/users/${req.file.filename}`
        filteredBody.photoSmall = `http://127.0.0.1:8000/images/users/${req.file.filenamesmall}`
    }
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {new: true, runValidators:true})
    res.status(200).json({
        status: 'success',
        data: {user:updatedUser}
    })
})
exports.deleteMe = catchAsync(async (req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id, {active: false})
    res.status(200).json({
        status: 'success',
        data: null
    })
})

exports.getAllUsers = factory.getAll(User)
exports.getUser = factory.getOne(User)
exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined. Please use /signup instead'
    })
}
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)