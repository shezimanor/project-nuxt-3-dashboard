import { useStorage } from '@vueuse/core';
import prototypeData from '~/data/product-prototypes.json';

export default defineEventHandler(async (event) => {
  const prototypes = useStorage('my-prototypes', prototypeData);

  await new Promise(function (resolve) {
    setTimeout(resolve, 300);
  });

  return prototypes.value.list;
});
