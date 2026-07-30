CREATE TABLE negocios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    descripcion TEXT,
    direccion VARCHAR(255),
    latitud DECIMAL(10,8),
    longitud DECIMAL(11,8),
    estatus VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    propietario_id BIGINT NOT NULL,
    FOREIGN KEY (propietario_id) REFERENCES usuarios(id)
);