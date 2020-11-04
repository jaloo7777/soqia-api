const express = require('express');
const {getContractors, getContractor,updateContractor,addContractor, deleteContractor ,createContractor} = require('../controllers/contractors');
const {protect,authorize} = require('../middleware/auth')
const router = express.Router({mergeParams: true});
const {getWells,addeWell} = require('../controllers/wells')
const wellRouter = require('./wells')
const Contractor = require('../Model/Contractor')
const advancedResults = require('../middleware/advancedResults')


// router.use('/:contractorId/wells', wellRouter)
router.route('/:contractorId/wells').get(getWells).post(protect, authorize('publisher','admin'), addeWell)
router.route('/')
.get(advancedResults(Contractor,{path:'wells', select: 'name'}) ,getContractors)
.post(protect, authorize('publisher','admin'), createContractor)
.post(protect,  authorize('publisher','admin'),addContractor)

router.route('/:id')
.get(getContractor)
.delete(protect, authorize('publisher','admin'), deleteContractor)
.put(protect,  authorize('publisher','admin'),updateContractor)




module.exports = router;