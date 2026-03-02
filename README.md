# GharBanao - Construction Material & Expense Tracker

A comprehensive construction material and expense tracking application designed for house construction projects. Track vendors, purchases, bills, payments, and generate reports.

## Features

- **Vendor Management** - Add and manage vendors/suppliers with contact details
- **Purchase Tracking** - Record purchases with multiple items, quantities, rates, and bill photos
- **Payment Management** - Track payments with different modes (Cash, UPI, Bank, Cheque)
- **Bill Photo Upload** - Attach bill photos to purchases
- **Dashboard** - Overview of total spending, pending payments, category-wise breakdown
- **Reports** - Monthly spending, category-wise, and vendor-wise reports with charts
- **Bilingual Support** - English and Hindi language toggle
- **Dark/Light Theme** - Theme switcher for comfortable viewing

## Tech Stack

### Frontend
- React 18 with Vite
- Material-UI (MUI)
- React Router v6
- React Context API for state management
- Recharts for charts
- date-fns for date handling

### Backend
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ghar-banao
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

4. Configure environment variables:

Server (.env):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ghar-banao
JWT_SECRET=your-secret-key
```

Client (.env):
```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

1. Start MongoDB (if running locally)

2. Start the server:
```bash
cd server
npm run dev
```

3. Start the client (in a new terminal):
```bash
cd client
npm run dev
```

4. Open http://localhost:5173 in your browser

## Default Categories

The app comes with pre-configured construction material categories:
- Cement & Sand (सीमेंट और रेत)
- Bricks & Blocks (ईंट और ब्लॉक)
- Steel & Iron (स्टील और लोहा)
- Aggregate (गिट्टी/बजरी)
- Electrical (इलेक्ट्रिकल)
- Plumbing (प्लंबिंग)
- Paint & Putty (पेंट और पुट्टी)
- Tiles & Marble (टाइल्स और संगमरमर)
- Doors & Windows (दरवाजे और खिड़कियां)
- Hardware (हार्डवेयर)
- Wood & Plywood (लकड़ी और प्लाईवुड)
- Glass & Aluminium (कांच और एल्युमिनियम)
- Labour & Contractor (मजदूरी और ठेकेदार)
- Miscellaneous (अन्य)

## Screenshots

The app features:
- Clean dashboard with summary cards
- Responsive design for mobile and desktop
- Intuitive purchase form with multiple items support
- Bill photo capture and upload
- Category and vendor-wise spending charts

## License

Private - All Rights Reserved

---

Made by Vishal Soni
