const reservaController = {};
const database = require('../database');
const reserva = require('../serviceReserva/reserva')
const { DateTime } = require('luxon');
const { saveSesions } = require('../lib/config');
const path = require('path')
const data = path.join(__dirname, '../horarioConfig.json');
delete require.cache[data]
const config = require('../horarioConfig.json');
const horario = saveSesions(config[0]);

reservaController.get = async (req, res) => {
    /* const rows = await reserva.get(req.user.id, req.query)
    const array = reserva.getArray(rows) */

    const { page, space } = req.query;
    const startOfWeek = DateTime.local().startOf('week').plus({ weeks: page })
    let copy = startOfWeek;
    const fromNowTo15 = DateTime.local().plus({ days: 15 })
    const finCurso = DateTime.fromISO(config[0].finCurso)
    const endOfWeek = startOfWeek.plus({ days: 4 })
    const limit = minDate(fromNowTo15, finCurso, endOfWeek);
    const array = [];
   /*  const daysAvailable = limit.diff(copy, 'days').toObject().days;

    for (const hora of horario) {
        const subArray = new Array();
        while (copy <= limit) {
            subArray.push(
                {
                    fechaInicio: `${copy.toISODate()} ${hora.horaInicio}`,
                    fechaFin: `${copy.toISODate()} ${hora.horaFin}`,
                    libre: true
                }
            )
            copy = copy.plus({days: 1})
        }
        array.push(subArray)
        copy = startOfWeek
    } */

    while (copy <= limit) {
        const subArray = new Array();
        for (const hora of horario) {
            subArray.push(
                {
                    fechaInicio: `${copy.toISODate()} ${hora.horaInicio}`,
                    fechaFin: `${copy.toISODate()} ${hora.horaFin}`,
                    libre: true
                }
            )
        }
        array.push(subArray);
        copy = copy.plus({ days: 1 });
    }

    const startOfWeekFormatted = startOfWeek.toFormat('yyyy-LL-dd');
    const limitFormatted = limit.plus({days: 1}).toFormat('yyyy-LL-dd');
    const rows = await database.query(`SELECT * FROM reserva WHERE idEspacio = ? AND (fechaInicio BETWEEN ? AND ?)`, [space, startOfWeekFormatted, limitFormatted]);
    for (const r of rows) {
        const x = reserva.getCoordX(r)
        const y = reserva.getCoordY(r)
        const endY = reserva.getEndCoordY(r)
        const obj = {
            id: r.id,
            userBook: r.idUsuario === req.user.id,
            fechaInicio: r.fechaInicio,
            fechaFin: r.fechaFin,
            span: (endY - y) + 1
        }
        array[x][y] = obj;
    }
 
    const avanza = startOfWeek.plus({ weeks: 1 }) <= minDate(finCurso, fromNowTo15);
    res.json({ array, avanza });
}

function minDate(...dates) {
    let min = dates[0];
    for (const d of dates) {
        if (d < min)
            min = d;
    }
    return min;
}


module.exports = reservaController;