import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); 

const MONGODB_URI = process.env.MONGODB_URI;

export const connectDB = async () => {
    if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI not defined in environment variables.");
    process.exit(1); 
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ MongoDB Connected Successfully!");
    } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred";
        console.error(`❌ MongoDB Connection Error: ${errorMessage}`);
        process.exit(1);
    }
};