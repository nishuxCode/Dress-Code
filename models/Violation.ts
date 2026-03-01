import mongoose from 'mongoose';

const ViolationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  scanLogId: { type: mongoose.Schema.Types.ObjectId, ref: 'ScanLog', required: true },
  violations: [{ type: String }], // ['Wrong Shirt Color', 'ID Card Missing']
  imageUrl: { type: String },
  emailSent: { type: Boolean, default: false },
  resolved: { type: Boolean, default: false },
  violation_date: { type: Date, default: Date.now }
});

export default mongoose.models.Violation || mongoose.model('Violation', ViolationSchema);
