import mongoose from 'mongoose';

const RuleSchema = new mongoose.Schema({
  gender: { type: String, enum: ['boy', 'girl'], required: true },
  category: { type: String, required: true }, // shirt, pants, shoes, etc.
  required: { type: Boolean, default: true },
  description: { type: String, required: true },
  points: { type: Number, default: 10 }
});

export default mongoose.models.Rule || mongoose.model('Rule', RuleSchema);
