const express = require('express')
const imagesController = require('../controllers/imagesController')

const imagesRouter = express.Router()

imagesRouter.get('/parties/coverImages/:imageName', imagesController.getImage('cover'))
imagesRouter.get('/users/:imageName', imagesController.getImage('user'))
imagesRouter.get('/images/:imageName', imagesController.getImage('partyImage'))

module.exports = imagesRouter