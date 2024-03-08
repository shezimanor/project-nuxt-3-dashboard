import { useStorage } from '@vueuse/core';
import productRawData from '~/data/products.json';

export const useProduct = () => {
  const productData = useStorage('my-product', productRawData);

  return { productData };
};
