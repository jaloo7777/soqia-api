const User = require('../Model/User')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncErrorHandler');
 

// @desc     Register a User
// @route    Post /api/v1/users
// @route    Post /api/v1/users
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