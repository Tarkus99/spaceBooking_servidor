const mysql = require('mysql');
const {promisify} = require('util');
const {database} = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, con) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST')
            console.log('La conexion con la base de datos fue cerrada');
        if (err.code === 'ER_CON_COUNT_ERROR')
            console.log("TO MANY CONNECTIONS");
        if (err.code === 'ECONNREFUSED')
            console.log("La conexión fue rechazada");
    }
    if (con) {
        con.release();
        console.log('DB IS CONNECTED');
    }
    return;
});


//convertir callbacks a promesas
pool.query = promisify(pool.query);
module.exports = pool;