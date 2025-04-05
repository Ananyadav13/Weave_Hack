import mongoose, { Schema, model, models } from 'mongoose';

const TokenSchema = new Schema({
  user_id: { type: String, required: true, unique: true }, // Clerk user ID
  balance: { type: Number, default: 0.00, min: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

const Token = models.Token || model('Token', TokenSchema);

export default Token;