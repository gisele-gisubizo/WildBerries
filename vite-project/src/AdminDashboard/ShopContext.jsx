import React, { createContext, useState, useContext } from 'react';

const ShopContext = createContext();

export const useShops = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [approvedShops, setApprovedShops] = useState([
    { id: 1, owner: 'Alice Mutesi', name: 'Kigali Fresh', address: 'Kigali, KG 123 St', appliedDate: '2025-08-25', status: 'Approved' },
  ]);

const addApprovedShop = (shop) => {
  setApprovedShops(prev => {
    const exists = prev.some(s => s.id === shop.id || s.name === shop.name);
    if (exists) return prev;
    return [...prev, { ...shop, status: 'Approved' }];
  });
};


  return (
    <ShopContext.Provider value={{ approvedShops, addApprovedShop }}>
      {children}
    </ShopContext.Provider>
  );
};



