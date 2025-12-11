import { pgTable, serial, varchar, boolean, text, timestamp, pgEnum, integer } from 'drizzle-orm/pg-core';

export const moderationTypeEnum = pgEnum('moderation_type', ['warn', 'ban', 'kick']);
export const submissionStatusEnum = pgEnum('submission_status', ['pending', 'approved', 'rejected']);

export const guilds = pgTable('guilds', {
  id: serial('id').primaryKey(),
  guildId: varchar('guildId', { length: 64 }).notNull().unique(),
  guildName: varchar('guildName', { length: 255 }).notNull(),
  ownerId: varchar('ownerId', { length: 64 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const welcomeConfigs = pgTable('welcomeConfigs', {
  id: serial('id').primaryKey(),
  guildId: varchar('guildId', { length: 64 }).notNull().unique(),
  enabled: boolean('enabled').default(true),
  channelId: varchar('channelId', { length: 64 }),
  message: text('message'),
  imageUrl: text('imageUrl'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const automodConfigs = pgTable('automodConfigs', {
  id: serial('id').primaryKey(),
  guildId: varchar('guildId', { length: 64 }).notNull().unique(),
  enabled: boolean('enabled').default(true),
  antiSpam: boolean('antiSpam').default(true),
  bannedWords: text('bannedWords'), // JSON: ["word1", "word2"]
  bannedLinks: text('bannedLinks'), // JSON: ["domain1.com", "domain2.com"]
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const userModerations = pgTable('userModerations', {
  id: serial('id').primaryKey(),
  guildId: varchar('guildId', { length: 64 }).notNull(),
  userId: varchar('userId', { length: 64 }).notNull(),
  type: moderationTypeEnum('type').notNull(),
  reason: text('reason'),
  moderatorId: varchar('moderatorId', { length: 64 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const forms = pgTable('forms', {
  id: serial('id').primaryKey(),
  guildId: varchar('guildId', { length: 64 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  fields: text('fields').notNull(), // JSON: [{"name": "field1", "type": "text", "required": true}]
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const formSubmissions = pgTable('formSubmissions', {
  id: serial('id').primaryKey(),
  formId: integer('formId').notNull(),
  guildId: varchar('guildId', { length: 64 }).notNull(),
  userId: varchar('userId', { length: 64 }).notNull(),
  data: text('data').notNull(), // JSON: {"field1": "value1", "field2": "value2"}
  status: submissionStatusEnum('status').default('pending'),
  reviewedBy: varchar('reviewedBy', { length: 64 }),
  reviewedAt: timestamp('reviewedAt'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const roleConfigs = pgTable('roleConfigs', {
  id: serial('id').primaryKey(),
  guildId: varchar('guildId', { length: 64 }).notNull(),
  roleId: varchar('roleId', { length: 64 }).notNull(),
  autoAssign: boolean('autoAssign').default(false),
  requiresVerification: boolean('requiresVerification').default(false),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
});

export const userRoles = pgTable('userRoles', {
  id: serial('id').primaryKey(),
  guildId: varchar('guildId', { length: 64 }).notNull(),
  userId: varchar('userId', { length: 64 }).notNull(),
  roleId: varchar('roleId', { length: 64 }).notNull(),
  assignedBy: varchar('assignedBy', { length: 64 }),
  createdAt: timestamp('createdAt').defaultNow(),
});
