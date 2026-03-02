import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  purchaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Purchase'
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor'
  },
  vendorName: {
    type: String,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  paymentMode: {
    type: String,
    enum: ['cash', 'upi', 'bank', 'cheque'],
    default: 'cash'
  },
  reference: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
paymentSchema.index({ userId: 1, date: -1 });
paymentSchema.index({ userId: 1, vendorId: 1 });
paymentSchema.index({ purchaseId: 1 });

export default mongoose.model('Payment', paymentSchema);
