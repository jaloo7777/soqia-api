const express = require('express')
const {getMedias,getMedia, createMedia,mediaPhotoUpload, deleteMedia,updateMedia} = require('../controllers/medias')
const router = express.Router()


router.route('/').get(getMedias).post(createMedia)
router.route('/:id/photo').put(mediaPhotoUpload)
router.route('/:id').get(getMedia).delete(deleteMedia).put(updateMedia)




module.exports = router;