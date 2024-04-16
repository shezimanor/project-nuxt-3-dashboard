import { v4 as uuid } from 'uuid';
import { unref } from 'vue';
import { useProduct } from '~/composables/useProduct';
import { usePrototype } from '~/composables/usePrototype';
import type { Product, Prototype } from '~/types';
import getCurrentFormattedDate from '~/utils/getCurrentFormattedDate';

export default defineEventHandler(async (event) => {
  const { productData: productDataRef } = useProduct();
  const { prototypeData: prototypeDataRef } = usePrototype();
  const body = await readBody(event);
  const productData = unref(productDataRef) as { list: Product[] };
  const prototypeData = unref(prototypeDataRef) as { list: Prototype[] };
  const newId = uuid();
  // 先找到對應的 prototype
  const prototype = prototypeData.list.find(
    (item: Prototype) => item.id === body.prototype_id
  );
  console.log('prototype', prototype);
  console.log('productData list', productData.list);
  if (!productData.list || !prototype) {
    throw createError({
      statusCode: 404,
      statusMessage: 'product list or prototype is not found!'
    });
  } else {
    const newProduct: Product = {
      id: newId,
      title: body.data.basicData.title,
      description: body.data.basicData.description,
      product_data: JSON.stringify(body.data),
      preview_link: `/product/showcase/${newId}`,
      prototype_id: prototype.id,
      prototype_title: prototype.title,
      prototype_version: prototype.version,
      status: 1,
      created_at: getCurrentFormattedDate(),
      updated_at: getCurrentFormattedDate()
    };
    // 新增 product
    productData.list.push(newProduct);
  }

  await new Promise(function (resolve) {
    setTimeout(resolve, 300);
  });

  return {
    result: true,
    link: `/product/showcase/${newId}`
  };
});
