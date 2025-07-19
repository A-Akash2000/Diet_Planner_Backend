
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import fileUpload from 'express-fileupload';
// import mongoSanitize from 'express-mongo-sanitize';
// import { Request, Response, NextFunction } from 'express';
// import sanitize = require('mongo-sanitize');
// const xssClean = require('xss-clean');

// export const sanitizeRequest = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void => {
//   if (req.body) req.body = sanitize(req.body);
//   if (req.params) req.params = sanitize(req.params);
//   if (req.query) req.query = sanitize(req.query);
//   next();
// };



export const securityMiddleware = [
  helmet(),
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'", 'http://localhost:5173'],
    },
  }),
  helmet.frameguard({ action: 'deny' }),
  helmet.hidePoweredBy(),
  helmet.referrerPolicy({ policy: 'no-referrer' }),
  helmet.dnsPrefetchControl({ allow: false }),
  helmet.crossOriginEmbedderPolicy({ policy: 'require-corp' }),
  
  helmet.hsts({
    maxAge: 63072000, // 2 years in seconds
    includeSubDomains: true,
    preload: true,
  }),

  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),

  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  }),

  // sanitizeRequest,
  // xssClean(),

  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    limits: { fileSize: 50 * 1024 * 1024 },
  }),
];


