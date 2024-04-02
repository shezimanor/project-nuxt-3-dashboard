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
  // minLength, = minItems 但他的邏輯 array.length === 0，會通過驗證，所以不用
  minValue,
  required,
  url
} from '@vuelidate/validators';

// 自定義的驗證器
// helpers.withParams: https://vuelidate-next.netlify.app/custom_validators.html#passing-extra-properties-to-validators
const sameAs = (key: string, label: string) =>
  helpers.withParams(
    { key, label },
    // 下面這個函數的參數是被 `useValidator.ts` 的 currentRulesObj[ruleKey].$validator(newValue, lastParent) 決定
    (value: any, lastParent: any) => lastParent[key] === value
  );
const minLength = (min: number) =>
  helpers.withParams(
    { min },
    // 下面這個函數的參數是被 `useValidator.ts` 的 currentRulesObj[ruleKey].$validator(newValue, lastParent) 決定
    (value: any) => value.length >= min
  );

// 定義一個映射，將規則名稱映射到對應的驗證器函數
// 撰寫新的驗證器時，請按照目前的格式與順序撰寫，只有字串的排最前面，有參數的放在後面
// List of helpers: https://vuelidate-next.netlify.app/custom_validators.html#list-of-helpers
// Custom error messages: https://vuelidate-next.netlify.app/custom_validators.html#custom-error-messages
const vuelidateValidatorsMap: Record<string, any> = {
  alpha: helpers.withMessage('僅接受英文字母', alpha),
  alphaNum: helpers.withMessage('僅接受英數', alphaNum),
  decimal: helpers.withMessage('必須為數字', decimal),
  email: helpers.withMessage('email 格式錯誤', email),
  integer: helpers.withMessage('必須為整數', integer),
  required: helpers.withMessage('此欄位必填', required),
  url: helpers.withMessage('網址格式錯誤', url),
  // schema 寫法: between: [min, max]: 由 function getRulesFn 決定了寫法
  between: (min: number, max: number) =>
    helpers.withMessage(
      ({ $params }) => `數值必須介於${$params.min}和${$params.max}之間`,
      between(min, max)
    ),
  maxValue: (params: number) =>
    helpers.withMessage(
      ({ $params }) => `數值超過${$params.max}`,
      maxValue(params)
    ),
  minValue: (params: number) =>
    helpers.withMessage(
      ({ $params }) => `數值未達${$params.min}`,
      minValue(params)
    ),
  // 📣 目前只有這個驗證規則會用到 lastParent
  sameAs: (key: string, label: string) =>
    helpers.withMessage(
      ({ $params }) => `值必須和「${$params.label}」一樣`,
      sameAs(key, label)
    ),
  // array, string 都可以檢查
  maxLength: (params: number) =>
    helpers.withMessage(
      ({ $params, $model }) =>
        typeof $model === 'string'
          ? `文字長度超過${$params.max}個字`
          : `數量超過${$params.max}個`,
      maxLength(params)
    ),
  // array, string 都可以檢查
  minLength: (params: number) =>
    helpers.withMessage(
      ({ $params, $model }) =>
        typeof $model === 'string'
          ? `文字長度未達${$params.min}個字`
          : `數量未達${$params.min}個`,
      minLength(params)
    )
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

/**
 * 觸發驗證後，針對每種驗證訊息做不同的處理
 *
 * @description 因為觸發驗證後，每種驗證器使用的 $message 結構不同，所以要針對不同的驗證器做不同的處理，可以參考物件 `vuelidateValidatorsMap` 和函數 `isNoParamValidator`
 * @param {string} ruleKey 驗證器名稱
 * @param {any} currentRuleValidator 驗證器
 * @param {any} model 被驗證的值
 * @returns {string} 驗證訊息
 */
function getValidationMessage({
  ruleKey,
  currentRuleValidator,
  model
}: {
  ruleKey: string;
  currentRuleValidator: any;
  model: any;
}): string {
  if (isNoParamValidator(ruleKey)) return currentRuleValidator.$message;
  else {
    // 這邊的 $message 是一個 function，雖然部分驗證器的 $message 用不到 $model 但是為了統一，這邊都傳入
    return currentRuleValidator.$message({
      $params: currentRuleValidator.$params,
      $model: model
    });
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
        : ruleKey === 'sameAs'
        ? validatorFn(rulesObj[ruleKey]['key'], rulesObj[ruleKey]['label'])
        : validatorFn(rulesObj[ruleKey]);
    }
    return acc;
  }, {});
}

export { getRulesFn, getValidationMessage };
