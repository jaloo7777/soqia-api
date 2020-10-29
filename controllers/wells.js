const Well = require('../Model/Well')
const Contractor = require('../Model/Contractor')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/asyncErrorHandler')

// @desc     Get all wells
// @route    Get /api/v1/wells
// @route    Get /api/v1/contractors/contractorId/wells

// @access   Public
exports.getWells = asyncHandler( async (req,res,next) => {
    let query;

    // Copy req.query
    const reqQuery = {...req.query}
    // Fields to exclude
    const removeFields = ["select", "sort", "limit", "page"];
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    let queryStr = JSON.stringify(reqQuery)

    
    query = Well.find(JSON.parse(queryStr)).populate({
        path: 'contractor',
        select: ' executor batch'
    })
 
    // Select fields
    if(req.query.select) {
        const fields = req.query.select.split(',').join(' ')
        query = query.select(fields)
    }

    // Sort 
    if(req.query.sort) {
        const sortBy = req.query.sort.split(",").join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdAt')
    }

    // Pagination 
    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total =  await Well.countDocuments()

    query = query.skip(startIndex).limit(limit)
   
    

    ///////////////////////////////////////////////////////
    if(req.params.contractorId){
     const wells =  await Well.find({contractor: req.params.contractorId})
      
        res.status(200).json({
            success: true,
            count: wells.length,
            data: wells
    
        })
    } 
    const wells = await query
   // Pagination Result
   const pagination = {};

   if(endIndex < total) {
       pagination.next = {
           page: page + 1,
           limit
       }
   }
   if(startIndex > 0) {
       pagination.prev = {
           page: page -1,
           limit
       }
   }
    res.status(200).json({
        success: true,
        count: wells.length,
        pagination,
        data: wells

    })
    
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
// console.log(req.body.contractor)
// console.log(req.params.id)
console.log('hollllllllla')
    req.body.contractor = req.params.contractorId
   
    const contractor = await Contractor.findById(req.params.contractorId)
   
    if(!contractor) {
        return next (
            new ErrorResponse(`No contractor with the id of ${req.params.con}`,404)
        )
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

    const well =  await Well.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if(!well) {
        return next(new ErrorResponse(`Well not found with id of ${req.params.id}`,404))
    }
    res.status(200).json({
        success: true,
        data: well

    })
})

// @desc     Delete well
// @route    Delete/api/v1/wells/:id
// @access   Private
exports.deleteWell = asyncHandler( async (req,res,next) => {


        const well = await Well.findByIdAndDelete(req.params.id)
        if(!well) {
          return  next(new ErrorResponse(`Well not found with id of ${req.params.id}`,404))
        }
        
        res.status(200).json({
            success: true,
            data:{}
    
        })
   
   
})