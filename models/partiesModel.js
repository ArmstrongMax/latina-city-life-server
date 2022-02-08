const mongoose = require('mongoose')

const partiesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Party must have a name'],
            maxlength: [240, 'Max 240 symbols'],
            minlength: [3, 'Min 3 symbols'],
            trim: true
        },
        date: {
            type: Date,
            required: [true, 'Party must have a date']
        },
        fullPrice: {
            type: Number,
            required: [true, 'Party must have price']
        },
        placeAddress:  {
            type:String,
            trim: true,
            required: true
        },
        description: {
            type: String,
            trim: true
        },
        timeStart: {
            type: String,
            required: [true, 'Party must have start time'],
        },
        timeEnd: {
            type: String,
            required: [true, 'Party must have ending time']
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        danceStyles: {
            type: String,
            default: 'bachata'
        },
        participants: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        imageCover: {
            type: String,
            default: 'http://127.0.0.1:8000/images/coverImages/defaultCoverImage.jpg'
        },
        images: [String],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

partiesSchema.index({place: '2dsphere'})
partiesSchema.pre(/^find/, function(next) {
    this.populate({path: 'participants', select:'-__v'})
    next()
})

const Party = mongoose.model('Party', partiesSchema)
module.exports = Party