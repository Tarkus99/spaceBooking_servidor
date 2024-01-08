const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local-signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const row = await pool.query('SELECT * FROM usuario WHERE username = ?', [username]);
    if (row.length > 0) {
        const user = row[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) 
            return done(null, user, req.flash('success', 'Welcome ' + user.name))
        else 
            return done(null, false, req.flash('message','incorrect password'));
    } else
        return done(null, false, req.flash('message','username doesnt exists'));
}))

passport.use('local-signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { name } = req.body;
    const newUser = {
        username,
        password,
        name
    };
    newUser.password = await helpers.encryptPassword(password);
    try {
        const result = await pool.query('INSERT INTO usuario SET ?', [newUser]);
        newUser.id = result.insertId;
        return done(null, newUser);
    } catch (error) {
        console.log(error);
        return done(null, false, {message: 'Ese nombre de usuario ya existe'});
    }
    
}))

passport.serializeUser((usr, done) => {
    done(null, usr.id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const result = await pool.query('SELECT * FROM usuario WHERE id = ?', [id])
        done(null, result[0])
    } catch (error) {
        throw error;
    }
    
})