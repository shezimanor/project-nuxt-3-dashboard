// TODO: 閒置待處理
const validatorCoreConfig = {
  $dirty: false,
  $invalid: false,
  $pending: false
};

// 'array': 這個大部分是指放在多選選單的值，不驗證值本身，只會驗證陣列相關的規則
// 'array-object': 這個是陣列包物件，除了會驗證陣列相關的規則外，也會驗證裡面的物件
// 'array-primitive': 這個是陣列包基本型別，除了會驗證陣列相關的規則外，也會驗證裡面的值

import {
  alpha,
  alphaNum,
  between,
  decimal,
  email,
  helpers,
  integer,
  maxLength,
  maxValue,
  minLength,
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

function getRulesFn(rulesObj: Record<string, any>): any {
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

/**
 * 遞迴整個 shcema 物件，並輸出 state
 *
 * @description 用於遞迴整個 shcema 物件，並輸出 state
 * @param {Object} obj 被遞迴 schema object
 * @returns {Object} state
 */
export default function traverseSchemaToStateValidator(
  obj: Record<string, any>
): any {
  // 檢查 obj 是否為 object 類型
  if (obj.type === 'object' && obj.properties) {
    // Add index signature to the result object
    const result: { [key: string]: any } = {
      ...JSON.parse(JSON.stringify(validatorCoreConfig))
    };
    // 遍歷 properties 中的每個屬性
    for (const key in obj.properties) {
      // 遞歸調用 traverseSchemaToStateValidator 函數來處理每個子屬性
      result[key] = traverseSchemaToStateValidator(obj.properties[key]);
    }
    return result;
  }
  // 處理 array 類型
  else if (obj.type === 'array' && obj.items) {
    // 如果 items 底下是 object 類型，則遞歸調用 traverseSchemaToStateValidator 函數
    if (obj.items.type === 'object' && obj.items.properties) {
      // 有 default 值，繼續往下渲染
      if (
        obj.hasOwnProperty('default') &&
        Array.isArray(obj.default) &&
        obj.default.length > 0
      )
        return {
          ...JSON.parse(JSON.stringify(validatorCoreConfig)),
          $type: 'array-object',
          $model: deepClone(obj.default),
          $rules: getRulesFn(obj.rules), // 陣列的 rules
          $each: [traverseSchemaToStateValidator(obj.items)] // 繼續往下渲染
        };
      // return [traverseSchemaToStateValidator(obj.items)];
      // 無 default 值，直接回傳空陣列
      else
        return {
          ...JSON.parse(JSON.stringify(validatorCoreConfig)),
          $type: 'array-object',
          $model: [],
          $rules: getRulesFn(obj.rules), // 陣列的 rules
          $each: [traverseSchemaToStateValidator(obj.items)] // 繼續往下渲染
        };
    }
    // 如果 items 底下非 object 類型，則直接回傳 default 值
    else {
      // 有 default 值，繼續往下渲染
      if (
        obj.hasOwnProperty('default') &&
        Array.isArray(obj.default) &&
        obj.default.length > 0
      )
        return {
          ...JSON.parse(JSON.stringify(validatorCoreConfig)),
          $type: 'array-primitive',
          $model: deepClone(obj.default),
          $rules: getRulesFn(obj.rules), // 陣列的 rules
          $each: [traverseSchemaToStateValidator(obj.items)] // 繼續往下渲染
        };
      // 無 default 值，直接回傳空陣列
      else
        return {
          ...JSON.parse(JSON.stringify(validatorCoreConfig)),
          $type: 'array-primitive',
          $model: [],
          $rules: getRulesFn(obj.rules), // 陣列的 rules
          $each: [traverseSchemaToStateValidator(obj.items)] // 繼續往下渲染
        };
    }
  }
  // 如果不是 object 或 array 類型，則返回 default 值
  else {
    return obj.hasOwnProperty('default')
      ? Array.isArray(obj.default)
        ? {
            ...JSON.parse(JSON.stringify(validatorCoreConfig)),
            $type: obj.type,
            $model: deepClone(obj.default),
            $rules: getRulesFn(obj.rules)
          }
        : {
            ...JSON.parse(JSON.stringify(validatorCoreConfig)),
            $type: obj.type,
            $model: obj.default,
            $rules: getRulesFn(obj.rules)
          }
      : {
          ...JSON.parse(JSON.stringify(validatorCoreConfig)),
          $type: obj.type,
          $model: getTypeDefault(obj.type),
          $rules: getRulesFn(obj.rules)
        };
  }
}
