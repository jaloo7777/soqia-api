const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

//Load env vars
dotenv.config({path: "./config/config.env"})

// Load models
const Well = require('./Model/Well')
const Contractor = require('./Model/Contractor')
const Media = require('./Model/Media')
const User = require('./Model/User')
// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

// Read JSON files
const wells = JSON.parse(fs.readFileSync(`${__dirname}/_data/wells.json`, 'utf-8'))
const contractors = JSON.parse(fs.readFileSync(`${__dirname}/_data/contractors.json`, 'utf-8'))
const medias = JSON.parse(fs.readFileSync(`${__dirname}/_data/medias.json`, 'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'))


// Import into DB
const importData = async () => {
    try {
        await Well.create(wells)
        await Contractor.create(contractors)
        await Media.create(medias)
        await User.create(users)
        console.log('Data imported..............'.green.inverse)
        process.exit()
    } catch (err) {
        console.log(err)
    }
}

// Delete Data
const deleteData = async () => {
    try {
        await Well.deleteMany()
        await Contractor.deleteMany()
        await Media.deleteMany()
        await User.deleteMany()
        console.log('Data Destroyed..............'.red.inverse)
        process.exit()
    } catch (err) {
        console.log(err)      
    }
}

if(process.argv[2] === '-i'){
    importData()
} else if (process.argv[2] === '-d') {
    deleteData()
}