const { DateTime } = require('luxon');

module.exports = {
    getObject(body) {
        console.log(body);
        const { horaInicio, horaFin, duracionSesion, inicioCurso, finCurso } = body;
        const [descansos, duraciones] = [body['descanso'], body['duracion']];

        const out = { horaInicio, horaFin, duracionSesion, inicioCurso, finCurso};
        out.descansos = [];
        for (const i in descansos)
            out.descansos.push({ descanso: descansos[i], duracion: duraciones[i] })
        console.log(out);
        return out;
    },

    horasEncajan(obj, dtInicio, dtFin) {
        let totalPatios = obj.descansos.reduce(d => d.duracion);
        let minutesLeft = parseInt(dtFin.diff(dtInicio, 'minutes').minutes) - totalPatios;
        return minutesLeft % parseInt(obj.duracionSesion) === 0;
    },

    saveSesions(obj) {;
        const dtInicio = DateTime.fromFormat(obj.horaInicio, "T")
        const dtFin = DateTime.fromFormat(obj.horaFin, "T")
        let [copyInicio] = [dtInicio]
        let copyFin;
        const array = [];
        let i = 0;

        while (copyInicio < dtFin) {
            if (obj.descansos.length > 0 && copyInicio.toFormat("T") === obj.descansos[0].descanso) {
                let patioDuracion = obj.descansos.shift().duracion;
                copyFin = copyInicio.plus({ minutes: patioDuracion })
            } else
                copyFin = copyInicio.plus({ minutes: 55 });
        
            array.push({
                sesion: i,
                horaInicio: copyInicio.toFormat("TT"),
                horaFin: copyFin.toFormat("TT")
            })

            copyInicio = copyFin;
            i++;
        }
        return array;
    },

}