const mongoose = require('mongoose')
const slugify = require("slugify");
const geocoder = require('../utils/geocoder')
const WellSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
    trim: true,
   
    maxlength: [50, "Name can not be more than 50 characters"],
  },
    slug: String,
    meditor: {
        type: String,
        required: [true, 'please add a meditor'],
        unique: true
    },
    dateOfOrder: {
      type: Date,
      default: Date.now
    },
    typeOfWell: {
        type: [String],
        required: [true, 'choose a type'],
        enum: ["مضخة", "ارتوازي", "عادي"]
    },
    description: {
        type: String,
        required: [false, "Please add  a description"],
        maxlength: [500, "Description can not be more than 500 characters"],
      },
      address: {
        type: String,
        required: [true, "please add an address"],
      },
      location: {
        type: {
          type: String,
          enum: ["Point"],
        },
        coordinates: {
          type: [Number],
  
          index: "2dsphere",
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
        countryCode: String,
        stateCode: String
      },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    contractor: {
      type: mongoose.Schema.ObjectId,
      ref: 'Contractor',
      required: false
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
})

// Create bootcamp slug from the name *** we should use the normal function not the arrow one
WellSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {lower: true});
  next()
})


// Geocode Create location field
WellSchema.pre('save', async function(next) {
  const loc = await geocoder.geocode(this.address);
  // console.log(loc)
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    city: loc[0].city,
    street: loc[0].streetName,
    zipcode: loc[0].zipcode,
    country: loc[0].country,
    countryCode: loc[0].countryCode,
    stateCode : loc[0].stateCode

  }
  // console.log(loc)
  this.address  = undefined
})
module.exports = mongoose.model('Well', WellSchema)