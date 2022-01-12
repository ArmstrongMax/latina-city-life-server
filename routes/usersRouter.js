const express = require('express')
const usersController = require('../controllers/usersController')
const authController = require('../controllers/authController')

const usersRouter = express.Router()

usersRouter.post('/signup', authController.signup)
usersRouter.post('/login', authController.login)
usersRouter.get('/logout', authController.logout)
usersRouter.post('/forgotPassword', authController.forgotPassword)
usersRouter.patch('/resetPassword/:token', authController.resetPassword)

//----------------------------------------------------------------------
//Actions only for authorized users
usersRouter.use(authController.protect)

usersRouter.patch('/updateMyPassword', authController.updatePasword)
usersRouter.get('/me', usersController.getMe, usersController.getUser)
usersRouter.patch('/updateMe', usersController.uploadUserPhoto, usersController.resizeUserPhoto, usersController.updateMe)
usersRouter.delete('/deleteMe', usersController.deleteMe)

//----------------------------------------------------------------------
//Actions only for admins, moderators
usersRouter.use(authController.accessFor('admin', 'moderator'))

usersRouter
    .route('/')
    .get(usersController.getAllUsers)
    .post(usersController.createUser)
usersRouter
    .route('/:id')
    .get(usersController.getUser)
    .patch(usersController.updateUser)
    .delete(usersController.deleteUser)

module.exports = usersRouter