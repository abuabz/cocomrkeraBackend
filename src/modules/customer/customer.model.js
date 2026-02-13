const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        required: false
    },
    altPhone: {
        type: String
    },
    place: {
        type: String,
        required: false
    },
    treeCount: {
        type: Number,
        default: 0
    },
    lastHarvest: {
        type: Date
    },
    nextHarvest: {
        type: Date
    },
    mapUrl: {
        type: String
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    },
    toObject: { virtuals: true }
});

module.exports = mongoose.model('Customer', customerSchema);
