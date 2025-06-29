import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';
import type { SessionOptions } from 'iron-session';

export interface SessionData {
  username: string;
  isLoggedIn: boolean;
}

if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
  throw new Error(`
    ======================================================================
    CRITICAL CONFIGURATION ERROR
    ======================================================================
    The 'SESSION_SECRET' environment variable is missing or too short.
    This is required for user authentication to work securely.

    To fix this:
    1. Create a file named '.env.local' in the root of your project if it
       doesn't exist.
    2. Add the following line to the '.env.local' file:
       SESSION_SECRET="replace-with-a-super-secret-password-of-at-least-32-characters"
    3. Replace the placeholder text with your own unique, random secret
       that is at least 32 characters long.
    4. Restart the development server.
    ======================================================================
  `);
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: 'finance-app-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
}
