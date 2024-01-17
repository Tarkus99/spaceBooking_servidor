module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.status(403);
        return res.send({ message: 'Debes estar autenticado' });
    },

    isNotLoggedIn(req, res, next){
        console.log('comprobado si hay algunh usuario registrado');
        if (!req.isAuthenticated())
            return next();
        /* return res.redirect('/' + req.user.username + '/inicio'); */
        return res.status(401).send({message: 'Ya hay un usuario registrado'});
    },

    isAdmin(req, res, next) {
        if (!req.user.admin) {
            res.status(401);   
            res.send('No tienes los permisos de acceso a esta página')
        }
        next();
    }
}