const express = require('express')
const {getMedias,getMedia, createMedia,mediaPhotoUpload, deleteMedia,updateMedia} = require('../controllers/medias')
const {protect, authorize } = require('../middleware/auth')
const router = express.Router()

router.route('/')
.get(getMedias)
.post(protect, authorize('media','admin'),createMedia)

router.route('/:id/photo')
.put(protect, authorize('media','admin'),mediaPhotoUpload)

router.route('/:id')
.get(getMedia)
.delete(protect, authorize('media','admin'),deleteMedia)
.put(protect, authorize('media','admin'),updateMedia)




module.exports = router;