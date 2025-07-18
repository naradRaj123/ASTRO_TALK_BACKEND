const mongoose = require('mongoose')

const astroLogerSchema = new mongoose.Schema({
    astroName: {
        type: String,
        require: true,
        default: null,
    },
    astroDob: {
        type: String,
        require: true,
        default: null,
    },
    mobile: {
        type: Number,
        require: true,
        unique: true,
    },
    email: {
        type: String,
        require: true,
        default: null,
    },
    password: {
        type: String,
        require: true,
        default: null,
    },
    city: {
        type: String,
        require: true,
        default: null,
    },
    profileImg: {
        type: String,
        default: null,
    },
    experience: {
        type: String,
        default: 0,
    },
    expertise: {
        type: String,
        require: true,
        default: null,
    },
    langauge: {
        type: String,
        default: "Hindi",
        require: true,
    },
    shortBio: {
        type: String,
        default: null,
    },
    chargePerSession: {
        type: Number,
        default: null,
    },
    availableTime: {
        type: String,
        default: null,
    },
    verifyDocument: {
        type: String,
        default: null,
    },
    bankDetails: {
        type: String,
        default: null
    },
    role: {
        type: String,
        default: null,
    },
    agoraChannel: {
        type: String,
        unique: true,
        default: null,
    },
    agoraUID: {
        type: Number,
        default: null
    },
    agoraToken: {
        type: String,
        default: null
    },
    wallet: {
        type: Number,
        default: 100,
        require: true,
    },
    status: {
        type: Boolean,
        default: true,
        require: true,
    },
    accountType: {
        type: String,
        default: "Normal",
        require: true
    },
    otp: {
        code: { type: String },
        expiresAt: { type: Date },
        verified: { type: Boolean, default: false }
    },
}, {
    timeseries: true,
});

const astrologer_schema = mongoose.model('Astrologer', astroLogerSchema);
module.exports = astrologer_schema;