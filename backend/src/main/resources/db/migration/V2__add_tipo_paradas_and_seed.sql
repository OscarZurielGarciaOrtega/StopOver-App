
ALTER TABLE paradas ADD COLUMN tipo VARCHAR(50) NOT NULL DEFAULT 'OTRO';


INSERT INTO roles (nombre) VALUES ('ADMIN'), ('USUARIO'), ('OPERADOR');

INSERT INTO paradas (nombre, latitud, longitud, tipo) VALUES
('Café Central Oaxaca', 17.0732, -96.7266, 'CAFETERIA'),
('Mirador Dominguillo', 17.4536, -96.9052, 'MIRADOR'),
('Gasolinera Pemex Km 45', 17.6543, -96.8123, 'GASOLINERA'),
('Restaurante La Barranca', 17.8123, -96.7654, 'RESTAURANTE'),
('Café del Valle', 18.0456, -96.9871, 'CAFETERIA'),
('Mirador Sierra Norte', 17.2345, -96.5678, 'MIRADOR'),
('Gasolinera BP Ruta 190', 18.2134, -97.1234, 'GASOLINERA'),
('Restaurante Los Arcos', 18.4567, -97.3456, 'RESTAURANTE'),
('Café Punta del Cielo', 18.6789, -97.5678, 'CAFETERIA'),
('Mirador Puebla Norte', 18.9012, -97.7890, 'MIRADOR'),
('Gasolinera Shell Autopista', 19.0123, -98.0123, 'GASOLINERA'),
('Restaurante El Descanso', 19.0414, -98.2063, 'RESTAURANTE'),
('Café Terminal Puebla', 19.0523, -98.2234, 'CAFETERIA'),
('Mirador Malinche', 19.2345, -98.0456, 'MIRADOR'),
('Gasolinera G500 Km 120', 19.4321, -98.4321, 'GASOLINERA');