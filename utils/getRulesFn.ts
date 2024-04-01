import {
  alpha,
  alphaNum,
  between,
  decimal,
  email,
  helpers,
  integer,
  maxLength, // = maxItems
  maxValue,
  minLength, // = minItems
  minValue,
  required,
  // sameAs, // 這邊自己寫
  url
} from '@vuelidate/validators';
// 定義一個映射，將規則名稱映射到對應的驗證器函數
// List of helpers: https://vuelidate-next.netlify.app/custom_validators.html#list-of-helpers
// Custom error messages: https://vuelidate-next.netlify.app/custom_validators.html#custom-error-messages
// Accessing property parent object: https://vuelidate-next.netlify.app/custom_validators.html#accessing-property-parent-object
const vuelidateValidatorsMap: Record<string, any> = {
  alpha: helpers.withMessage('僅接受英文字母', alpha),
  alphaNum: helpers.withMessage('僅接受英數', alphaNum),
  // schema 寫法: between: [min, max]
  between: (min: number, max: number) =>
    helpers.withMessage(
      ({ $params }) => `數值必須介於${$params.min}和${$params.max}之間`,
      between(min, max)
    ),
  decimal: helpers.withMessage('必須為數字', decimal),
  email: helpers.withMessage('email 格式錯誤', email),
  integer: helpers.withMessage('必須為整數', integer),
  // array, string 都可以檢查
  maxLength: (params: number) =>
    helpers.withMessage(
      ({ $params, $model }) =>
        typeof $model === 'string'
          ? `文字長度超過${$params.max}個字`
          : `數量超過${$params.max}個`,
      maxLength(params)
    ),
  maxValue: (params: number) =>
    helpers.withMessage(
      ({ $params }) => `數值超過${$params.max}`,
      maxValue(params)
    ),
  // array, string 都可以檢查
  minLength: (params: number) =>
    helpers.withMessage(
      ({ $params, $model }) =>
        typeof $model === 'string'
          ? `文字長度未達${$params.min}個字`
          : `數量未達${$params.min}個`,
      minLength(params)
    ),
  minValue: (params: number) =>
    helpers.withMessage(
      ({ $params }) => `數值未達${$params.min}`,
      minValue(params)
    ),
  required: helpers.withMessage('此欄位必填', required),
  sameAs: (propertyName: string) =>
    helpers.withMessage(
      '值必須相同',
      (value, lastParent) => lastParent[propertyName] === value
    ),
  url: helpers.withMessage('網址格式錯誤', url)
};

function isNoParamValidator(ruleKey: string) {
  switch (ruleKey) {
    case 'alpha':
    case 'alphaNum':
    case 'email':
    case 'decimal':
    case 'integer':
    case 'required':
    case 'url':
      return true;
    default:
      return false;
  }
}

export default function getRulesFn(rulesObj: Record<string, any>): any {
  if (!rulesObj || isEmptyObject(rulesObj)) return {};
  return Object.keys(rulesObj).reduce((acc: Record<string, any>, ruleKey) => {
    // 檢查規則是否在 vuelidateValidatorsMap 中
    const validatorFn = vuelidateValidatorsMap[ruleKey];
    if (validatorFn) {
      acc[ruleKey] = isNoParamValidator(ruleKey)
        ? validatorFn
        : ruleKey === 'between'
        ? validatorFn(rulesObj[ruleKey][0], rulesObj[ruleKey][1])
        : validatorFn(rulesObj[ruleKey]);
    }
    return acc;
  }, {});
}
