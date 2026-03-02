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
  { name: 'Steel & Iron', nameHi: 'स्टील और लोहा', icon: 'Hardware', color: '#455a64' },
  { name: 'Aggregate', nameHi: 'गिट्टी/बजरी', icon: 'Grain', color: '#8d6e63' },
  { name: 'Electrical', nameHi: 'इलेक्ट्रिकल', icon: 'ElectricalServices', color: '#ffc107' },
  { name: 'Plumbing', nameHi: 'प्लंबिंग', icon: 'Plumbing', color: '#2196f3' },
  { name: 'Paint & Putty', nameHi: 'पेंट और पुट्टी', icon: 'FormatPaint', color: '#9c27b0' },
  { name: 'Tiles & Marble', nameHi: 'टाइल्स और संगमरमर', icon: 'GridOn', color: '#00bcd4' },
  { name: 'Doors & Windows', nameHi: 'दरवाजे और खिड़कियां', icon: 'DoorFront', color: '#4caf50' },
  { name: 'Hardware', nameHi: 'हार्डवेयर', icon: 'Build', color: '#607d8b' },
  { name: 'Wood & Plywood', nameHi: 'लकड़ी और प्लाईवुड', icon: 'Forest', color: '#6d4c41' },
  { name: 'Glass & Aluminium', nameHi: 'कांच और एल्युमिनियम', icon: 'Window', color: '#90a4ae' },
  { name: 'Labour & Contractor', nameHi: 'मजदूरी और ठेकेदार', icon: 'Engineering', color: '#ff9800' },
  { name: 'Miscellaneous', nameHi: 'अन्य', icon: 'MoreHoriz', color: '#9e9e9e' }
];

export default mongoose.model('Category', categorySchema);
