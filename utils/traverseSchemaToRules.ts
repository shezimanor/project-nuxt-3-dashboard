import {
  decimal,
  email,
  integer,
  maxLength,
  maxValue,
  minLength,
  minValue,
  required,
  sameAs,
  url
} from '@vuelidate/validators';
import isEmptyObject from './isEmptyObject';

// 定義一個映射，將規則名稱映射到對應的驗證器函數
const vuelidateValidatorsMap: Record<string, any> = {
  email,
  decimal,
  integer,
  maxLength,
  maxValue,
  minLength,
  minValue,
  required,
  sameAs,
  url
};

function isNoParamValidator(ruleKey: string) {
  switch (ruleKey) {
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

/**
 * 遞迴整個 shcema 物件，並輸出 rules 結構
 *
 * @description 用於遞迴整個 shcema 物件，並輸出  rules 結構
 * @param {Object} obj 被遞迴 schema object
 * @returns {Object} rules
 */
export default function traverseSchemaToRules(obj: Record<string, any>): any {
  // 檢查 obj 是否為 object 類型
  if (obj.type === 'object' && obj.properties) {
    // Add index signature to the result object
    const result: { [key: string]: any } = {};
    // 遍歷 properties 中的每個屬性
    for (const key in obj.properties) {
      // 遞歸調用 traverseSchemaToRules 函數來處理每個子屬性
      result[key] = traverseSchemaToRules(obj.properties[key]);
    }
    return result;
  }
  // 處理 array 類型
  else if (obj.type === 'array' && obj.items) {
    // 如果 items 底下是 object 類型，則遞歸調用 traverseSchemaToRules 函數
    if (obj.items.type === 'object') {
      // ...obj.rules 不用管 rules 是 undefined 或空物件
      return { ...obj.rules, $eachItem: traverseSchemaToRules(obj.items) };
    }
  }
  // 如果不是 object 或 array 結構類型，則返回 default 值
  else {
    return obj.hasOwnProperty('rules') && !isEmptyObject(obj.rules)
      ? Object.keys(obj.rules).reduce((acc: Record<string, any>, ruleKey) => {
          // 檢查規則是否在 vuelidateValidatorsMap 中
          const validatorFn = vuelidateValidatorsMap[ruleKey];
          if (validatorFn) {
            acc[ruleKey] = isNoParamValidator(ruleKey)
              ? validatorFn
              : validatorFn(obj.rules[ruleKey]);
          }
          return acc;
        }, {})
      : {};
  }
}
