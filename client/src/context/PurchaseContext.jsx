import { createContext, useContext, useState, useCallback } from 'react';
import { purchaseAPI, categoryAPI } from '../utils/api';

const PurchaseContext = createContext();

export const usePurchases = () => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error('usePurchases must be used within PurchaseProvider');
  }
  return context;
};

export const PurchaseProvider = ({ children }) => {
  const [purchases, setPurchases] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPurchases = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const response = await purchaseAPI.getAll(params);
      setPurchases(response.data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async (shouldSync = false) => {
    try {
      // Sync first to get any new default categories
      if (shouldSync) {
        const syncResponse = await categoryAPI.sync();
        setCategories(syncResponse.data.categories);
      } else {
        const response = await categoryAPI.getAll();
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to getAll if sync fails
      try {
        const response = await categoryAPI.getAll();
        setCategories(response.data);
      } catch (fallbackError) {
        console.error('Error in fallback fetch:', fallbackError);
      }
    }
  }, []);

  const syncCategories = useCallback(async () => {
    try {
      const response = await categoryAPI.sync();
      setCategories(response.data.categories);
      return response.data;
    } catch (error) {
      console.error('Error syncing categories:', error);
      throw error;
    }
  }, []);

  const addCategory = async (data) => {
    const response = await categoryAPI.create(data);
    setCategories(prev => [...prev, response.data.category].sort((a, b) => a.name.localeCompare(b.name)));
    return response.data;
  };

  const updateCategory = async (id, data) => {
    const response = await categoryAPI.update(id, data);
    setCategories(prev => prev.map(c => c._id === id ? response.data.category : c).sort((a, b) => a.name.localeCompare(b.name)));
    return response.data;
  };

  const deleteCategory = async (id) => {
    await categoryAPI.delete(id);
    setCategories(prev => prev.filter(c => c._id !== id));
  };

  const addPurchase = async (data) => {
    const response = await purchaseAPI.create(data);
    setPurchases(prev => [response.data.purchase, ...prev]);
    return response.data;
  };

  const updatePurchase = async (id, data) => {
    const response = await purchaseAPI.update(id, data);
    setPurchases(prev => prev.map(p => p._id === id ? response.data.purchase : p));
    return response.data;
  };

  const deletePurchase = async (id) => {
    await purchaseAPI.delete(id);
    setPurchases(prev => prev.filter(p => p._id !== id));
  };

  const getPurchaseById = async (id) => {
    const response = await purchaseAPI.getById(id);
    return response.data;
  };

  return (
    <PurchaseContext.Provider value={{
      purchases,
      categories,
      loading,
      fetchPurchases,
      fetchCategories,
      syncCategories,
      addCategory,
      updateCategory,
      deleteCategory,
      addPurchase,
      updatePurchase,
      deletePurchase,
      getPurchaseById
    }}>
      {children}
    </PurchaseContext.Provider>
  );
};

export default PurchaseContext;
