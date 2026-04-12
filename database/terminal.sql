/*base de datos terminal*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS terminal
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE terminal;

DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS cotizaciones;
DROP TABLE IF EXISTS horarios_salida;
DROP TABLE IF EXISTS empresas_viaje;
DROP TABLE IF EXISTS empresas;
DROP TABLE IF EXISTS ciudades;

CREATE TABLE ciudades (
  id VARCHAR(32) NOT NULL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL
) ENGINE=InnoDB;

/* Catálogo de empresas de transporte que opera la terminal */
CREATE TABLE empresas (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_empresas_nombre (nombre)
) ENGINE=InnoDB;

CREATE TABLE horarios_salida (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  destino VARCHAR(120) NOT NULL,
  hora_salida CHAR(5) NOT NULL,
  hora_llegada CHAR(5) NOT NULL,
  empresa VARCHAR(120) NOT NULL,
  plataforma VARCHAR(16) NOT NULL,
  estado VARCHAR(120) NOT NULL DEFAULT 'A tiempo',
  KEY idx_horarios_destino (destino),
  KEY idx_horarios_empresa (empresa)
) ENGINE=InnoDB;

CREATE TABLE empresas_viaje (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  horario VARCHAR(64) NOT NULL,
  salida VARCHAR(16) NOT NULL,
  llegada VARCHAR(16) NOT NULL,
  duracion VARCHAR(32) NOT NULL,
  precio_unitario DECIMAL(12,2) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE cotizaciones (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  origen VARCHAR(120) NOT NULL,
  destino VARCHAR(120) NOT NULL,
  fecha_ida DATE NOT NULL,
  fecha_regreso DATE NULL,
  pasajeros SMALLINT UNSIGNED NOT NULL,
  servicio ENUM('economico','ejecutivo','premium') NOT NULL,
  subtotal_sin_descuento DECIMAL(12,2) NOT NULL,
  descuento_porcentaje DECIMAL(5,2) NOT NULL DEFAULT 0,
  total_con_descuento DECIMAL(12,2) NOT NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE pedidos (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  numero_tiquete VARCHAR(48) NOT NULL,
  origen VARCHAR(120) NOT NULL,
  destino VARCHAR(120) NOT NULL,
  fecha_viaje DATE NOT NULL,
  servicio ENUM('economico','ejecutivo','premium') NOT NULL,
  pasajeros SMALLINT UNSIGNED NOT NULL,
  empresa VARCHAR(120) NOT NULL,
  horario VARCHAR(64) NOT NULL,
  precio_unitario DECIMAL(12,2) NOT NULL,
  descuento_porcentaje DECIMAL(5,2) NOT NULL DEFAULT 0,
  total DECIMAL(12,2) NOT NULL,
  nombre_pasajero VARCHAR(200) NOT NULL,
  tipo_documento VARCHAR(24) NOT NULL,
  numero_documento VARCHAR(64) NOT NULL,
  correo VARCHAR(160) NOT NULL,
  telefono VARCHAR(40) NOT NULL,
  direccion VARCHAR(255) NULL,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_numero_tiquete (numero_tiquete)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO ciudades (id, nombre) VALUES
  ('bogota', 'Bogotá'),
  ('medellin', 'Medellín'),
  ('cali', 'Cali'),
  ('barranquilla', 'Barranquilla'),
  ('cartagena', 'Cartagena'),
  ('bucaramanga', 'Bucaramanga'),
  ('pereira', 'Pereira'),
  ('manizales', 'Manizales'),
  ('neiva', 'Neiva'),
  ('pasto', 'Pasto'),
  ('ibague', 'Ibagué'),
  ('santamarta', 'Santa Marta'),
  ('villavicencio', 'Villavicencio');

INSERT INTO empresas (nombre) VALUES
  ('Cootranshuila'),
  ('Coomotor Huila'),
  ('Taxis Verdes'),
  ('Express Bolivariano'),
  ('Empresa Bolivariano'),
  ('Expreso Palmira'),
  ('Velotax');

INSERT INTO horarios_salida (destino, hora_salida, hora_llegada, empresa, plataforma, estado) VALUES
  ('Neiva', '06:00', '10:15', 'Cootranshuila', 'A12', 'A tiempo'),
  ('Cali', '07:15', '13:40', 'Coomotor Huila', 'B05', 'A tiempo'),
  ('Medellín', '08:00', '14:45', 'Taxis Verdes', 'C08', 'A tiempo'),
  ('Bogotá', '09:30', '15:50', 'Express Bolivariano', 'A15', 'Retrasado 15 min'),
  ('Pereira', '11:00', '17:20', 'Expreso Palmira', 'D02', 'A tiempo'),
  ('Barranquilla', '13:30', '21:10', 'Velotax', 'E01', 'A tiempo'),
  ('Cartagena', '10:00', '18:30', 'Cootranshuila', 'B11', 'A tiempo'),
  ('Bucaramanga', '05:45', '12:10', 'Coomotor Huila', 'C03', 'A tiempo'),
  ('Manizales', '14:15', '20:00', 'Velotax', 'A08', 'A tiempo'),
  ('Pasto', '07:00', '15:30', 'Expreso Palmira', 'D07', 'A tiempo'),
  ('Ibagué', '12:45', '18:20', 'Empresa Bolivariano', 'E04', 'A tiempo'),
  ('Santa Marta', '16:00', '23:45', 'Velotax', 'F02', 'Retrasado 10 min'),
  ('Villavicencio', '08:30', '14:00', 'Cootranshuila', 'B09', 'A tiempo');

INSERT INTO empresas_viaje (nombre, horario, salida, llegada, duracion, precio_unitario) VALUES
  ('Cootranshuila', '06:00 - 13:30', '06:00', '13:30', '7h 30min', 180000.00),
  ('Coomotor Huila', '09:00 - 16:00', '09:00', '16:00', '7h 00min', 52000.00),
  ('Empresa Bolivariano', '13:00 - 20:30', '13:00', '20:30', '7h 30min', 44000.00),
  ('Velotax', '15:30 - 22:15', '15:30', '22:15', '6h 45min', 40000.00),
  ('Expreso Palmira', '18:00 - 01:15', '18:00', '01:15', '7h 15min', 48000.00);


