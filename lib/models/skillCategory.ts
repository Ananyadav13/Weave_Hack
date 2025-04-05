import mongoose, { Schema, model, models } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const SkillCategorySchema = new Schema({
  category_id: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SkillCategory = models.SkillCategory || model('SkillCategory', SkillCategorySchema);

export default SkillCategory;