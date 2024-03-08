import { unref } from 'vue';
import { useProduct } from '~/composables/useProduct';
import type { Product } from '~/types';

export default defineEventHandler(async (event) => {
  const { productData: productDataRef } = useProduct();
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  const productData = unref(productDataRef);
  if (!productData.list || productData.list.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'product list is not found!'
    });
  } else {
    const product = productData.list.find((item: Product) => item.id === id);
    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'product is not found!'
      });
    }
    // 修改
    console.log('body:', body);
    Object.assign(product, body);
    console.log('product', product);
  }

  await new Promise(function (resolve) {
    setTimeout(resolve, 300);
  });

  return {
    result: true
  };
});
