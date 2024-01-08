const { DateTime } = require('luxon');
const database = require('../database'); // Asegúrate de importar la función correcta de tu módulo database
const { saveSesions } = require('../lib/config');
const path = require('path')
const data = path.join(__dirname, '../horarioConfig.json');
delete require.cache[data]
const config = require('../horarioConfig.json');
const horario = saveSesions(config[0]);

class Reserva {
    static async get(id, params) {
        const startOfWeek = DateTime.local().startOf('week');
        const daysFromNow = params.page * 7;
        const fromDate = startOfWeek.plus({ days: daysFromNow });
        const fromDateFormatted = fromDate.toFormat('yyyy-LL-dd');
        const rows = await database.query(`SELECT * FROM reserva WHERE idUsuario = ? AND idEspacio = ? AND (fechaInicio BETWEEN ? and DATE_ADD(?, INTERVAL 5 day))`, [id, params.space, fromDateFormatted, fromDateFormatted]);
        return rows;
    }

    static getCoordX(reserva) {
        return DateTime.fromSQL(reserva.fechaInicio).day - DateTime.local().startOf('week').day;
    }

    static getCoordY(reserva) {
        let t1 = DateTime.fromSQL(reserva.fechaInicio).toFormat('TT');
        return horario.findIndex(sesion => sesion.horaInicio === t1);
    }

    static getEndCoordY(reserva) {
        return horario.findIndex(sesion => {
            return sesion.horaFin === DateTime.fromSQL(reserva.fechaFin).toFormat('TT')
        });
    }

    static getArray(reservas) {
        const array = Array.from({ length: 5 }, () =>
            Array.from({ length: horario.length }, () => ({}))
        );

        reservas.forEach((reserva) => {
            const x = Reserva.getCoordX(reserva); // Llama a los métodos de la clase directamente
            const y = Reserva.getCoordY(reserva);
            const span = (Reserva.getEndCoordY(reserva) - y) + 1;
            array[x][y] = { ...reserva, span };
        });
        return array;
    }
}

module.exports = Reserva;
