const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    branchId: {
        type: String,
        required: [true, 'Branch ID is required'],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: [true, 'Branch name is required'],
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    managerName: {
        type: String,
        trim: true
    },
    contactPhone: {
        type: String,
        trim: true
    },
    contactEmail: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
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

module.exports = mongoose.model('Branch', branchSchema);
