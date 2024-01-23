const express = require('express'), app = express();
require('express-async-errors');
const morgan = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
const mySqlStore = require('express-mysql-session')(session);
const passport = require('passport');
const { database } = require('./keys');
const pool = require('./database')
const cors = require('cors')

//init
require('./passport/passport')

//settings
app.set('port', process.env.PORT || 4000);

//middleware
app.use(session({
    secret: '1234',
    resave: false,
    saveUninitialized: false,
    store: new mySqlStore(database)
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors({ origin: 'http://localhost:3000' }))
app.use(morgan('dev'))
app.use(flash());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    // Otros encabezados CORS según sea necesario
    next();
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send('Sometginh went wrong')
});


//rutas
app.use('/', require('./routes/index.routes'));

app.use('/spaces', async (req, res) => {
    const rows = await pool.query('SELECT * FROM espacio')
    res.send(rows);
})

app.use('/horario', async (req, res) => {
    const { saveSesions } = require('./lib/config');
    const path = require('path')
    const data = path.join(__dirname, './horarioConfig.json');
    delete require.cache[data]
    const config = require('./horarioConfig.json');
    const horario = saveSesions(config[0]);
    res.send(horario)
})


app.use('/auth', require('./routes/auth.routes'));
app.use(require('./routes/config.routes'));
app.use('/:username/inicio', require('./routes/profile.routes'));
app.use('/serviceReserva/services', require('./serviceReserva/services'))

//public
app.use(express.static(__dirname + 'public'));

//starting
app.listen(app.get('port'), () => {
    console.log('server on' + app.get('port'));
});
