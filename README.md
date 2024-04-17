# 專案：後台系統模擬

> 使用 [Nuxt3](https://nuxt.com/docs/getting-started/introduction) 建置
>
> 使用 [NuxtUI](https://ui.nuxt.com/) 和付費版 [NuxtUI Pro](https://ui.nuxt.com/pro/pricing) 建置
>
> 紀錄使用 framework 的過程為目標，所以會有很多細微的 commit

## 核心內容

1. 結構化表單的生成(Schema)：依據規範下的 schema ，可生成預期中的表單結構。

2. 結構化表單的驗證器(State Validator)：生成出的表單，會依據 schema 寫定的欄位規則，進行欄位的即時驗證，與送出表單時的全表單驗證。

3. 結構化表單的應用(Prototype to Product)：本站主要模擬的流程，使用者可以選擇產品的原型、產品原型會生成自己的表單、依據需求編輯表單、儲存後便可建立出新的產品。

## 全站流程

- [x] 使用者 -> 開始建立產品 -> 選擇產品原型 -> 編輯產品表單 -> 儲存產品 -> 查看產品結果 -> 至產品列表 -> 進行產品管理

- [ ] 開發者 -> 開發產品原型 -> 建立原型結構化表單(Schema) -> 將原型上架 -> 儲存原型 -> 至原型列表 -> 進行原型管理

## 開發筆記

1. 使用 `vueuse` 要看一下[這裡](https://nuxt.com/modules/vueuse)，把 `@vueuse/core` 和 `@vueuse/nuxt` 直接裝在 `dependencies`。

2. 使用 [Vuelidate](https://vuelidate-next.netlify.app/) 的規則做驗證基礎並進行擴充，並沒有使用他的驗證器。
