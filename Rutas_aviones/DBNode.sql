-- 1. Reiniciar la BD si lo deseas
-- DROP DATABASE IF EXISTS rutas_aviones;

CREATE DATABASE IF NOT EXISTS rutas_aviones;
USE rutas_aviones;

-- 2. Tabla Ciudad
CREATE TABLE IF NOT EXISTS Ciudad (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    poblacion INT NOT NULL,
    km2 DECIMAL(10,2) NOT NULL
);

-- 3. Tabla Enlace con solo 3 columnas
CREATE TABLE IF NOT EXISTS Enlace (
    idOrigen INT NOT NULL,
    idDestino INT NOT NULL,
    tiempo INT NOT NULL, -- interpretamos 'tiempo' como la distancia/peso
    PRIMARY KEY (idOrigen, idDestino),
    FOREIGN KEY (idOrigen) REFERENCES Ciudad(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (idDestino) REFERENCES Ciudad(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- 4. Insertar datos en Ciudad
INSERT INTO Ciudad (nombre, poblacion, km2)
VALUES
    ('Madrid',    3266126, 604.30),
    ('Barcelona', 1636762, 101.90),
    ('Valencia',   791413, 134.65),
    ('Sevilla',    688711, 140.80),
    ('Zaragoza',   674997,1062.64),
    ('Málaga',     578460, 398.25);

-- 5. Insertar Enlaces con SOLO (idOrigen, idDestino, tiempo)
 -- 1 - Madrid
 -- 2 - Barcelona
 -- 3 - Valencia
 -- 4 - Sevilla
 -- 5 - Zaragoza
 -- 6 - Málaga
INSERT INTO Enlace (idOrigen, idDestino, tiempo)
VALUES
    -- Madrid <-> Barcelona
    (1, 2, 2),
    (2, 1, 2),
    -- Madrid <-> Valencia
    (1, 3, 1),
    (3, 1, 1),
	-- Madrid <-> Sevilla
    (1, 4, 1),
    (4, 1, 1),
	-- Madrid <-> Zaragoza
    (1, 5, 1),
    (5, 1, 1),
    -- Madrid <-> Málaga
    (1, 6, 1),
    (6, 1, 1),
    
    -- Barcelona <-> Madrid
    (2, 1, 1),
    (1, 2, 1),
    -- Barcelona <-> Valencia
    (2, 3, 1),
    (3, 2, 1),
    -- Barcelona <-> Sevilla
    (2, 4, 3),
    (4, 2, 3),
    -- Barcelona <-> Zaragoza
    (2, 5, 1),
    (5, 2, 1),
    -- Barcelona <-> Malaga
    (2, 6, 3),
    (6, 2, 3),

    -- Valencia <-> Sevilla
    (3, 4, 1),
    (4, 3, 1),
    
    -- Valencia <-> Málaga
    (3, 6, 1),
    (6, 3, 1),
    
    -- Málaga <-> Sevilla
    (6, 4, 1),
    (4, 6, 1),

    -- Zaragoza <-> Valencia
    (5, 3, 2),
    (3, 5, 2),

-- 6. Comprobar que hay 16+ filas en Enlace
SELECT * FROM Ciudad;
SELECT * FROM Enlace;
