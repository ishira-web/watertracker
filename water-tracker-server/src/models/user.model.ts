import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    // Unique identifier for authentication (e.g., login)
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    // Stored as a hashed password (MUST be hashed using bcrypt or similar)
    password: {
        type: String,
        required: true
    },
    // User's target daily water intake in milliliters (ml)
    dailyGoal: {
        type: Number,
        default: 2000, // A common default goal, e.g., 2000 ml
        min: 100 
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

// Create and export the Mongoose Model
export const User = mongoose.model('User', UserSchema);
