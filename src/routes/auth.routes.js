const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn, isAdmin } = require('../lib/auth');

router.get('/', isNotLoggedIn, (req, res) => {
    res.render('logeo');
})

router.post('/login', isNotLoggedIn, async (req, res, next) => {

    passport.authenticate('local-signin', (err, user, info)=>{

        if (err) 
            return res.status(500).json({message:'Ha ocurrido un error', error: err.message });
        
        if (!user)
            return res.status(401).json({ message: 'Autenticación fallida', error: 'Nombre de usuario o contraseña incorrectos' });

        return res.status(200).json({ message: 'Autenticación exitosa', user});
    })(req, res, next);
    
});

router.post('/signup', isNotLoggedIn, async (req, res, next) => {
    
    passport.authenticate('local-signup', (err, user, info)=>{
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
