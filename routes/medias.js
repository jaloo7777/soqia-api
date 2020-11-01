const express = require('express')
const {getMedias,getMedia, createMedia, deleteMedia,updateMedia} = require('../controllers/medias')
const router = express.Router()


router.route('/').get(getMedias).post(createMedia)

router.route('/:id').get(getMedia).delete(deleteMedia).put(updateMedia)




module.exports = router;