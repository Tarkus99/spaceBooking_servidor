const express = require('express');
const router = express.Router();
const passport = require('passport');
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn, isAdmin } = require('../lib/auth');

router.get('/', isNotLoggedIn, (req, res) => {
    res.render('logeo');
})

router.get('/signup/exists/', async (req, res) => {
    const row = await pool.query('SELECT * FROM usuario where username = ?', [req.query.username])
    if (row.length > 0)
        return res.status(401).json(false)
    return res.status(200).json(true);
})

/* router.post('/login', isNotLoggedIn, async (req, res, next) => {

    passport.authenticate('local-signin', (err, user, info)=>{

        if (err) 
            return res.status(500).json({message:'Ha ocurrido un error', error: err.message });
        
        if (!user)
            return res.status(401).json({ message: 'Autenticación fallida', error: 'Nombre de usuario o contraseña incorrectos' });

        return res.status(200).json({ message: 'Autenticación exitosa', user});
    })(req, res, next);
    
}); */


router.post('/login', isNotLoggedIn, async (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {

        if (err)
            return res.status(500).json({ message: 'Ha ocurrido un error', error: err.message });

        if (!user)
            return res.status(401).json({ message: 'Autenticación fallida', error: 'Nombre de usuario o contraseña incorrectos' });

        return res.status(200).json({ message: 'Autenticación exitosa', user });
    })(req, res, next);

});

router.post('/signup', isNotLoggedIn, async (req, res, next) => {

    passport.authenticate('local-signup', (err, user, info) => {
        if (err)
            return res.status(500).json({ error: err.message });

        if (!user)
            return res.status(401).json({ message: 'Autenticación fallida', error: info && info.message });

        return res.status(200).json({ message: 'Autenticación exitosa', user });
    })(req, res, next)
})

router.get('/root/inicio', isLoggedIn, isAdmin, (req, res) => {
    res.send('pagina del admin');
})


router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'Hasta pronto')
        res.redirect('/auth');
    });
})

module.exports = router;

 /* FORM CLIENT

 fetch("/posts", {
     method: "GET",
     headers: {
         authorization: "Bearer <JWT | base64>"
     }
 })

 Middleware 
export function authBearer(req, res, next) {
     VERIFY THATHEADERS VALUE IS RIGHT
    let authHeaderValue = req.headers["authorization"];

    if (!authHeaderValue) {
        res.status(401).send("Not found token").end();
    }

    let [bearer, token] = authHeaderValue.split(" ");

    if (bearer !== "Bearer") {
        res.status("401").send("Headers malformed").end();
    }

    if (!token) {
        res.status("401").send("Token not found").end();
    }

    VERIFY THAT THE TOKEN IT's RIGHT
    const deserializedToken = JSON.parse(atob(token));

    
      {
        id: string 
        expiration: number (date)
      }
    if (deserializedToken.expiration < Date.now()) {
        res.status("401").send("Session expired").end();
    }

    
      SELECT *
      FROM user_session
      WHERE id = ?


     1. Si la sessión no existe -> GO OUT
     2. Si la sesión existe-> CONTINUE

     CREATE TABLE user_session(
         id TEXT,
         expiration DATETIME,
         user_id TEXT REFERENCES user (id),
         PRIMARY KEY (id)
     );

    return next();



}

import { token } from "~/state"


export function composeAuthenticationHeaders(def) {
    return {
        ...def,
        authorization: `Bearer ${token.value}`
    }
}

fetch("/f", { headers: composeAuthenticationHeaders()}) */