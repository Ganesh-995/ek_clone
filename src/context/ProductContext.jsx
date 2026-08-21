import { createContext, useContext, useEffect, useState } from 'react';
import defaultProducts from '../data/products.json';

const ProductContext = createContext(null);
const STORAGE_KEY = 'ek-products';
const CAROUSEL_STORAGE_KEY = 'ek-carousel-images';

const defaultCarouselImages = defaultProducts.map((product) => ({
  id: `carousel-${product.id}`,
  image: product.image
}));

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
  const [carouselImages, setCarouselImages] = useState(() => {
    const savedImages = localStorage.getItem(CAROUSEL_STORAGE_KEY);
    if (savedImages) {
      try {
        const parsedImages = JSON.parse(savedImages);
        if (!parsedImages.some((image) => image.image?.includes('via.placeholder.com'))) return parsedImages;
      } catch {
        return defaultCarouselImages;
      }
    }

    return defaultCarouselImages;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(CAROUSEL_STORAGE_KEY, JSON.stringify(carouselImages));
  }, [carouselImages]);

  return (
    <ProductContext.Provider value={{ products, setProducts, carouselImages, setCarouselImages }}>
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
