const express = require('express')
const authController = require('../controllers/authController')
const participantsController = require('../controllers/participantsController')

const participantsRouter = express.Router()

participantsRouter.route('/party/:id').get(participantsController.getPartyParticipation)

participantsRouter.use(authController.protect)

participantsRouter
    .route('/')
    .get(participantsController.getAllParticipants)
    .post(authController.accessFor('user'), participantsController.setPartyUserIds, participantsController.createParticipant)

participantsRouter
    .route('/:id')
    .get(participantsController.getParticipant)
    .patch(participantsController.updateParticipant)
    .delete(participantsController.deleteParticipant)

participantsRouter.route('/user/:id').get(participantsController.getUserParticipation)

module.exports = participantsRouter
