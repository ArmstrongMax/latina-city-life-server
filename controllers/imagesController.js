const catchAsync = require('../utils/CatchAsync')
const fs = require ('fs')
const path = require('path')


exports.getImage = (source) => catchAsync(async (req, res, next) => {
    let imagePath
    switch (source) {
        case 'cover': {
            imagePath = path.resolve(`${__dirname}/../public/images/parties/coverImages/${req.params.imageName}`)
            break
        }
        case 'user': {
            imagePath = path.resolve(`${__dirname}/../public/images/users/${req.params.imageName}`)
            break
        }
        case 'partyImage': {
            imagePath = path.resolve(`${__dirname}/../public/images/parties/partiesImages/${req.params.imageName}`)
            break
        }
        default: return null
    }
    res.status(200).sendFile(imagePath)
})


