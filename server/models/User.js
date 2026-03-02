import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  projectName: {
    type: String,
    default: 'My House Construction'
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
