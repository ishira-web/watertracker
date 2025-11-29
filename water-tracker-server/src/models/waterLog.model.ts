import mongoose from 'mongoose';

const WaterLogSchema = new mongoose.Schema({
    // Reference to the User who logged this intake
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links this entry to the 'User' collection
        required: true
    },
    // Amount of water consumed in milliliters (ml)
    amount: {
        type: Number,
        required: true,
        min: 1 // Must log at least 1 ml
    },
    // The exact date and time the water was consumed
    date: {
        type: Date,
        default: Date.now // Defaults to the time of creation
    }
}, {
    timestamps: true 
});


WaterLogSchema.index({ userId: 1, date: -1 });

export const WaterLog = mongoose.model('WaterLog', WaterLogSchema);
