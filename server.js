const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const fileUpload = require('express-fileupload')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')

// Load env vars
dotenv.config({path:'./config/config.env'})
// Connect DB
connectDB();
const app = express();

//File Upload
app.use(fileUpload())

// CookieParser
app.use(cookieParser())
// Set static folder
app.use(express.static(path.join(__dirname,'public') ))
// Routes files
const wells = require('./routes/wells')
const contractors = require('./routes/contractors')
const medias = require('./routes/medias')
const auth = require('./routes/auth')
// Body parser
app.use(express.json())

// dev loggin middleware
if(process.env.NODE_ENV === 'development') {   
    app.use(morgan('dev'))
}

// Mount routers
app.use('/api/v1/wells', wells)
app.use('/api/v1/contractors', contractors)
app.use('/api/v1/medias', medias)
app.use('/api/v1/auth', auth)
const PORT = process.env.PORT || 7000
 


//Error middleware
app.use(errorHandler)
const server = app.listen(PORT,console.log( `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold))

 
//Handle unhandled promise rejections
process.on('unhandledRejection', (err,promise) => {
    console.log(`Error: ${err.message}`); 
    //Close server & exit process 
    server.close(() => process.exit(1))
})   