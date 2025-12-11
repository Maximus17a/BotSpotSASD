-- BotSpotSASD Database Schema
-- Execute this file to create all necessary tables

-- Create database (uncomment if needed)
-- CREATE DATABASE botspotsasd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE botspotsasd;

-- Guilds table: Stores Discord server information
CREATE TABLE IF NOT EXISTS guilds (
  id INT PRIMARY KEY AUTO_INCREMENT,
  guildId VARCHAR(64) NOT NULL UNIQUE,
  guildName VARCHAR(255) NOT NULL,
  ownerId VARCHAR(64) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_guildId (guildId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Welcome configuration table
CREATE TABLE IF NOT EXISTS welcomeConfigs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  guildId VARCHAR(64) NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT TRUE,
  channelId VARCHAR(64),
  message TEXT,
  imageUrl TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_guildId (guildId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Automoderation configuration table
CREATE TABLE IF NOT EXISTS automodConfigs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  guildId VARCHAR(64) NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT TRUE,
  antiSpam BOOLEAN DEFAULT TRUE,
  bannedWords TEXT,
  bannedLinks TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_guildId (guildId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User moderations table: Stores warns, bans, kicks
CREATE TABLE IF NOT EXISTS userModerations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  guildId VARCHAR(64) NOT NULL,
  userId VARCHAR(64) NOT NULL,
  type ENUM('warn', 'ban', 'kick') NOT NULL,
  reason TEXT,
  moderatorId VARCHAR(64) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_guild_user (guildId, userId),
  INDEX idx_guildId (guildId),
  INDEX idx_userId (userId),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Forms table: Stores form definitions
CREATE TABLE IF NOT EXISTS forms (
  id INT PRIMARY KEY AUTO_INCREMENT,
  guildId VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  fields TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_guildId (guildId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Form submissions table: Stores user form submissions
CREATE TABLE IF NOT EXISTS formSubmissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  formId INT NOT NULL,
  guildId VARCHAR(64) NOT NULL,
  userId VARCHAR(64) NOT NULL,
  data TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  reviewedBy VARCHAR(64),
  reviewedAt TIMESTAMP NULL DEFAULT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_formId (formId),
  INDEX idx_guildId (guildId),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Role configurations table
CREATE TABLE IF NOT EXISTS roleConfigs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  guildId VARCHAR(64) NOT NULL,
  roleId VARCHAR(64) NOT NULL,
  autoAssign BOOLEAN DEFAULT FALSE,
  requiresVerification BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_guildId (guildId),
  INDEX idx_roleId (roleId),
  UNIQUE KEY unique_guild_role (guildId, roleId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User roles table: Stores role assignments
CREATE TABLE IF NOT EXISTS userRoles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  guildId VARCHAR(64) NOT NULL,
  userId VARCHAR(64) NOT NULL,
  roleId VARCHAR(64) NOT NULL,
  assignedBy VARCHAR(64),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_guild_user (guildId, userId),
  INDEX idx_guildId (guildId),
  INDEX idx_userId (userId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data (optional - uncomment to use)
/*
-- Sample guild
INSERT INTO guilds (guildId, guildName, ownerId) 
VALUES ('123456789012345678', 'Test Server', '123456789012345678');

-- Sample welcome config
INSERT INTO welcomeConfigs (guildId, enabled, message) 
VALUES ('123456789012345678', TRUE, '¡Bienvenido {user} a {server}! Somos {memberCount} miembros.');

-- Sample automod config
INSERT INTO automodConfigs (guildId, enabled, antiSpam, bannedWords, bannedLinks) 
VALUES ('123456789012345678', TRUE, TRUE, '[]', '[]');
*/

-- Show all tables
SHOW TABLES;

-- Verify table structures
DESCRIBE guilds;
DESCRIBE welcomeConfigs;
DESCRIBE automodConfigs;
DESCRIBE userModerations;
DESCRIBE forms;
DESCRIBE formSubmissions;
DESCRIBE roleConfigs;
DESCRIBE userRoles;
