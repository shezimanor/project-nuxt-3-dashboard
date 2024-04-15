export const usePreview = () => {
  const toast = useToast();

  function onCTA(index: number = 0, url: string = '') {
    toast.add({
      id: `swiper_cta_${index}`,
      icon: 'i-heroicons-arrow-top-right-on-square-solid',
      color: 'blue',
      title: '[模擬跳轉]',
      description: `外連網址: ${url}`,
      timeout: 1200
    });
  }

  return { onCTA };
};
