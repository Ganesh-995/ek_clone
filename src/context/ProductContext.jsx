import { createContext, useContext, useEffect, useState } from 'react';
import defaultProducts from '../data/products.json';

const ProductContext = createContext(null);
const STORAGE_KEY = 'ek-products';

function readStoredProducts() {
  const savedProducts = localStorage.getItem(STORAGE_KEY);
  if (!savedProducts) return defaultProducts;

  try {
    const parsedProducts = JSON.parse(savedProducts);
    return parsedProducts.some((product) => product.image?.includes('via.placeholder.com'))
      ? defaultProducts
      : parsedProducts;
  } catch {
    return defaultProducts;
  }
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    return readStoredProducts();
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error('useProducts must be used inside ProductProvider');
  }

  return context;
}
