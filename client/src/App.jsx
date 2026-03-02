import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { VendorProvider } from './context/VendorContext';
import { PurchaseProvider } from './context/PurchaseContext';
import { PaymentProvider } from './context/PaymentContext';
import CustomToaster from './components/Common/CustomToaster';
import AppLayout from './components/Layout/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import Purchases from './pages/Purchases';
import Payments from './pages/Payments';
import Reports from './pages/Reports';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <VendorProvider>
              <PurchaseProvider>
                <PaymentProvider>
                  <CustomToaster />
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route element={<AppLayout />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/vendors" element={<Vendors />} />
                      <Route path="/purchases" element={<Purchases />} />
                      <Route path="/payments" element={<Payments />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/profile" element={<Profile />} />
                    </Route>

                    {/* Redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </PaymentProvider>
              </PurchaseProvider>
            </VendorProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
