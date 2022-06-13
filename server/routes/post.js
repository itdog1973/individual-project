const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/authMiddleware') 
const postController = require('../controllers/postController')


router.post('/', requireAuth ,postController.post_create_post )
router.get('/', postController.post_index)
router.get('/:keyword', postController.post_details)
router.put('/', requireAuth, postController.post_personal_post)



module.exports = router