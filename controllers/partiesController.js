const sharp = require('sharp')
const Party = require('../models/partiesModel')
const catchAsync = require('../utils/CatchAsync')
const factory = require('./handlerFactory')
const upload = require('../utils/multerImages')

exports.uploadPartyCoverImage = upload.single('imageCover')
exports.resizePartyCoverImage = catchAsync(async (req, res, next) => {
    if (!req.file) return next()
    req.file.filename = `party-${req.params.id}-${Date.now()}-cover.jpeg`
    await sharp(req.file.buffer)
        .resize(500)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public/images/parties/coverImages/${req.file.filename}`)
    req.file.filenameSmall = `party-${req.params.id}-${Date.now()}-cover-small.jpeg`
    await sharp(req.file.buffer)
        .resize(100, 100)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public/images/parties/coverImages/${req.file.filenameSmall}`)
    next()
})
exports.updateParty = catchAsync(async (req, res, next) => {
    if (req.file) {
        req.body.imageCover = `${process.env.HOST || process.env.LOCAL_HOST}/images/parties/coverImages/${req.file.filename}`
        req.body.imageCoverSmall = `${process.env.HOST || process.env.LOCAL_HOST}/images/parties/coverImages/${req.file.filenameSmall}`
    }

    const doc = await Party.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    if (!doc) {
        return next(new AppError('No document found with that ID', 404))
    }
    res.status(200).json({
        status: 'success',
        data: { data: doc }
    })
})

exports.getAllParties = factory.getAll(Party)
exports.getParty = factory.getOne(Party, {path: 'participants'})
exports.createParty = factory.createOne(Party)
exports.deleteParty = factory.deleteOne(Party)