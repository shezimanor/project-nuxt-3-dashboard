import { useStorage } from '@vueuse/core';
import prototypeRawData from '~/data/product-prototypes.json';

export const usePrototype = () => {
  const prototypeData = useStorage('my-prototype', prototypeRawData);

  return { prototypeData };
};
