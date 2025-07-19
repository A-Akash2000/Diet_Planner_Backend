import { Schema, model, Document } from 'mongoose';

export interface IMeal extends Document {
  name: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  dietaryTags: string[];
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  ingredients?: string[];
  createdAt?: Date;
}

const MealSchema = new Schema<IMeal>(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: true,
    },
    dietaryTags: [{ type: String, required: true }],
    calories: { type: Number, required: true },
    proteins: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
    ingredients: [{ type: String }],
  },
  { timestamps: true }
);

const Meal = model<IMeal>('Meal', MealSchema);
export default Meal;
