import mongoose, { Schema, model, models } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const TransactionSchema = new Schema({
  transaction_id: { type: String, default: uuidv4, unique: true },
  sender_user_id: { type: String, required: true }, // Clerk user ID
  receiver_user_id: { type: String, required: true }, // Clerk user ID
  skill_id: { type: String, ref: 'Skill' }, // Optional
  type: { type: String, enum: ['skill_exchange', 'token_payment', 'token_reward', 'admin_adjustment'], required: true },
  amount: { type: Number, default: 0 },
  description: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'cancelled', 'failed'], default: 'completed' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

TransactionSchema.index({ sender_user_id: 1 });
TransactionSchema.index({ receiver_user_id: 1 });
TransactionSchema.index({ createdAt: -1 });

const Transaction = models.Transaction || model('Transaction', TransactionSchema);

export default Transaction;