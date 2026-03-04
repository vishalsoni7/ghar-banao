import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  nameHi: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    default: 'Category'
  },
  color: {
    type: String,
    default: '#1976d2'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Default categories to seed
export const defaultCategories = [
  { name: 'Cement', nameHi: 'सीमेंट', icon: 'Foundation', color: '#795548' },
  { name: 'Sand', nameHi: 'रेत', icon: 'Grain', color: '#a1887f' },
  { name: 'Bricks', nameHi: 'ईंट', icon: 'ViewModule', color: '#d32f2f' },
  { name: 'Blocks', nameHi: 'ब्लॉक', icon: 'ViewComfy', color: '#e57373' },
  { name: 'Stone', nameHi: 'पत्थर', icon: 'Landscape', color: '#78909c' },
  { name: 'Steel', nameHi: 'स्टील', icon: 'Hardware', color: '#455a64' },
  { name: 'Iron', nameHi: 'लोहा', icon: 'Construction', color: '#546e7a' },
  { name: 'Aggregate', nameHi: 'गिट्टी/बजरी', icon: 'Grain', color: '#8d6e63' },
  { name: 'Electrical', nameHi: 'इलेक्ट्रिकल', icon: 'ElectricalServices', color: '#ffc107' },
  { name: 'Plumbing', nameHi: 'प्लंबिंग', icon: 'Plumbing', color: '#2196f3' },
  { name: 'Paint', nameHi: 'पेंट', icon: 'FormatPaint', color: '#9c27b0' },
  { name: 'Putty', nameHi: 'पुट्टी', icon: 'Brush', color: '#ba68c8' },
  { name: 'Tiles', nameHi: 'टाइल्स', icon: 'GridOn', color: '#00bcd4' },
  { name: 'Marble', nameHi: 'संगमरमर', icon: 'Layers', color: '#26c6da' },
  { name: 'Doors', nameHi: 'दरवाजे', icon: 'DoorFront', color: '#4caf50' },
  { name: 'Windows', nameHi: 'खिड़कियां', icon: 'Window', color: '#66bb6a' },
  { name: 'Hardware', nameHi: 'हार्डवेयर', icon: 'Build', color: '#607d8b' },
  { name: 'Wood', nameHi: 'लकड़ी', icon: 'Forest', color: '#6d4c41' },
  { name: 'Plywood', nameHi: 'प्लाईवुड', icon: 'ViewModule', color: '#8d6e63' },
  { name: 'Glass', nameHi: 'कांच', icon: 'Window', color: '#90a4ae' },
  { name: 'Aluminium', nameHi: 'एल्युमिनियम', icon: 'ViewColumn', color: '#b0bec5' },
  { name: 'Labour', nameHi: 'मजदूरी', icon: 'Engineering', color: '#ff9800' },
  { name: 'Contractor', nameHi: 'ठेकेदार', icon: 'Person', color: '#ffb74d' },
  { name: 'Miscellaneous', nameHi: 'अन्य', icon: 'MoreHoriz', color: '#9e9e9e' }
];

export default mongoose.model('Category', categorySchema);
