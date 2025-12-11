export interface FormField {
  name: string;
  type: 'text' | 'number' | 'select' | 'checkbox';
  required: boolean;
  options?: string[];
}

export interface Form {
  id: number;
  guildId: string;
  name: string;
  description: string;
  fields: FormField[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FormSubmission {
  id: number;
  formId: number;
  guildId: string;
  userId: string;
  data: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WelcomeConfig {
  id: number;
  guildId: string;
  enabled: boolean;
  channelId?: string;
  message?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomodConfig {
  id: number;
  guildId: string;
  enabled: boolean;
  antiSpam: boolean;
  bannedWords: string[];
  bannedLinks: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserModeration {
  id: number;
  guildId: string;
  userId: string;
  type: 'warn' | 'ban' | 'kick';
  reason?: string;
  moderatorId: string;
  createdAt: Date;
}

export interface RoleConfig {
  id: number;
  guildId: string;
  roleId: string;
  autoAssign: boolean;
  requiresVerification: boolean;
  createdAt: Date;
  updatedAt: Date;
}
