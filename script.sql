CREATE DATABASE IF NOT EXISTS hecate;
USE hecate;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashedPassword VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    profilePicture VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS reservations(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    reservationDate DATE NOT NULL,
    reservationTime TIME NOT NULL,
    reservationService ENUM('Mesa', 'Tarot', 'Posos'),
    pet VARCHAR(255),
    allergies TEXT,
    suggestions TEXT,
    CONSTRAINT FK_user_id FOREIGN KEY (user_id) REFERENCES users(id)
);