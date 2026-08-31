import { createContext, useContext, useEffect, useState } from 'react';
import defaultProducts from '../data/products.json';
import { themeCards as defaultThemes } from '../data/themes';
import { defaultHeroImages } from '../data/siteSettings';
import { getApiUrl } from '../utils/api';

const ProductContext = createContext(null);
const STORAGE_KEY = 'ek-products';
const THEMES_STORAGE_KEY = 'ek-themes';
const HERO_IMAGES_STORAGE_KEY = 'ek-hero-images';

function readStoredProducts() {
  if (typeof window === 'undefined') return defaultProducts;

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
  if (typeof window === 'undefined') return defaultThemes;

  const savedThemes = localStorage.getItem(THEMES_STORAGE_KEY);
  if (!savedThemes) return defaultThemes;

  try {
    const parsedThemes = JSON.parse(savedThemes);
    return Array.isArray(parsedThemes) ? parsedThemes : defaultThemes;
  } catch {
    return defaultThemes;
  }
}

function readStoredHeroImages() {
  if (typeof window === 'undefined') return defaultHeroImages;

  try {
    const savedImages = JSON.parse(localStorage.getItem(HERO_IMAGES_STORAGE_KEY));
    return Array.isArray(savedImages) && savedImages.length > 0 ? savedImages : defaultHeroImages;
  } catch {
    return defaultHeroImages;
  }
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(defaultProducts);
  const [themes, setThemes] = useState(defaultThemes);
  const [heroImages, setHeroImages] = useState(defaultHeroImages);
  const [visitorStats, setVisitorStats] = useState({ total: 0, today: 0, live: 0 });

  useEffect(() => {
    setProducts(readStoredProducts());
    setThemes(readStoredThemes());
    setHeroImages(readStoredHeroImages());
  }, []);

  useEffect(() => {
    let isCurrent = true;

    fetch(getApiUrl('/api/site-settings'), { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load site settings');
        return response.json();
      })
      .then((settings) => {
        if (isCurrent && Array.isArray(settings.heroImages) && settings.heroImages.length > 0) {
          setHeroImages(settings.heroImages);
          localStorage.setItem(HERO_IMAGES_STORAGE_KEY, JSON.stringify(settings.heroImages));
        }
      })
      .catch(() => undefined);

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    let isCurrent = true;

    fetch(getApiUrl('/api/products'), { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load products');
        return response.json();
      })
      .then((remoteProducts) => {
        if (isCurrent && Array.isArray(remoteProducts) && remoteProducts.length > 0) {
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

    fetch(getApiUrl('/api/themes'), { cache: 'no-store' })
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
    if (typeof window === 'undefined') return undefined;

    const updateVisitorStats = () => {
      fetch(getApiUrl('/api/visitors'))
        .then((response) => response.ok ? response.json() : Promise.reject(new Error('Unable to load visitor stats')))
        .then((result) => setVisitorStats(result))
        .catch(() => undefined);
    };

    updateVisitorStats();
    const heartbeat = window.setInterval(updateVisitorStats, 60_000);
    return () => window.clearInterval(heartbeat);
  }, []);

  const updateProducts = async (nextProducts) => {
    const previousProducts = products;
    setProducts(nextProducts);
    try {
      const response = await fetch(getApiUrl('/api/products'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(typeof window !== 'undefined' && sessionStorage.getItem('ek-admin-token')
            ? { Authorization: `Bearer ${sessionStorage.getItem('ek-admin-token')}` }
            : {}),
        },
        body: JSON.stringify(nextProducts),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || 'Product update could not be saved.');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProducts));
      }
    } catch (error) {
      setProducts(previousProducts);
      throw error;
    }
  };

  const updateThemes = async (nextThemes) => {
    const previousThemes = themes;
    setThemes(nextThemes);
    try {
      const response = await fetch(getApiUrl('/api/themes'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(typeof window !== 'undefined' && sessionStorage.getItem('ek-admin-token')
            ? { Authorization: `Bearer ${sessionStorage.getItem('ek-admin-token')}` }
            : {}),
        },
        body: JSON.stringify(nextThemes),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || 'Theme update could not be saved.');
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(THEMES_STORAGE_KEY, JSON.stringify(nextThemes));
      }
    } catch (error) {
      setThemes(previousThemes);
      throw error;
    }
  };

  const updateHeroImages = async (nextHeroImages) => {
    const previousHeroImages = heroImages;
    setHeroImages(nextHeroImages);
    try {
      const response = await fetch(getApiUrl('/api/site-settings'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(typeof window !== 'undefined' && sessionStorage.getItem('ek-admin-token')
            ? { Authorization: `Bearer ${sessionStorage.getItem('ek-admin-token')}` }
            : {}),
        },
        body: JSON.stringify({ heroImages: nextHeroImages }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || 'Hero images could not be saved.');
      }

      localStorage.setItem(HERO_IMAGES_STORAGE_KEY, JSON.stringify(nextHeroImages));
    } catch (error) {
      setHeroImages(previousHeroImages);
      throw error;
    }
  };

  return (
    <ProductContext.Provider value={{ products, setProducts: updateProducts, themes, setThemes: updateThemes, heroImages, setHeroImages: updateHeroImages, visitorStats }}>
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
