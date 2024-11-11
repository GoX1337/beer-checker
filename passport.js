import passport from 'passport'; 
import { Strategy } from 'passport-google-oauth20';

passport.use( 
    new Strategy( 
        { 
        clientID: process.env.GOOGLE_CLIENT_ID, 
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, 
        callbackURL: `/auth/google/redirect`, 
        }, 

        function (accessToken, refreshToken, profile, done) { 
        // User find or create to db 
        return done(null, profile); 
        } 
    ) 
); 
  
passport.serializeUser((user, done) => { 
    done(null, user); 
}); 

passport.deserializeUser((user, done) => { 
    done(null, user);
}); 
