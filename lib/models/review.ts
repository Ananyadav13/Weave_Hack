import mongoose, { Schema, model, models } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const ReviewSchema = new Schema({
  review_id: { type: String, default: uuidv4, unique: true },
  reviewer_user_id: { type: String, required: true }, // Clerk user ID
  reviewed_user_id: { type: String, required: true }, // Clerk user ID
  skill_id: { type: String, required: true, ref: 'Skill' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

ReviewSchema.index({ reviewed_user_id: 1, skill_id: 1 }); // Find reviews for a user on a specific skill
ReviewSchema.index({ reviewed_user_id: 1 }); // Find all reviews for a user

const Review = models.Review || model('Review', ReviewSchema);

export default Review;