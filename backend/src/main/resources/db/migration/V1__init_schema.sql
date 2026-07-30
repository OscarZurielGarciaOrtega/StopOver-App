CREATE TABLE roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol_id BIGINT NOT NULL,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

CREATE TABLE rutas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    origen VARCHAR(150) NOT NULL,
    destino VARCHAR(150) NOT NULL,
    fecha_salida DATETIME NOT NULL,
    usuario_id BIGINT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE paradas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    latitud DECIMAL(10,7) NOT NULL,
    longitud DECIMAL(10,7) NOT NULL
);

CREATE TABLE ruta_parada (
    ruta_id BIGINT NOT NULL,
    parada_id BIGINT NOT NULL,
    orden INT NOT NULL,
    PRIMARY KEY (ruta_id, parada_id),
    FOREIGN KEY (ruta_id) REFERENCES rutas(id),
    FOREIGN KEY (parada_id) REFERENCES paradas(id)
);

CREATE TABLE favoritos (
    usuario_id BIGINT NOT NULL,
    ruta_id BIGINT NOT NULL,
    PRIMARY KEY (usuario_id, ruta_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (ruta_id) REFERENCES rutas(id)
);

CREATE TABLE historial (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    ruta_id BIGINT NOT NULL,
    fecha_consulta DATETIME NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (ruta_id) REFERENCES rutas(id)
);