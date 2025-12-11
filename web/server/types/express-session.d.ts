import 'express-session';

declare module 'express-session' {
  interface SessionData {
    accessToken?: string;
    user?: {
      id: string;
      username: string;
      discriminator: string;
      avatar?: string;
    };
  }
}
