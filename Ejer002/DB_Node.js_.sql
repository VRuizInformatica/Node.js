CREATE DATABASE IF NOT EXISTS TutorialNode;
USE TutorialNode;

CREATE TABLE IF NOT EXISTS nota (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  descripcion TEXT
);

INSERT INTO nota (titulo, descripcion) 
VALUES ('Mi primera nota', 'Contenido de la nota');

SELECT * FROM nota;
