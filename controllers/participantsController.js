const Participants = require('../models/participantsModel')
const factory = require('../controllers/handlerFactory')

exports.setPartyUserIds = (req, res, next) => {
    if(!req.body.party) req.body.party = req.params.partyId
    if(!req.body.user) req.body.user = req.user.id
    next()
}
exports.getAllParticipants = factory.getAll(Participants)
exports.getParticipant = factory.getOne(Participants)
exports.createParticipant = factory.createOne(Participants)
exports.updateParticipant = factory.updateOne(Participants)
exports.deleteParticipant = factory.deleteOne(Participants)