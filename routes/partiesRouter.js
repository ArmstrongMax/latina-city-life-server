const express = require('express')
const partiesController = require('../controllers/partiesController')
const authController = require('../controllers/authController')

const partiesRouter = express.Router()

partiesRouter
    .route('/')
    .get(partiesController.getAllParties)
    .post(authController.protect, partiesController.createParty)

partiesRouter
    .route('/:id')
    .get(partiesController.getParty)
    .patch(authController.protect, partiesController.updateParty)
    .delete(authController.protect, partiesController.deleteParty)

module.exports = partiesRouter