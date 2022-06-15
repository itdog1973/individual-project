
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config()
const userDB = require('../models/user')
const passport = require('passport')





  passport.use(new GoogleStrategy({ 
    clientID: process.env.ClientId,
    clientSecret: process.env.ClientSecret,
    callbackURL: "/auth/google/callback",
    scope: ['profile']
  },
  async function(accessToken, refreshToken, profile, done) {
      // user the progile info (mainly the profile id ) to check if the suer is registed in db

      console.log(profile.id)

      try{
        let result = await userDB.findGoogleUser(profile.id)
        if(result){
          console.log(result)
          console.log('still good1')
          return done(null, result)
        }else{
          console.log('not found user')
          let insertResult = await userDB.insertGoogleUser(profile.id, profile.displayName, profile.photos[0].value)
          console.log(insertResult)
          console.log('still good2')
          console.log(insertResult)
          return done(null,insertResult)
        }
      }catch(err){
        console.log('we got an error',err)
      }


 
  }
));


