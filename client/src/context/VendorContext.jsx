import { createContext, useContext, useState, useCallback } from 'react';
import { vendorAPI } from '../utils/api';

const VendorContext = createContext();

export const useVendors = () => {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error('useVendors must be used within VendorProvider');
  }
  return context;
};

export const VendorProvider = ({ children }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVendors = useCallback(async () => {
    setLoading(true);
    try {
      const response = await vendorAPI.getAll();
      setVendors(response.data);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addVendor = async (data) => {
    const response = await vendorAPI.create(data);
    setVendors(prev => [...prev, response.data.vendor]);
    return response.data;
  };

  const updateVendor = async (id, data) => {
    const response = await vendorAPI.update(id, data);
    setVendors(prev => prev.map(v => v._id === id ? { ...v, ...response.data.vendor } : v));
    return response.data;
  };

  const deleteVendor = async (id) => {
    await vendorAPI.delete(id);
    setVendors(prev => prev.filter(v => v._id !== id));
  };

  const getVendorById = async (id) => {
    const response = await vendorAPI.getById(id);
    return response.data;
  };

  return (
    <VendorContext.Provider value={{
      vendors,
      loading,
      fetchVendors,
      addVendor,
      updateVendor,
      deleteVendor,
      getVendorById
    }}>
      {children}
    </VendorContext.Provider>
  );
};

export default VendorContext;
