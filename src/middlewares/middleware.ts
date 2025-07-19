import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from "../config/config"
import { decrypt, encrypt } from '../utils/crypto';
import { getUserById } from "../app/Users/controllers"
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

interface AuthenticatedUser {
  _id?:string;
  id:string;
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
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthenticatedUser;
  }
}

export const jwtMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json(encryptResponse({
      message: 'Authorization header missing or malformed',
      status: false,
      error: 'Authorization header missing or malformed',
    }));
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    const user = await getUserById(decoded.id);

    if (!user) {
      res.status(404).json(encryptResponse({
        message: 'User not found',
        status: false,
        error: 'User not found',
      }));
      return;
    }

    req.user = { id: user.id, role: user.role }; // Only attach necessary fields
    next();
  } catch (err) {
    res.status(403).json(encryptResponse({
      message: 'Invalid or expired token',
      status: false,
      error: 'Invalid or expired token',
    }));
  }
};


export const generateToken = (userId: string): string => {
  try {
    const payload = { id: userId };
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '24h',
    });

    return token;
  } catch (err) {
    return "false"
  }
};

export const encryptResponse = (data: any): string => {
  try {
    const payload = typeof data === 'string' ? data : JSON.stringify(data);
    const encrypted = encrypt(payload);
    return encrypted;
  } catch (err) {
    throw new Error(`Encryption failed: ${err}`);
  }
};

// export const decryptRequest = (req: Request, res: Response, next: NextFunction): void => {
//   try {
//     console.log("Comming in decrypting", req.body);

//     const contentType = req.headers['content-type'] || '';

//     if (req.method !== 'GET') {
//       if (contentType.includes('application/json') && req.body?.payload) {
//         const decrypted = decrypt(req.body.payload);
//         req.body = JSON.parse(decrypted);
//         console.log("req.body", req.body)
//         return next();
//       }

//       if (contentType.includes('application/x-www-form-urlencoded') && req.body?.payload) {
//         const decrypted = decrypt(req.body.payload);
//         req.body = JSON.parse(decrypted);
//         console.log("req.body", req.body)
//         return next();
//       }

//       if (contentType.includes('multipart/form-data')) {
//         if (req.body?.payload) {
//           try {
//             const decrypted = decrypt(req.body.payload);
//             const parsed = JSON.parse(decrypted);
//             req.body = { ...req.body, ...parsed };
//             delete req.body.payload; // optional: remove encrypted field
//           } catch (decryptionError) {
//             res.status(400).json(encryptResponse({ message: 'Invalid encrypted form data', error: decryptionError }));
//           }
//         }
//         console.log("req.body", req.body)
//         next();
//         return;
//       }
//     }
//     console.log("req.body", req.body)
//     next();
//   } catch (err) {
//     console.log("Error in decrypting", err);

//     res.status(400).json(encryptResponse({ message: 'Invalid encrypted request', error: err }));
//   }
// };

export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user || req.user.role !== "Admin") {
    res.status(403).json(
      encryptResponse({
        status: false,
        message: "Access denied. Admins only.",
      })
    );
    return;  // just return void, don't return the result of res.status().json()
  }
  next();
};

export const decryptRequest = (req: Request, res: Response, next: NextFunction): any => {
  try {
    const contentType = req.headers['content-type'] || '';

    if (req.method !== 'GET') {
      // Handle JSON and URL-encoded payloads
      if ((contentType.includes('application/json') || contentType.includes('application/x-www-form-urlencoded')) && req.body?.payload) {
        const decrypted = decrypt(req.body.payload);
        req.body = JSON.parse(decrypted);
        return next();
      }

      // Handle multipart/form-data
      if (contentType.includes('multipart/form-data')) {
        const decryptedFields: Record<string, any> = {};

        // If there's a payload, decrypt and merge it
        if (req.body?.payload) {
          try {
            const decrypted = decrypt(req.body.payload);
            const parsed = JSON.parse(decrypted);
            Object.assign(decryptedFields, parsed);
            delete req.body.payload;
          } catch (decryptionError) {
            return res.status(400).json(encryptResponse({ message: 'Invalid encrypted form data', error: decryptionError }));
          }
        }

        // Decrypt individual fields if they are encrypted
        for (const key in req.body) {
         // console.log("req.body",req.body)
          if (key === 'profilePicture') continue; // skip files
          if (typeof req.body[key] === 'string' && req.body[key].includes(':')) {
            try {
              decryptedFields[key] = decrypt(req.body[key]);
            } catch (err) {
              decryptedFields[key] = req.body[key]; // fallback to original if decryption fails
            }
          } else {
            decryptedFields[key] = req.body[key];
          }
        }

        req.body = { ...req.body, ...decryptedFields };
        console.log("req.bodyreq.body",req.body,req.files)
        return next();
      }
    }

    return next();
  } catch (err) {
    console.error('Error in decrypting request:', err);
    res.status(400).json(encryptResponse({ message: 'Invalid encrypted request', error: err }));
  }
};


export const  decrypttest = (data : any): any => {
  try {
    // console.log("sdfadsadasdsadsa",data)
      const decrypted = decrypt(data);
        data = JSON.parse(decrypted);
    return data
  } catch (err) {
    console.error('Error in decrypting request:', err);
  }
};