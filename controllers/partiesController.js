const sharp = require('sharp')
const Party = require('../models/partiesModel')
const catchAsync = require('../utils/CatchAsync')
const factory = require('./handlerFactory')
const upload = require('../utils/multerImages')

exports.uploadPartieImages = upload.fields([
    {name: 'imageCover', maxCount: 1},
    {name: 'images', maxCount: 5}
])
exports.resizePartiesImages = catchAsync(async (req, res, next) => {
    if (!req.files.imageCover || !req.files.images) return next()
    //Cover image
    req.body.imageCover = `party-${req.params.id}-${Date.now()}-cover.jpeg`
    await sharp(req.files.imageCover[0].buffer)
        .resize(1500, 1500)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public/images/parties/${req.body.imageCover}`)

//Other images
    req.body.images = []
    await Promise.all(
        req.files.images.map( async (file, i) => {
            const fileName = `party-${req.params.id}-${Date.now()}-${i+1}.jpeg`
            await sharp(file.buffer)
                .toFormat('jpeg')
                .jpeg({quality: 90})
                .toFile(`public/images/parties/${fileName}`)

            req.body.push(fileName)
        })
    )
    next()
})

exports.getAllParties = factory.getAll(Party)
exports.getParty = factory.getOne(Party, {path: 'participants'})
exports.createParty = factory.createOne(Party)
exports.updateParty = factory.updateOne(Party)
exports.deleteParty = factory.deleteOne(Party)