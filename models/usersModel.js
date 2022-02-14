const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

const usersSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'User must have a name'],
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email:{
        type:String,
        required: [true, 'User must have a email'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo:{
        type: String,
        default: `${process.env.HOST || process.env.LOCAL_HOST}/images/users/defaultUserImage.png`
    },
    photoSmall:{
        type: String,
        default: `${process.env.HOST || process.env.LOCAL_HOST}/images/users/defaultUserImage-small.png`
    },

    systemRole: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        match: [/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'Minimum eight characters, at least one letter and one number'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function(item) {
                return item === this.password
            }, message: 'Passwords are not the same'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    dancingSince:Date,
    communityStatus:{
        type: String,
        enum: ['танцор', 'преподаватель', 'организатор', 'наблюдатель'],
        default: 'танцор'
    },
    danceStyles:{
        type: String
    },
    school:String
})

usersSchema.virtual('danceExperience').get(function() {
    return (Date.now() - this.dancingSince) / 1000 / 60 / 60 / 24 / 365
})

usersSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    this.passwordConfirm = undefined
    next()
})
usersSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next()
    this.passwordChangedAt = Date.now() - 1000
    next()
})
usersSchema.pre(/^find/, function(next) {
    this.find({ active: {$ne:false}})
    next()
})

usersSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}
usersSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
        return JWTTimestamp < changedTimestamp
    }
    return false
}
usersSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetToken = Date.now() + 10 * 60 * 1000
    return resetToken
}

const User = mongoose.model('User', usersSchema)

module.exports = User