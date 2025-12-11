-- BotSpotSASD Database Schema (PostgreSQL / Supabase)

-- Create ENUM types
DO $$ BEGIN
    CREATE TYPE moderation_type AS ENUM ('warn', 'ban', 'kick');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Guilds table
CREATE TABLE IF NOT EXISTS guilds (
  id SERIAL PRIMARY KEY,
  "guildId" VARCHAR(64) NOT NULL UNIQUE,
  "guildName" VARCHAR(255) NOT NULL,
  "ownerId" VARCHAR(64) NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_guilds_guildId ON guilds ("guildId");

-- Welcome configuration table
CREATE TABLE IF NOT EXISTS "welcomeConfigs" (
  id SERIAL PRIMARY KEY,
  "guildId" VARCHAR(64) NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT TRUE,
  "channelId" VARCHAR(64),
  message TEXT,
  "imageUrl" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_welcomeConfigs_guildId ON "welcomeConfigs" ("guildId");

-- Automoderation configuration table
CREATE TABLE IF NOT EXISTS "automodConfigs" (
  id SERIAL PRIMARY KEY,
  "guildId" VARCHAR(64) NOT NULL UNIQUE,
  enabled BOOLEAN DEFAULT TRUE,
  "antiSpam" BOOLEAN DEFAULT TRUE,
  "bannedWords" TEXT,
  "bannedLinks" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_automodConfigs_guildId ON "automodConfigs" ("guildId");

-- User moderations table
CREATE TABLE IF NOT EXISTS "userModerations" (
  id SERIAL PRIMARY KEY,
  "guildId" VARCHAR(64) NOT NULL,
  "userId" VARCHAR(64) NOT NULL,
  type moderation_type NOT NULL,
  reason TEXT,
  "moderatorId" VARCHAR(64) NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_userModerations_guild_user ON "userModerations" ("guildId", "userId");
CREATE INDEX IF NOT EXISTS idx_userModerations_guildId ON "userModerations" ("guildId");
CREATE INDEX IF NOT EXISTS idx_userModerations_userId ON "userModerations" ("userId");
CREATE INDEX IF NOT EXISTS idx_userModerations_createdAt ON "userModerations" ("createdAt");

-- Forms table
CREATE TABLE IF NOT EXISTS forms (
  id SERIAL PRIMARY KEY,
  "guildId" VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  fields TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_forms_guildId ON forms ("guildId");

-- Form submissions table
CREATE TABLE IF NOT EXISTS "formSubmissions" (
  id SERIAL PRIMARY KEY,
  "formId" INT NOT NULL,
  "guildId" VARCHAR(64) NOT NULL,
  "userId" VARCHAR(64) NOT NULL,
  data TEXT NOT NULL,
  status submission_status DEFAULT 'pending',
  "reviewedBy" VARCHAR(64),
  "reviewedAt" TIMESTAMP NULL DEFAULT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_formSubmissions_formId ON "formSubmissions" ("formId");
CREATE INDEX IF NOT EXISTS idx_formSubmissions_guildId ON "formSubmissions" ("guildId");
CREATE INDEX IF NOT EXISTS idx_formSubmissions_status ON "formSubmissions" (status);
CREATE INDEX IF NOT EXISTS idx_formSubmissions_createdAt ON "formSubmissions" ("createdAt");

-- Role configurations table
CREATE TABLE IF NOT EXISTS "roleConfigs" (
  id SERIAL PRIMARY KEY,
  "guildId" VARCHAR(64) NOT NULL,
  "roleId" VARCHAR(64) NOT NULL,
  "autoAssign" BOOLEAN DEFAULT FALSE,
  "requiresVerification" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("guildId", "roleId")
);
CREATE INDEX IF NOT EXISTS idx_roleConfigs_guildId ON "roleConfigs" ("guildId");
CREATE INDEX IF NOT EXISTS idx_roleConfigs_roleId ON "roleConfigs" ("roleId");

-- User roles table
CREATE TABLE IF NOT EXISTS "userRoles" (
  id SERIAL PRIMARY KEY,
  "guildId" VARCHAR(64) NOT NULL,
  "userId" VARCHAR(64) NOT NULL,
  "roleId" VARCHAR(64) NOT NULL,
  "assignedBy" VARCHAR(64),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_userRoles_guild_user ON "userRoles" ("guildId", "userId");
CREATE INDEX IF NOT EXISTS idx_userRoles_guildId ON "userRoles" ("guildId");
CREATE INDEX IF NOT EXISTS idx_userRoles_userId ON "userRoles" ("userId");

-- Function to update updatedAt timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updatedAt
DROP TRIGGER IF EXISTS update_guilds_updated_at ON guilds;
CREATE TRIGGER update_guilds_updated_at BEFORE UPDATE ON guilds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_welcomeConfigs_updated_at ON "welcomeConfigs";
CREATE TRIGGER update_welcomeConfigs_updated_at BEFORE UPDATE ON "welcomeConfigs" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_automodConfigs_updated_at ON "automodConfigs";
CREATE TRIGGER update_automodConfigs_updated_at BEFORE UPDATE ON "automodConfigs" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_forms_updated_at ON forms;
CREATE TRIGGER update_forms_updated_at BEFORE UPDATE ON forms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_formSubmissions_updated_at ON "formSubmissions";
CREATE TRIGGER update_formSubmissions_updated_at BEFORE UPDATE ON "formSubmissions" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_roleConfigs_updated_at ON "roleConfigs";
CREATE TRIGGER update_roleConfigs_updated_at BEFORE UPDATE ON "roleConfigs" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
