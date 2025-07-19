import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id?: string;
        id?: string;
        username?: string;
        email?: string;
        password?: string;
        role?: string;
        createdAt?: Date;
        updatedAt?: Date;
      };
    }
  }
}
