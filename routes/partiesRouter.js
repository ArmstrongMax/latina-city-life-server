const express = require('express')
const partiesController = require('../controllers/partiesController')

const partiesRouter = express.Router()

partiesRouter
    .route('/')
    .get(partiesController.getAllParties)
    .post(partiesController.createParty)

partiesRouter
    .route('/:id')
    .get(partiesController.getParty)
    .patch(partiesController.updateParty)
    .delete(partiesController.deleteParty)

module.exports = partiesRouter