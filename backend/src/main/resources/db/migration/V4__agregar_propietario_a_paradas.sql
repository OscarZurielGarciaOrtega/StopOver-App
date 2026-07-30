
ALTER TABLE paradas ADD COLUMN propietario_id BIGINT NULL;
ALTER TABLE paradas ADD CONSTRAINT fk_parada_propietario
    FOREIGN KEY (propietario_id) REFERENCES usuarios(id);