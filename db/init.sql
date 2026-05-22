-- Initialization script for LaPlumeVirtuelle database
-- Creates the database and an 'admin' user with password 'admin'

CREATE DATABASE IF NOT EXISTS `lpvDB` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'admin'@'%' IDENTIFIED BY 'admin';
GRANT ALL PRIVILEGES ON `lpvDB`.* TO 'admin'@'%';

FLUSH PRIVILEGES;
