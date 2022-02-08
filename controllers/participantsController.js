const Participants = require('../models/participantsModel')
const factory = require('../controllers/handlerFactory')
const catchAsync = require('../utils/CatchAsync')

exports.setPartyUserIds = (req, res, next) => {
    if (!req.body.party) req.body.party = req.params.partyId
    if (!req.body.user) req.body.user = req.user.id
    next()
}

exports.getPartyParticipation = catchAsync(async (req, res, next) => {
    const partyId = req.params.id
    const partyParticipation = await Participants.find({
        party: partyId
    }).select(['-party', '-createdAt', '-__v'])
    res.status(200).json({
        status: 'success',
        results: partyParticipation.length,
        data: {
            data: partyParticipation
        }
    })
})
exports.getUserParticipation = catchAsync(async (req, res, next) => {
    const userId = req.params.id
    const userParticipation = await Participants.find({
        user: userId
    }).select(['-user', '-createdAt', '-__v'])
    res.status(200).json({
        status: 'success',
        results: userParticipation.length,
        data: {
            data: userParticipation
        }
    })
})
exports.getAllParticipants = factory.getAll(Participants)
exports.getParticipant = factory.getOne(Participants)
exports.createParticipant = factory.createOne(Participants)
exports.updateParticipant = factory.updateOne(Participants)
exports.deleteParticipant = factory.deleteOne(Participants)