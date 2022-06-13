const express = require('express')
const router =express.Router()
const messagesControllers = require('../controllers/messageControllers')


router.get('/' , messagesControllers.message_details)

module.exports = router