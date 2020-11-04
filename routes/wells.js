const express = require('express')

const router = express.Router({mergeParams: true});

const {getWell,getWells,createWell,updateWell,deleteWell, addeWell} = require('../controllers/wells')
const Well = require('../Model/Well')
const advancedResults = require('../middleware/advancedResults')
const {protect,authorize} = require('../middleware/auth')
// Include other resource routers
const contractorRouter = require('./contractors')
// // Re-route into other resource routers &&& we have to mergeParam: true in the root of the file
// // here to contractors
router.use('/:wellId/contractors', contractorRouter)

router.route('/')
.get(advancedResults(Well,{path: 'contractor',select: ' executor '}), getWells)
.post(protect , authorize('publisher','admin'),createWell)
.post(protect, authorize('publisher','admin'),addeWell)

router.route('/:id')
.get(getWell)
.delete(protect, authorize('publisher','admin'),deleteWell)
.put(protect, authorize('publisher','admin'),updateWell)







module.exports = router;