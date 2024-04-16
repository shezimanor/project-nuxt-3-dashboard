import { unref } from 'vue';
import { useProduct } from '~/composables/useProduct';
import type { Product } from '~/types';
import getCurrentFormattedDate from '~/utils/getCurrentFormattedDate';

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
    // 更新的部分(title, product_data, description, updated_at)
    Object.assign(product, {
      title: body.data.basicData.title,
      description: body.data.basicData.description,
      product_data: JSON.stringify(body.data),
      updated_at: getCurrentFormattedDate()
    });
  }

  await new Promise(function (resolve) {
    setTimeout(resolve, 300);
  });

  return {
    result: true,
    link: `/product/showcase/${id}`
  };
});
