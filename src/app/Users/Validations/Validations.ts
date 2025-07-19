import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { encryptResponse } from '../../../middlewares/middleware';
import { UserRole } from '../Models/User';

export const validateAddUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  await Promise.all([
    body('email')
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .run(req),

    body('role')
      .notEmpty().withMessage('Role is required')
      .isIn(Object.values(UserRole)).withMessage('Role must be admin, manager, or staff')
      .run(req),

    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
      .run(req),

  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(encryptResponse({
      status: false,
      msg: "Validation Failed",
      errors: errors.array()
    }));
    return;
  }

  next();
};
