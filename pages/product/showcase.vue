<script lang="ts" setup>
const productState = ref({
  basicData: {
    title: '旋轉立方體Demo1',
    description: '這是一個旋轉立方體的Demo'
  },
  prototypeData: {
    loop: true,
    direction: 'vertical',
    buttonText: '立即購買',
    buttonColor: 'orange',
    slides: [
      {
        title: '白色運動鞋',
        description: '',
        image: 'white.webp',
        url: 'https://www.example.com/shoes/1'
      },
      {
        title: '棕色登山鞋',
        description: '復刻經典',
        image: 'brown.webp',
        url: 'https://www.example.com/shoes/2'
      },
      {
        title: '象牙色球鞋',
        description: '環保材質 | 限量發售',
        image: 'ivory.webp',
        url: 'https://www.example.com/shoes/3'
      },
      {
        title: '紅色籃球鞋',
        description: 'NBA球星最愛',
        image: 'red.webp',
        url: 'https://www.example.com/shoes/4'
      },
      {
        title: '黃色籃球鞋',
        description: '購物狂歡節限定款',
        image: 'yellow.webp',
        url: 'https://www.example.com/shoes/5'
      }
      // {
      //   title: '黑色休閒鞋',
      //   description: '輕巧材質 | 好穿耐磨',
      //   image: 'black.webp',
      //   url: 'https://www.example.com/shoes/6'
      // }
    ]
  }
});
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel id="productEdit" grow>
      <UDashboardNavbar title="產品展示">
        <template #right>
          <UColorModeToggle />
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent class="flex items-center justify-center">
        <MyPrototypeSwiper :product-state="productState" />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped></style>
