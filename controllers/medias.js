const Media = require('../Model/Media')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncErrorHandler');


// @desc     Get All Medias
// @route    Get /api/v1/media
// @access   Public
exports.getMedias = asyncHandler(  async (req,res,next) => {
    let query;
   

        query = Media.find()
  

    const medias = await query
    res.status(200).json({
        success: true,
        count: medias.length,
        data: medias

    }) 

}) 
// @desc     Get a single Media
// @route    Get /api/v1/medias/:id
// @access   Public
exports.getMedia = asyncHandler( async (req,res,next) => {

        // console.log(req.params)
    const media = await Media.findById(req.params.id)

    if(!media) {
        return next(new ErrorResponse(`Media not found with id of ${req.params.id}`,404))
       
    }
    res.status(200).json({
        success: true,
        data: media

    })

})


// @desc     Create Media
// @route    Post /api/v1/medias/
// @access   Private
exports.createMedia = asyncHandler( async (req,res,next) => {


    const media = await Media.create(req.body)
   
    
  
    res.status(200).json({
        success: true,
        data:media

    })


})


// @desc     Update Media
// @route    Put /api/v1/medias/:id
// @access   Private
exports.updateMedia = asyncHandler( async (req,res,next) => {


    const media = await Media.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators: true
    })
    if(!media) {
      return  next(new ErrorResponse(`Media not found with id of ${req.params.id}`,404))
    }
   
    res.status(200).json({
        success: true,
        data: media

    })


})

// @desc     Delete Media
// @route    Delete/api/v1/media/:id
// @access   Private
exports.deleteMedia = asyncHandler( async (req,res,next) => {


    const media = await Media.findById(req.params.id)
    if(!media) {
      return  next(new ErrorResponse(`Media not found with id of ${req.params.id}`,404))
    }
    
    media.remove()
    res.status(200).json({
        success: true,
        data:{}

    })


})