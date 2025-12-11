import { mysqlTable, int, varchar, boolean, text, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';

export const guilds = mysqlTable('guilds', {
  id: int('id').primaryKey().autoincrement(),
  guildId: varchar('guildId', { length: 64 }).notNull().unique(),
  guildName: varchar('guildName', { length: 255 }).notNull(),
  ownerId: varchar('ownerId', { length: 64 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
});

export const welcomeConfigs = mysqlTable('welcomeConfigs', {
  id: int('id').primaryKey().autoincrement(),
  guildId: varchar('guildId', { length: 64 }).notNull().unique(),
  enabled: boolean('enabled').default(true),
  channelId: varchar('channelId', { length: 64 }),
  message: text('message'),
  imageUrl: text('imageUrl'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
});

export const automodConfigs = mysqlTable('automodConfigs', {
  id: int('id').primaryKey().autoincrement(),
  guildId: varchar('guildId', { length: 64 }).notNull().unique(),
  enabled: boolean('enabled').default(true),
  antiSpam: boolean('antiSpam').default(true),
  bannedWords: text('bannedWords'), // JSON: ["word1", "word2"]
  bannedLinks: text('bannedLinks'), // JSON: ["domain1.com", "domain2.com"]
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
});

export const userModerations = mysqlTable('userModerations', {
  id: int('id').primaryKey().autoincrement(),
  guildId: varchar('guildId', { length: 64 }).notNull(),
  userId: varchar('userId', { length: 64 }).notNull(),
  type: mysqlEnum('type', ['warn', 'ban', 'kick']).notNull(),
  reason: text('reason'),
  moderatorId: varchar('moderatorId', { length: 64 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
});

export const forms = mysqlTable('forms', {
  id: int('id').primaryKey().autoincrement(),
  guildId: varchar('guildId', { length: 64 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  fields: text('fields').notNull(), // JSON: [{"name": "field1", "type": "text", "required": true}]
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
});

export const formSubmissions = mysqlTable('formSubmissions', {
  id: int('id').primaryKey().autoincrement(),
  formId: int('formId').notNull(),
  guildId: varchar('guildId', { length: 64 }).notNull(),
  userId: varchar('userId', { length: 64 }).notNull(),
  data: text('data').notNull(), // JSON: {"field1": "value1", "field2": "value2"}
  status: mysqlEnum('status', ['pending', 'approved', 'rejected']).default('pending'),
  reviewedBy: varchar('reviewedBy', { length: 64 }),
  reviewedAt: timestamp('reviewedAt'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
});

export const roleConfigs = mysqlTable('roleConfigs', {
  id: int('id').primaryKey().autoincrement(),
  guildId: varchar('guildId', { length: 64 }).notNull(),
  roleId: varchar('roleId', { length: 64 }).notNull(),
  autoAssign: boolean('autoAssign').default(false),
  requiresVerification: boolean('requiresVerification').default(false),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow().onUpdateNow(),
});

export const userRoles = mysqlTable('userRoles', {
  id: int('id').primaryKey().autoincrement(),
  guildId: varchar('guildId', { length: 64 }).notNull(),
  userId: varchar('userId', { length: 64 }).notNull(),
  roleId: varchar('roleId', { length: 64 }).notNull(),
  assignedBy: varchar('assignedBy', { length: 64 }),
  createdAt: timestamp('createdAt').defaultNow(),
});
