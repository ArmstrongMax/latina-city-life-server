const express = require('express')
const authController = require('../controllers/authController')
const participantsController = require('../controllers/participantsController')

const participantsRouter = express.Router()

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

module.exports = participantsRouter
