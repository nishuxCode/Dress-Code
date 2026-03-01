import mongoose from 'mongoose';

const ScanLogSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  topColor: { type: String, required: true },
  bottomColor: { type: String, required: true },
  idCardDetected: { type: Boolean, required: true },
  imageUrl: { type: String },
  status: { type: String, enum: ['Allowed', 'Violation'], required: true },
  violations: [{ type: String }], // ['Wrong Shirt Color', 'Wrong Bottom Color']
  scannedAt: { type: Date, default: Date.now }
});

export default mongoose.models.ScanLog || mongoose.model('ScanLog', ScanLogSchema);
