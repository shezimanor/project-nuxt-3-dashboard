import { useStorage } from '@vueuse/core';
import productData from '~/data/products.json';

// const products = productData;
const products = useStorage('my-products', productData);

export default defineEventHandler(async (event) => {
  await new Promise(function (resolve) {
    setTimeout(resolve, 300);
  });
  return products.value.list;
});
