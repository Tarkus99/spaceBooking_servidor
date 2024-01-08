const database = require('../database');
const { DateTime } = require('luxon');


async function getSpaces() {
    const rows = await database.query('SELECT * FROM espacio');
    return rows;
}

async function controller(req, res) {
    const rows = await getSpaces();
    res.render('profile', {rows});
}

function mostrarArray(array) {
    let str;
    for (let fila = 0; fila < array.length; fila++) {
        str = '';
        for (let columna = 0; columna < array[fila].length; columna++) {
            if ((array[fila][columna])) {
                str += (array[fila][columna]);    
            } else {
                str += 'vacio  ';
            }
        }
        console.log(str);
    }
}

function getCoordX(reserva) {
    return DateTime.fromSQL(reserva.fechaInicio).day - DateTime.local().startOf('week').day;
}

function getCoordY(reserva) {
    let t1 = DateTime.fromSQL(reserva.fechaInicio).toFormat('T');
    return horario.findIndex(sesion => sesion.horaInicio === t1)
}

function getEndCoordY(reserva) {
    return horario.findIndex(sesion => {
        sesion.horaFin === DateTime.fromSQL(reserva.fechaFin).toFormat('T');
    })
}

function getArray(reservas) {
    const array = new Array(5);
    for (let index = 0; index < array.length; index++) {
        array[index] = new Array(horario.length);
    }
    reservas.forEach((reserva) => {
        const x = getCoordX(reserva);
        const y = getCoordY(reserva);
        console.log(x,y);
        const span = getEndCoordY(reserva) - y;
        array[x][y] = { ...reserva, span };
    });
    return array;
}


module.exports = controller;