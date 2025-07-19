import { Schema, model, Document, Types } from 'mongoose';

export interface IBMILog extends Document {
  userId: Types.ObjectId;
  weight: number;       // in kilograms
  height: number;       // in centimeters
  bmi: number;
  bmiCategory: string;
  recordedAt: Date;
}

const BMILogSchema = new Schema<IBMILog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    weight: {
      type: Number,
      required: true,
      min: 1,
    },
    height: {
      type: Number,
      required: true,
      min: 1,
    },
    bmi: {
      type: Number,
      required: true,
      min: 0,
    },
    bmiCategory: {
      type: String,
      required: true,
      enum: ['Underweight', 'Normal', 'Overweight', 'Obese'],
    },
    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default model<IBMILog>('BMILog', BMILogSchema);
