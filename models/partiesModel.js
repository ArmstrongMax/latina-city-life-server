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
        planner: {
            type: String,
            required: [true, 'Party must have a planner'],
            trim: true
        },
        plannerContacts: [String],
        dressCode: {
            type: String,
            trim: true
        },
        fullPrice: {
            type: Number,
            required: [true, 'Party must have price']
        },
        minPrice: {
            type: Number
        },
        discountRequirements: {
            type: String,
            trim: true
        },
        paymentMethod: {
            type: String,
            enum: ['cash', 'card', 'transfer'],
            default: 'cash',
            trim: true
        },
        placePoint: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            },
        placeAddress: {
            description: {
                type:String,
                trim: true
            },
            address: {
                type:String,
                trim: true,
                required: true
            }
        },
        description: {
            type: String,
            trim: true
        },
        timeStart: {
            type: Date,
            required: [true, 'Party must have start time'],
        },
        timeEnd: {
            type: Date,
            required: [true, 'Party must have ending time']
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        danceStyles: {
            type: String,
            enum: ['bachata', 'salsa', 'kizomba', 'zouk', 'tango'],
            default: 'bachata'
        },
        participants: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        imageCover: {
            type: String
        },
        images: [String],
        djs: [{type:String, trim: true}],
        hasPhotographer:
            {
                type: Boolean,
                default: false
            },
        hasVideographer:
            {
                type: Boolean,
                default: false
            },
        photographer: {type:String, trim: true},
        videographer:  {type:String, trim: true},
        hasBar:{
            type: Boolean,
            default: false
        },
        musicFormat: {type:String, trim: true}
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