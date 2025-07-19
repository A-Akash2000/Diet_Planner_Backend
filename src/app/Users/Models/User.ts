import mongoose, { Document, Schema } from 'mongoose';



export enum UserRole {
  Nurse = 'User',
  Admin = 'Admin',
}


export interface IUser extends Document {
  email: string;
  password: string;
  role: string;
  deleted:boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole),required: true },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);
