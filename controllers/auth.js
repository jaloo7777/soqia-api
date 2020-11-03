const User = require('../Model/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncErrorHandler');
 

// @desc     Register a User
// @route    Post /api/v1/auth/register
// @access   Public
exports.register = asyncHandler(async (req,res,next) => {
    const {name,role,email,password} = req.body
    const user = await User.create({name,role,email,password});

    // Create token
    const token = user.getSignedJwtToken();
    console.log(token)
    res.status(200).json({ 
        success: true,
        data: user,
        token
    })
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
    
    res.status(200).json({
        success: true,
        token
    })
 
})      