import mongoose from 'mongoose';
import config from '../config/config';

export const connectToDatabase = async () => {
  try {
    // console.log("Mongo Url",config.DATABASE_URL)
    await mongoose.connect(config.DATABASE_URL); 
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
