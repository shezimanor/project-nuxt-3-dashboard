import { v4 as uuid } from 'uuid';
import { unref } from 'vue';
import { useProduct } from '~/composables/useProduct';
import type { Product } from '~/types';
import getCurrentFormattedDate from '~/utils/getCurrentFormattedDate';

export default defineEventHandler(async (event) => {
  const { productData: productDataRef } = useProduct();
  const body = await readBody(event);
  const productData = unref(productDataRef);
  if (!productData.list) {
    throw createError({
      statusCode: 404,
      statusMessage: 'product list is not found!'
    });
  } else {
    const newProduct: Product = {
      ...body,
      id: uuid(),
      created_at: getCurrentFormattedDate()
    };
    productData.list.push(newProduct);
  }

  await new Promise(function (resolve) {
    setTimeout(resolve, 300);
  });

  return {
    result: true
  };
});
