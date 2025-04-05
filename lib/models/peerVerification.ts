import mongoose, { Schema, model, models } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const PeerVerificationSchema = new Schema({
  verification_id: { type: String, default: uuidv4, unique: true },
  user_skill_user_id: { type: String, required: true }, // Clerk user ID of the skill owner
  user_skill_skill_id: { type: String, required: true, ref: 'Skill' },
  verifying_user_id: { type: String, required: true }, // Clerk user ID of the verifier
  verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  verificationNotes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

PeerVerificationSchema.index({ user_skill_user_id: 1, user_skill_skill_id: 1, verifying_user_id: 1 }, { unique: true }); // Prevent duplicate verifications

const PeerVerification = models.PeerVerification || model('PeerVerification', PeerVerificationSchema);

export default PeerVerification;