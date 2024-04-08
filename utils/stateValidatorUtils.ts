// 'array': 這個大部分是指放在多選選單的值，不驗證值本身，只會驗證陣列相關的規則
// 'array-object': 這個是陣列包物件，除了會驗證陣列相關的規則外，也會驗證裡面的物件
// 'array-primitive': 這個是陣列包基本型別，除了會驗證陣列相關的規則外，也會驗證裡面的值

const validatorCoreConfig = {
  $dirty: false,
  $invalid: false,
  $pending: false,
  $message: ''
};

export { validatorCoreConfig };
