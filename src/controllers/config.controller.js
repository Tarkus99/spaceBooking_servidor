const { DateTime } = require("luxon");
const fs = require('fs').promises;
const path = require('path');
const file = path.join(__dirname, '../horarioConfig.json');
const auxFunctions = require('../lib/config')

async function configController(req) {
    let obj = auxFunctions.getObject(req.body);

    const dtInicio = DateTime.fromFormat(obj.horaInicio, "T")
    const dtFin = DateTime.fromFormat(obj.horaFin, "T")

    let str;
    if (auxFunctions.horasEncajan(obj, dtInicio, dtFin)) {
        try {
            await fs.writeFile(file, JSON.stringify([obj]));
            str = 'Información guardada correctamente.';

        } catch (error) {
            console.log(error);
            str = 'Ha ocurrido un error interno. No se ha podido guardar la información.';
        }
    } else {
        str = "El cómputo de horas no es exacto.Revisa la información introducida.";
    }
    req.flash('message', str);
    return;
}

module.exports = configController;

