const express = require('express')

const router = express.Router({mergeParams: true});

const {getWell,getWells,createWell,updateWell,deleteWell, addeWell} = require('../controllers/wells')
const Well = require('../Model/Well')
const advancedResults = require('../middleware/advancedResults')
// Include other resource routers
const contractorRouter = require('./contractors')
// // Re-route into other resource routers &&& we have to mergeParam: true in the root of the file
// // here to contractors
router.use('/:wellId/contractors', contractorRouter)

router.route('/')
.get(advancedResults(Well,{path: 'contractor',select: ' executor '}), getWells)
.post(createWell)
.post(addeWell)

router.route('/:id')
.get(getWell)
.delete(deleteWell)
.put(updateWell)







module.exports = router;