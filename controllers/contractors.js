const Contractor = require('../Model/Contractor')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncErrorHandler');
const Well = require('../Model/Well')

// @desc     Get All contractors
// @route    Get /api/v1/contractors
// @route    Get /api/v1/wells/:wellsId/contractors
// @access   Public
exports.getContractors = asyncHandler(  async (req,res,next) => {
    let query;
   

        query = Contractor.find().populate({path:'wells', select: 'name'})
  

    const contractors = await query
    res.status(200).json(res.advancedResults) 

}) 
// @desc     Get a single contractor
// @route    Get /api/v1/contractors/:id
// @access   Public
exports.getContractor = asyncHandler( async (req,res,next) => {

        // console.log(req.params)
    const contractor = await Contractor.findById(req.params.id).populate({
        path: 'wells',
        select: 'name meditor'
    })

    if(!contractor) {
        return next(new ErrorResponse(`Contractor not found with id of ${req.params.id}`,404))
       
    }
    res.status(200).json({
        success: true,
        data: contractor

    })

})


// @desc     Create Contractor
// @route    Post /api/v1/Contractors/
// @access   Private
exports.createContractor = asyncHandler( async (req,res,next) => {
// Add user to req.body
req.body.user = req.user.id

//Check for published contractor  *meaning a user can create only one contractor which is himself*
const publishedContractor = await Contractor.findOne({user: req.user.id})
    if(publishedContractor && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Only admin can create a Contractor`))
    }
    const contractor = await Contractor.create(req.body)
   
    
  
    res.status(200).json({
        success: true,
        data:contractor

    })


})

// @desc     Add well for a  contractor
// @route    Post /api/v1/wells/:wellsId/contractors
// @access   Private
exports.addContractor = asyncHandler(  async (req,res,next) => {
    req.body.well = req.params.wellId;
    req.body.user = req.user.id
 
   const well =  await Well.findById(req.params.wellId);
    // console.log(well)
   if(!well) {
       return next(
           new ErrorResponse(`No well with the id of ${req.params.wellId}`,404)
       )
   }

     

   const contractor = await Contractor.create(req.body)
    console.log(contractor)
    res.status(200).json({
        success: true,
        count: contractor.length,
        data: contractor

    })

}) 


// @desc     Update Contractor
// @route    Put /api/v1/Contractors/:id
// @access   Private
exports.updateContractor = asyncHandler( async (req,res,next) => {


    const contractor = await Contractor.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators: true
    })
    if(!contractor) {
      return  next(new ErrorResponse(`Contractor not found with id of ${req.params.id}`,404))
    }
     // Make sure user is well owner
     if(contractor.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this contractor`,401))

    }
    res.status(200).json({
        success: true,
        data: contractor

    })


})

// @desc     Delete Contractor
// @route    Delete/api/v1/Contractors/:id
// @access   Private
exports.deleteContractor = asyncHandler( async (req,res,next) => {
    const contractor = await Contractor.findById(req.params.id)
    if(!contractor) {
      return  next(new ErrorResponse(`Contractor not found with id of ${req.params.id}`,404))
    }

        // Make sure user is well owner
        if(contractor.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this contractor`,401))
    
        }
    contractor.remove()
    res.status(200).json({
        success: true,
        data:{}

    })


})