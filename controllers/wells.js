const Well = require('../Model/Well')
const Contractor = require('../Model/Contractor')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncErrorHandler')

// @desc     Get all wells
// @route    Get /api/v1/wells
// @route    Get /api/v1/contractors/contractorId/wells

// @access   Public
exports.getWells = asyncHandler( async (req,res,next) => {
      ///////////////////////////////////////////////////////
      if(req.params.contractorId){
        const wells =  await Well.find({contractor: req.params.contractorId})
         
           res.status(200).json({
               success: true,
               count: wells.length,
               data: wells
       
           })
       } 
    res.status(200).json(res.advancedResults)
    
})


// @desc     Get a single well
// @route    Get /api/v1/wells/:id
// @access   Public
exports.getWell = asyncHandler(  async (req,res,next) => {
    let well;
        
         well = await Well.findById(req.params.id).populate({
            path: 'contractor',
            select: 'executor'
        })

        if(!well) {
            return next(new ErrorResponse(`Well not found with id of ${req.params.id}`,404))
           
        }
        res.status(200).json({
            success: true,
            data: well
    
        })
  
})


// @desc     Create well
// @route    Post /api/v1/wells
// @access   Private
exports.createWell = asyncHandler( async (req,res,next) => {
// Add user to req.body
req.body.user = req.user.id   
        const well = await Well.create(req.body)
       
        res.status(201).json({ 
            success: true,
            data: well
    
        }) 

})
 

// @desc     Add contractor to a well
// @route    Post /api/v1/contractors/:contractorId/wells
// @access   Private
exports.addeWell = asyncHandler( async (req,res,next) => {

    req.body.contractor = req.params.contractorId
    req.body.user = req.user.id

    const contractor = await Contractor.findById(req.params.contractorId)
   
    if(!contractor) {
        return next (
            new ErrorResponse(`No contractor with the id of ${req.params.contractorId}`,404)
        )
    }

    // Make sure user is well owner
    if(contractor.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add to this well ${contractor._id}`,401))
        
    }
    
    const well = await Well.create(req.body)
    
    res.status(201).json({ 
        success: true,
        data: well

    }) 

})
// @desc     update well
// @route    Put /api/v1/wells/:id
// @access   Private
exports.updateWell = asyncHandler(  async (req,res,next) => {

    let well =  await Well.findById(req.params.id)

    if(!well) {
        return next(new ErrorResponse(`Well not found with id of ${req.params.id}`,404))
    }
    // Make sure user is well owner
    if(well.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this well`,401))

    }
    well =  await Well.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        data: well

    })
})

// @desc     Delete well
// @route    Delete/api/v1/wells/:id
// @access   Private
exports.deleteWell = asyncHandler( async (req,res,next) => {


        let well = await Well.findById(req.params.id)
        if(!well) {
          return  next(new ErrorResponse(`Well not found with id of ${req.params.id}`,404))
        }
          // Make sure user is well owner
    if(well.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this well`,401))

    }

    well = await Well.findByIdAndDelete(req.params.id)
        res.status(200).json({
            success: true,
            data:{}
    
        })
   
   
})