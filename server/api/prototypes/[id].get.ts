import { unref } from 'vue';
import { usePrototype } from '~/composables/usePrototype';
import type { Prototype } from '~/types';

export default defineEventHandler(async (event) => {
  const { prototypeData: prototypeDataRef } = usePrototype();
  const id = getRouterParam(event, 'id');
  const prototypeData = unref(prototypeDataRef);
  if (!prototypeData.list || prototypeData.list.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'prototype list is not found!'
    });
  } else {
    const prototype = prototypeData.list.find(
      (item: Prototype) => item.id === id
    );
    if (!prototype) {
      throw createError({
        statusCode: 404,
        statusMessage: 'prototype is not found!'
      });
    } else {
      // 由 api 處理引號問題
      prototype.schema = prototype.schema.replaceAll("'", '"');
      await new Promise(function (resolve) {
        setTimeout(resolve, 100);
      });
      return unref(prototype);
    }
  }
});
