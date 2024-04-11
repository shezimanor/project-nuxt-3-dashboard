import { unref } from 'vue';
import { usePrototype } from '~/composables/usePrototype';

export default defineEventHandler(async (event) => {
  const { prototypeData } = usePrototype();

  await new Promise(function (resolve) {
    setTimeout(resolve, 100);
  });

  return unref(prototypeData);
});
