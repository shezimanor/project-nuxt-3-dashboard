import { useStorage } from '@vueuse/core';
import prototypeData from '~/data/product-prototypes.json';

// const products = productData;
const prototypes = useStorage('my-prototypes', prototypeData);

export default defineEventHandler(async (event) => {
  await new Promise(function (resolve) {
    setTimeout(resolve, 300);
  });
  return prototypes.value.list;
});
