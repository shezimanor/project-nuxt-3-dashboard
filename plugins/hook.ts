import type { RuntimeNuxtHooks } from '#app';

const logStyle = 'color: #06b6d4; font-weight: bold';
const getHookLog = (hookName: string) => `%cLifeCycle[${hookName}]`;

// https://nuxt.com/docs/api/advanced/hooks
const appHooks: Partial<keyof RuntimeNuxtHooks>[] = [
  'page:loading:start',
  'app:created',
  'app:beforeMount',
  'vue:setup',
  // 'app:rendered', // server
  'app:mounted',
  'page:start',
  'page:finish',
  'page:loading:end'
];
export default defineNuxtPlugin((nuxtApp) => {
  appHooks.forEach((hookName) => {
    nuxtApp.hook(hookName, () => {
      console.log(getHookLog(hookName), logStyle);
    });
  });
});
