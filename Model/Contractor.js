const mongoose = require('mongoose')

const ContractorSchema = new mongoose.Schema({
    executor:{
        type: String,
        required:[true, 'Please add an executor'],
        unique: true,
        trim: true,
        maxlength: [50, "Name can not be more than 50 characters"]
    },

    batch: {
        type: String,
        required: [true, "Please add a batch"],
        enum: ['AG3','AG4','AG5','AG6']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // deliveryDate: {
    //     type: Date,
    //     default: Date.now
    // },
    delivered: {
        type: Boolean,
        default: false
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    }
  
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
})

// Cascade delete welles when contractor is deleted
ContractorSchema.pre('remove', async function(next) {
    console.log(`Wells of contractor ${this._id} has beign removed `)
    await this.model('Well').deleteMany({contractor: this._id})
})

// Reverse populate with virtuals
ContractorSchema.virtual('wells', {
    ref: 'Well',
    localField: '_id',
    foreignField: 'contractor',
    justOne: false
})


module.exports = mongoose.model('Contractor', ContractorSchema)