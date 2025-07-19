import { Schema, model, Document } from "mongoose";

export interface IUserDetails extends Document {
  userId: string; // Referencing the User collection
  age: number;
  gender: string;
  height: number;
  weight: number;
  activityLevel: string;
  dietaryPreferences: string;
  healthGoals: string;
  bmi: number;
  bmiCategory: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserDetailsSchema = new Schema<IUserDetails>(
  {
    userId: { type: String, required: true }, // Reference to user ID
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    activityLevel: { type: String, required: true },
    dietaryPreferences: { type: String, required: true },
    healthGoals: { type: String, required: true },
    bmi: { type: Number, required: true },
    bmiCategory: { type: String, required: true },
  },
  { timestamps: true }
);

const UserDetails = model<IUserDetails>("UserDetails", UserDetailsSchema);
export default UserDetails;
