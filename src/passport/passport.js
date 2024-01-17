const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local-signin', new LocalStrategy({usernameField: 'username', passwordField: 'password', passReqToCallback: true},
 async (req, username, password, done) => {
    console.log(req.body);
    try {
        const row = await pool.query('SELECT * FROM usuario WHERE username = ?', [username]);
        if (row.length > 0) {
            const user = row[0];
            try {
                const infoUser = {name: user.name, username: user.username, admin: user.admin}
                const validPassword = await helpers.matchPassword(password, user.password);
                if (validPassword) 
                    return done(null, infoUser)
                else 
                    return done(null, false);
            } catch (error) {
                console.log(error);
                return done(error, false)
            }
        }
    } catch (error) {
        console.log(error);
        return done(error, false)
    }
}))

passport.use('local-signup', new LocalStrategy({ usernameField: 'username', passwordField: 'password', passReqToCallback: true},
 async (req, username, password, done) => {
    const { fullName } = req.body;
    const newUser = {
        username,
        password,
        name:fullName
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