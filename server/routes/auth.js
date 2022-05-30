const express = require('express')
const router = express.Router()
const passport = require('passport')
require('../middleware/passport-set')

// @desc auth with google
// @route GET /auth

router.get('/google',passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: "select_account"
})); 





// @desc google auth callback
// @route GET /auth/google/callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res)=> {
    
    // Successful authentication, redirect home.
    res.redirect('/');
  });



router.get('/logout',(req,res)=>{
  
    req.session = null;
    req.logout();
    res.redirect('/')
})


module.exports=router