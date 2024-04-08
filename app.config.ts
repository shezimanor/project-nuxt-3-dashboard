// 全域的設定：https://nuxt.com/docs/guide/directory-structure/app-config
export default defineAppConfig({
  ui: {
    primary: 'cyan',
    gray: 'cool',
    notifications: {
      // Show toasts at the top right of the screen
      position: 'top-1 inset-x-0 mx-auto bottom-auto'
    }
  }
});
