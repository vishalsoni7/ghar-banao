import { createContext, useContext, useState, useCallback } from 'react';
import { paymentAPI } from '../utils/api';

const PaymentContext = createContext();

export const usePayments = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayments must be used within PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPayments = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await paymentAPI.getAll(params);
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addPayment = async (data) => {
    const response = await paymentAPI.create(data);
    setPayments(prev => [response.data.payment, ...prev]);
    return response.data;
  };

  const deletePayment = async (id) => {
    await paymentAPI.delete(id);
    setPayments(prev => prev.filter(p => p._id !== id));
  };

  const getPaymentById = async (id) => {
    const response = await paymentAPI.getById(id);
    return response.data;
  };

  return (
    <PaymentContext.Provider value={{
      payments,
      loading,
      fetchPayments,
      addPayment,
      deletePayment,
      getPaymentById
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentContext;
