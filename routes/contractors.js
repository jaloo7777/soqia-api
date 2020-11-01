const express = require('express');
const {getContractors, getContractor,updateContractor,addContractor, deleteContractor ,createContractor} = require('../controllers/contractors');

const router = express.Router({mergeParams: true});
const {getWells,addeWell} = require('../controllers/wells')
const wellRouter = require('./wells')
const Contractor = require('../Model/Contractor')
const advancedResults = require('../middleware/advancedResults')
// router.use('/:contractorId/wells', wellRouter)
router.route('/:contractorId/wells').get(getWells).post(addeWell)
router.route('/')
.get(advancedResults(Contractor,{path:'wells', select: 'name'}) ,getContractors)
.post(createContractor)
.post(addContractor)

router.route('/:id')
.get(getContractor)
.delete(deleteContractor)
.put(updateContractor)




module.exports = router;