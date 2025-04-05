import mongoose, { Schema, model, models } from 'mongoose';

const UserSkillSchema = new Schema({
  user_id: { type: String, required: true }, // Clerk user ID
  skill_id: { type: String, required: true, ref: 'Skill' },
  level: { type: Number, default: 1, min: 1, max: 5 },
  acquiredAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  positiveReviewsCount: { type: Number, default: 0, min: 0 },
  isVerified: { type: Boolean, default: false },
  verificationNotes: { type: String },
});

UserSkillSchema.index({ user_id: 1, skill_id: 1 }, { unique: true }); // Ensure a user has a skill only once
UserSkillSchema.index({ user_id: 1 }); // For faster retrieval of user's skills

const UserSkill = models.UserSkill || model('UserSkill', UserSkillSchema);

export default UserSkill;