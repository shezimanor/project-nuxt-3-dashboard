export const usePreview = () => {
  const toast = useToast();

  function onCTA(url: string = '', id: number = 0) {
    toast.add({
      id: `cta_${id}`,
      icon: 'i-heroicons-arrow-top-right-on-square-solid',
      color: 'blue',
      title: '[模擬跳轉]',
      description: `外連網址: ${url}`,
      timeout: 1200
    });
  }

  return { onCTA };
};
