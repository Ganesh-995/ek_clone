import { createContext, useContext, useEffect, useState } from 'react';
import defaultProducts from '../data/products.json';
import { themeCards as defaultThemes } from '../data/themes';

const ProductContext = createContext(null);
const STORAGE_KEY = 'ek-products';
const THEMES_STORAGE_KEY = 'ek-themes';

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

function readStoredThemes() {
  const savedThemes = localStorage.getItem(THEMES_STORAGE_KEY);
  if (!savedThemes) return defaultThemes;

  try {
    const parsedThemes = JSON.parse(savedThemes);
    return Array.isArray(parsedThemes) ? parsedThemes : defaultThemes;
  } catch {
    return defaultThemes;
  }
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    return readStoredProducts();
  });
  const [themes, setThemes] = useState(() => readStoredThemes());
  const [visitorStats, setVisitorStats] = useState({ total: 0, today: 0, live: 0 });

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
    let isCurrent = true;

    fetch('/api/themes')
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load themes');
        return response.json();
      })
      .then((remoteThemes) => {
        if (isCurrent && Array.isArray(remoteThemes) && remoteThemes.length > 0) {
          setThemes(remoteThemes);
          localStorage.setItem(THEMES_STORAGE_KEY, JSON.stringify(remoteThemes));
        }
      })
      .catch(() => undefined);

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    const updateVisitorStats = () => {
      fetch('/api/visitors')
        .then((response) => response.ok ? response.json() : Promise.reject(new Error('Unable to load visitor stats')))
        .then((result) => setVisitorStats(result))
        .catch(() => undefined);
    };

    updateVisitorStats();
    const heartbeat = window.setInterval(updateVisitorStats, 60_000);
    return () => window.clearInterval(heartbeat);
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

  const updateThemes = (nextThemes) => {
    setThemes(nextThemes);
    localStorage.setItem(THEMES_STORAGE_KEY, JSON.stringify(nextThemes));

    fetch('/api/themes', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(sessionStorage.getItem('ek-admin-token')
          ? { Authorization: `Bearer ${sessionStorage.getItem('ek-admin-token')}` }
          : {}),
      },
      body: JSON.stringify(nextThemes),
    }).catch(() => undefined);
  };

  return (
    <ProductContext.Provider value={{ products, setProducts: updateProducts, themes, setThemes: updateThemes, visitorStats }}>
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
