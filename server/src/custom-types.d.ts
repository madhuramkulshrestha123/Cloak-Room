interface AuthUser {
  id: number;
  username?: string;
  name: string;
  email: string;
  age?: number;
  google_id?: string;
  image?: string;
  provider: string;
  // Add other relevant user properties here
}

declare namespace Express {
  export interface Request {
    user?: AuthUser; // Optional user property
  }
}