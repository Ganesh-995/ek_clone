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
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    let isCurrent = true;

    fetch('/api/products')
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load products');
        return response.json();
      })
      .then((remoteProducts) => {
        if (isCurrent && remoteProducts.length > 0) {
          setProducts(remoteProducts);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteProducts));
        }
      })
      .catch(() => undefined);

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    fetch('/api/visitors')
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Unable to load visitor count')))
      .then((result) => setVisitorCount(result.count))
      .catch(() => undefined);
  }, []);

  const updateProducts = (nextProducts) => {
    setProducts(nextProducts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProducts));

    fetch('/api/products', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(sessionStorage.getItem('ek-admin-token')
          ? { Authorization: `Bearer ${sessionStorage.getItem('ek-admin-token')}` }
          : {}),
      },
      body: JSON.stringify(nextProducts),
    }).catch(() => undefined);
  };

  return (
    <ProductContext.Provider value={{ products, setProducts: updateProducts, visitorCount }}>
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
