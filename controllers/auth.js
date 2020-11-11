const User = require('../Model/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncErrorHandler');
 

// @desc     Register a User
// @route    Post /api/v1/auth/register
// @access   Public
exports.register = asyncHandler(async (req,res,next) => {
    const {name,role,email,password} = req.body
    const user = await User.create({name,role,email,password});

    
    sendTokenResponse(user,200,res)
})      


// @desc     Register a User
// @route    Post /api/v1/auth/login
// @access   Public
exports.login = asyncHandler(async (req,res,next) => {
    const {email,password} = req.body;

    if(!email || !password) {
        return next(new ErrorResponse('Please provide an email and password',400))
    }

    // Check for user
    const user =  await User.findOne({email}).select('+password')
    if(!user) {
        return next(new ErrorResponse('Invalid credentials',401))
    }

    //Check password matches
    const isMatch = await user.matchPassword(password)
    if(!isMatch) {
        return next(new ErrorResponse('Invalid credentials',401))

    }
    // Create token
    const token = user.getSignedJwtToken();
    
    sendTokenResponse(user,200,res)
 
})      



// @desc     Register a User
// @route    Post /api/v1/auth/me
// @access   Private
exports.getMe = asyncHandler( async (req,res,next) => {
    const user = await User.findById(req.user.id)


    res.status(200).json({
        success: true,
        data: user
    })
})



// @desc     Register a User
// @route    Post /api/v1/auth/forgotpassword
// @access   Public
exports.forgotPassword = asyncHandler( async (req,res,next) => {
    const user = await User.findOne({email: req.body.email}) 

    if(!user) {
        return next(new ErrorResponse('There is no user with that email',401))
    }

    // Get reset token 
    const resetToken = user.getResetPasswordToken()
    await user.save({validateBeforeSave: false})
    res.status(200).json({
        success: true,
        data: user
    })
})











// Get token from model & Create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 *1000) , // 30days
        httpOnly: true  // httpOnly : true, will make the cookie access only from the clinet side scripts (frontEnd)
    }

    if(process.env.NODE_ENV === 'production') {
        options.secure = true
    }
    res
     .status(statusCode)
     .cookie('token',token,options)                         //cookie('the name we want to name the cookie', value/keys, options)
     .json({
         success: true,
         token
     })
}