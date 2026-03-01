import mongoose from 'mongoose';

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  regNo: { type: String, required: true, unique: true },
  year: { type: String, enum: ['1st', '2nd', '3rd', '4th'], required: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['boy', 'girl'], required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Student || mongoose.model('Student', StudentSchema);
