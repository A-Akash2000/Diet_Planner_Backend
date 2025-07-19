import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id?: string;
        id?: string;
        username?: string;
        email?: string;
        contactNumber?: string;
        password?: string;
        role?: string;
        shiftStart?: string;
        shiftEnd?: string;
        address?: string;
        gender?: string;
        isAvailable?: boolean;
        lastUpdated?: Date;
        createdAt?: Date;
        updatedAt?: Date;
        deleted?: boolean;
        profilePicture?:String
      };
    }
  }
}
