const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const morgan = require('morgan')
const xss = require('xss-clean')
const fileUpload = require('express-fileupload')
const connectDB = require('./config/db')
const errorHandler = require('./middleware/error')

// Load env vars
dotenv.config({path:'./config/config.env'})
// Connect DB
connectDB();
const app = express();

// Body parser
app.use(express.json())

// dev loggin middleware
if(process.env.NODE_ENV === 'development') {   
    app.use(morgan('dev'))
}  


//File Upload
app.use(fileUpload())

// CookieParser
app.use(cookieParser())

app.use(mongoSanitize())  // Prevent nosql injection sanitize data  
 // "email": {"$gt":""},"password": "123456" this way if we got the password correct we can log in without the email  that why we do use sanatize


 // Set security headers
 app.use(helmet())

 // Prevent XSS attacks  it means we dont want html scripts to be added within a body
app.use(xss())


// Set static folder
app.use(express.static(path.join(__dirname,'public') ))
// Routes files
const wells = require('./routes/wells')
const contractors = require('./routes/contractors')
const medias = require('./routes/medias')
const auth = require('./routes/auth')
const users = require('./routes/users')


// Mount routers
app.use('/api/v1/wells', wells)
app.use('/api/v1/contractors', contractors)
app.use('/api/v1/medias', medias)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users) 
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