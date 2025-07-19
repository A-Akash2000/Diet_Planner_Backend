import mongoose, { Schema, Document, Types } from 'mongoose';

export interface NutritionalValues {
  calories: number;
  proteins: number;
  carbs?: number;
  fats?: number;
}

export interface MealEntry {
  mealId: Types.ObjectId;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  suggestedMeals: string[];
  nutritionalValues: NutritionalValues;
}

export interface IDietPlan extends Document {
  userId: Types.ObjectId;
  period: 'Daily' | 'Weekly';
  meals: MealEntry[];
}

const DietPlanSchema = new Schema<IDietPlan>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    period: { type: String, enum: ['Daily', 'Weekly'], required: true },
    meals: [
      {
        mealId: { type: Schema.Types.ObjectId, ref: 'Meal', required: true },
        mealType: {
          type: String,
          enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
          required: true,
        },
        suggestedMeals: { type: [String], required: true },
        nutritionalValues: {
          calories: { type: Number, required: true },
          proteins: { type: Number, required: true },
          carbs: { type: Number },
          fats: { type: Number },
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IDietPlan>('DietPlan', DietPlanSchema);
