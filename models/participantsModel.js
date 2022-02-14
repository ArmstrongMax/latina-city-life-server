const mongoose = require('mongoose')

const participantsSchema = new mongoose.Schema({
    party:{
        type: mongoose.Schema.ObjectId,
        ref: 'Party',
        require: [true, 'Participation must belong to a Party']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: [true, 'Participation must belong to a User']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

participantsSchema.pre(/^find/, function (next) {
this.populate({
    path:'user',
    select:['firstName', 'photoSmall'],
}).populate({
    path: 'party',
    select: ['name', 'imageCoverSmall']
})
    next()
})

const Participants = mongoose.model('Participants', participantsSchema)
module.exports = Participants
