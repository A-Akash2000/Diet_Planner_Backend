import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { encryptResponse } from '../../../middlewares/middleware';

export const validateMeal = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  await Promise.all([
    body('name')
      .notEmpty().withMessage('Meal name is required')
      .isString().withMessage('Meal name must be a string')
      .run(req),

    body('category')
      .notEmpty().withMessage('Category is required')
      .isIn(['breakfast', 'lunch', 'dinner', 'snack']).withMessage('Category must be breakfast, lunch, dinner, or snack')
      .run(req),

    body('calories')
      .notEmpty().withMessage('Calories are required')
      .isFloat({ min: 0 }).withMessage('Calories must be a non-negative number')
      .run(req),

    body('proteins')
      .notEmpty().withMessage('Proteins are required')
      .isFloat({ min: 0 }).withMessage('Proteins must be a non-negative number')
      .run(req),

    body('carbs')
      .notEmpty().withMessage('Carbs are required')
      .isFloat({ min: 0 }).withMessage('Carbs must be a non-negative number')
      .run(req),

    body('fats')
      .notEmpty().withMessage('Fats are required')
      .isFloat({ min: 0 }).withMessage('Fats must be a non-negative number')
      .run(req),
  ]);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json(
      encryptResponse({
        status: false,
        msg: 'Validation Failed',
        errors: errors.array(),
      })
    );
    return;
  }

  next();
};
