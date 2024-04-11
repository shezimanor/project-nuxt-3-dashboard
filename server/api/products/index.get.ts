import { unref } from 'vue';
import { useProduct } from '~/composables/useProduct';

export default defineEventHandler(async (event) => {
  const { productData } = useProduct();

  await new Promise(function (resolve) {
    setTimeout(resolve, 100);
  });

  return unref(productData);
});
