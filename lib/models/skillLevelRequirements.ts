import mongoose, { Schema, model, models } from 'mongoose';

const SkillLevelRequirementSchema = new Schema({
  level: { type: Number, required: true, unique: true, min: 1, max: 5 },
  requiredPositiveReviews: { type: Number, default: 0, min: 0 },
  needsPeerVerification: { type: Boolean, default: false },
  description: { type: String },
});

const SkillLevelRequirement = models.SkillLevelRequirement || model('SkillLevelRequirement', SkillLevelRequirementSchema);

export default SkillLevelRequirement;