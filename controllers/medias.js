const path = require('path')
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
    req.body.user = req.user.id
 
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


// @desc     Upload photo for Media
// @route    PUT /api/v1/media/:id/photo
// @access   Private
exports.mediaPhotoUpload = asyncHandler( async (req,res,next) => {


    const media = await Media.findById(req.params.id)
    if(!media) {
      return  next(new ErrorResponse(`Media not found with id of ${req.params.id}`,404))
    }

    if(!req.files) {
        return next(new ErrorResponse(`Please upload a photo`, 400))
    }
   
    const file = req.files.file;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400))

    }

    // checking fileSize
    if(file.size > process.env.MAX_FILE_UPLOAD) {
          return next(new ErrorResponse(`Please upload an image file less than ${process.env.MAX_FILE_UPLOAD}`, 400))

    }

    // Create custom filename     doing this so it dose not override the previous file with the ( same name )
    // dont forget to add the extension using path
        file.name = `photo_${media.id}${path.parse(file.name).ext}`

        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
            if (err) {
                console.error(err);
                return next(new ErrorResponse(`Problem with file upload`, 500))

            }

            await Media.findByIdAndUpdate(req.params.id, {photo: file.name});

            res.status(200).json({
                success: true,
                data: file.name
            })
        })
})