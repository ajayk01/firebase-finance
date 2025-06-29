import { getIronSession, IronSession } from 'iron-session';
import { cookies } from 'next/headers';
import type { SessionOptions } from 'iron-session';

export interface SessionData {
  username: string;
  isLoggedIn: boolean;
}

const SECRET = process.env.SESSION_SECRET;

if (!SECRET || SECRET.length < 32) {
  const message = `
    ======================================================================
      [CONFIG ERROR] Missing or Short Session Secret
    ======================================================================
      The 'SESSION_SECRET' environment variable is missing or too short.
      This is required for user authentication to work securely.

      QUICK FIX:
      1. Create a file named '.env.local' in the root of your project.
      2. Add the following line to it:
         SESSION_SECRET="replace-this-with-a-long-random-secret-string"
      3. Make sure the secret is at least 32 characters long.
      4. Restart your development server.
    ======================================================================
  `;
  
  // In development, we must stop the server to ensure the developer fixes this.
  if (process.env.NODE_ENV === 'development') {
    throw new Error(message);
  }
  
  // In a production environment, we'll log the error but won't crash the server.
  // Note: Authentication will fail until this is fixed.
  console.error(message);
}

export const sessionOptions: SessionOptions = {
  password: SECRET as string, // We've established the secret exists at this point.
  cookieName: 'finance-app-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
}
