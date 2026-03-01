import mongoose from 'mongoose';

const DressRuleSchema = new mongoose.Schema({
  gender: {
    type: String,
    enum: ['boy', 'girl'],
    required: true,
    lowercase: true,
    trim: true
  },

  year: {
    type: String,
    enum: ['1st', '2nd', '3rd', '4th'],
    required: true,
    lowercase: true,
    trim: true
  },

  topColors: [
    {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    }
  ],

  bottomColors: [
    {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    }
  ],

  idCardRequired: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true // automatically adds createdAt & updatedAt
});


/* =====================================================
   🔥 Prevent Duplicate Rule (1 rule per year + gender)
===================================================== */
DressRuleSchema.index(
  { year: 1, gender: 1 },
  { unique: true }
);

export default mongoose.models.DressRule ||
  mongoose.model('DressRule', DressRuleSchema);