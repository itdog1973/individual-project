const express = require('express')
const router = express.Router()
const passport = require('passport')
require('../middleware/passport-set')
const { generateAccessToken } = require('../middleware/jwt')


router.get('/google',passport.authenticate('google', { session: false,
    scope: ['profile', 'email'],
    prompt: "select_account"
})); 





router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  (req, res)=> {

    const payload = {user_id:req.user.user_id, google_id:req.user.google_id}
    const token = generateAccessToken(payload)
  
    const maxAge = 1*24*60*60
    res.cookie('jwt',token,{httpOnly: true, maxAge: maxAge*1000});
    res.redirect('/');
  });





module.exports=router