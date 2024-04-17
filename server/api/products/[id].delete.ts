import { unref } from 'vue';
import { useProduct } from '~/composables/useProduct';
import type { Product } from '~/types';

export default defineEventHandler(async (event) => {
  const { productData: productDataRef } = useProduct();
  const id = getRouterParam(event, 'id');
  const productData = unref(productDataRef);
  if (!productData.list || productData.list.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'product list is not found!'
    });
  } else {
    const productIndex = productData.list.findIndex(
      (item: Product) => item.id === id && item.status === 1
    );
    if (productIndex === -1) {
      throw createError({
        statusCode: 404,
        statusMessage: 'product is not found!'
      });
    } else {
      // 刪除
      productData.list.splice(productIndex, 1);

      await new Promise(function (resolve) {
        setTimeout(resolve, 100);
      });

      return {
        result: true
      };
    }
  }
});
