import mongoose, { Schema, model, models } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const SkillSchema = new Schema({
  skill_id: { type: String, default: uuidv4, unique: true },
  category_id: { type: String, required: true, ref: 'SkillCategory' },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

SkillSchema.index({ category_id: 1, name: 1 }, { unique: true });

const Skill = models.Skill || model('Skill', SkillSchema);

export default Skill;