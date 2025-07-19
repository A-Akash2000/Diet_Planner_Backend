import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { encryptResponse } from '../../../middlewares/middleware';

export const validateUserDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  await Promise.all([
    body('userId')
      .notEmpty().withMessage('User ID is required')
      .isString().withMessage('User ID must be a string')
      .run(req),

    body('age')
      .notEmpty().withMessage('Age is required')
      .isInt({ min: 1 }).withMessage('Age must be a positive integer')
      .run(req),

    body('gender')
      .notEmpty().withMessage('Gender is required')
      .isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other')
      .run(req),

    body('height')
      .notEmpty().withMessage('Height is required')
      .isFloat({ min: 1 }).withMessage('Height must be a positive number')
      .run(req),

    body('weight')
      .notEmpty().withMessage('Weight is required')
      .isFloat({ min: 1 }).withMessage('Weight must be a positive number')
      .run(req),

    body('activityLevel')
      .notEmpty().withMessage('Activity level is required')
      .isString().withMessage('Activity level must be a string')
      .run(req),

    body('dietaryPreferences')
      .notEmpty().withMessage('Dietary preferences are required')
      .isString().withMessage('Dietary preferences must be a string')
      .run(req),

    body('healthGoals')
      .notEmpty().withMessage('Health goals are required')
      .isString().withMessage('Health goals must be a string')
      .run(req),

    body('bmi')
      .notEmpty().withMessage('BMI is required')
      .isFloat({ min: 0 }).withMessage('BMI must be a non-negative number')
      .run(req),

    body('bmiCategory')
      .notEmpty().withMessage('BMI category is required')
      .isString().withMessage('BMI category must be a string')
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
