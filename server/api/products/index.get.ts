import { unref } from 'vue';
import { useProduct } from '~/composables/useProduct';
import type { Product } from '~/types';

export default defineEventHandler(async (event) => {
  const { productData }: any = useProduct();

  // 將 status = 0 的商品過濾掉
  productData.value.list = productData.value.list.filter(
    (item: Product) => item.status === 1
  );

  await new Promise(function (resolve) {
    setTimeout(resolve, 100);
  });

  return unref(productData);
});
