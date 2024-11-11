import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import session from 'express-session'; 

import './passport.js'; 
import ratebeer from './ratebeer.js';
import vision from "./vision.js";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.json({limit: "50mb"}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
    resave: false, 
    saveUninitialized: false, 
    secret: 'sesion secret', 
}));
app.use(passport.initialize()) 
app.use(passport.session()); 

const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};
const endpointAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send();
};

app.get('/auth/google', passport.authenticate('google', { 
    scope: ['profile', 'email'], 
    prompt: 'select_account', 
}));

app.get('/auth/google/redirect', passport.authenticate('google', { 
    failureRedirect: '/login' 
}), (req, res) => { 
    res.redirect('/') 
}); 

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'view/login.html'));
});

app.get('/', auth, (req, res) => {
    res.sendFile(path.join(__dirname, 'view/index.html'));
});

app.post('/rateBeer', endpointAuth, ratebeer);
app.post('/analyseImage', endpointAuth, vision);

app.listen(port, () => {
    console.log(`Server listening on ${port}...`);
});