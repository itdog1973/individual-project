const express = require('express')
const router = express.Router()

const { requireAuth } = require('../middleware/authMiddleware')
const userControllers = require('../controllers/userControllers')









router.get('/', requireAuth,userControllers.user_details)
router.post('/',userControllers.user_register )
router.put('/',userControllers.user_login)
router.delete('/',userControllers.user_logout)




module.exports=router