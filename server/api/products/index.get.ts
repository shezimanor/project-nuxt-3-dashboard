import { unref } from 'vue';
import { useProduct } from '~/composables/useProduct';

export default defineEventHandler(async (event) => {
  const { productData }: any = useProduct();

  await new Promise(function (resolve) {
    setTimeout(resolve, 10);
  });

  return unref(productData);
});
