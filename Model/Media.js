const mongoose = require('mongoose')

const MediaSchema = new mongoose.Schema({
    wellStatus: {
        type: String,
        required: true,
        enum: ['Delivered', 'Not Delivered']
    },
    deleveryDate: {
        type: Date,
        default: Date.now
    },
    photo: {
        type: [String],
        default: ["no-photo.jpg"],
      },
    dateOfUpload: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        required: false
    }

})

module.exports = mongoose.model('Media',MediaSchema)