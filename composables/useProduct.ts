import { useStorage } from '@vueuse/core';
import productData from '~/data/products.json';

export const useProduct = () => {
  const testList = useStorage('my-products', productData);
  return { testList };
};
