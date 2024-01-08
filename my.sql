create table sesion(
    fechaInicio datetime,
    fechaFin datetime,
    posicion int,
    primary key (fechaInicio, fechaFin)
)

create table reserva(
    id int NOT NULL AUTO_INCREMENT, 
    fechaInicio datetime,
    fechaFin datetime,
    idUsuario int,
    idEspacio int
)
