
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config
const userDB = require('../models/user')
const passport = require('passport')
var GoogleStrategy = require('passport-google-oidc');




  passport.use(new GoogleStrategy({ 
    clientID: process.env.ClientId,
    clientSecret: process.env.ClientSecret,
    callbackURL: "/auth/google/callback",
    scope: ['profile']
  },
  async function(accessToken, refreshToken, profile, done) {
      // user the progile info (mainly the profile id ) to check if the suer is registed in db

      console.log(profile)

      try{
        let result = await userDB.findGoogleUser(profile.id)
        if(result){
          console.log(result)
           return done(null, result)
        }else{
          console.log('not found user')
          let insertResult = await userDB.insertGoogleUser(profile.id, profile.displayName, profile.photos[0].value)
          console.log(insertResult)
          return done(null,insertResult)
        }
      }catch(err){
        console.log('we got an error',err)
      }


  
  }
));


passport.serializeUser((user, done)=> {
  /*
  From the user take just the id (to minimize the cookie size) and just pass the id of the user
  to the done callback
  PS: You dont have to do it like this its just usually done like this
  */ 
 console.log('hi',user)
  done(null, user.id);
});

passport.deserializeUser( async (user, done) =>{
  /*
  Instead of user this function usually recives the id 
  then you use the id to select the user from the db and pass the user obj to the done callback
  PS: You can later access this data in any routes in: req.user
  */
 console.log('deserilize',user.id)
  try{
    let result = await userDB.findGoogleUser(user.id)
    done(null,result);
  }catch(err){
    console.log(err)
  }

});