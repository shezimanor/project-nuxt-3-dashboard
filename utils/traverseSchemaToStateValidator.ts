const validatorCoreConfig = {
  $dirty: false,
  $invalid: false,
  $pending: false,
  $message: ''
};

// 'array': 這個大部分是指放在多選選單的值，不驗證值本身，只會驗證陣列相關的規則
// 'array-object': 這個是陣列包物件，除了會驗證陣列相關的規則外，也會驗證裡面的物件
// 'array-primitive': 這個是陣列包基本型別，除了會驗證陣列相關的規則外，也會驗證裡面的值

/**
 * 遞迴傳入 model 和 schema 物件，並輸出 stateValidator
 *
 * @description 遞迴傳入 model 和 schema 物件，並輸出 stateValidator(用於處理 `array-object` 和 `array-primitive`)
 * @param {any} model 被遞迴 model
 * @param {Object} obj 被遞迴 schema object
 * @returns {Object} stateValidator
 */
function traverseSchemaToStateValidatorWithModel(
  model: any,
  obj: Record<string, any>
): any {
  // 檢查 obj 是否為 object 類型
  if (obj.type === 'object' && obj.properties) {
    const result: { [key: string]: any } = {};
    // 遍歷 properties 中的每個屬性
    for (const key in obj.properties) {
      // 遞歸調用 traverseSchemaToStateValidatorWithModel 函數來處理每個子屬性
      result[key] = traverseSchemaToStateValidatorWithModel(
        model[key],
        obj.properties[key]
      );
    }
    return result;
  }
  // 處理 array 類型
  else if (obj.type === 'array' && obj.items) {
    // 如果 items 底下是 object 類型
    if (obj.items.type === 'object' && obj.items.properties) {
      return {
        ...JSON.parse(JSON.stringify(validatorCoreConfig)),
        $model: model,
        $type: 'array-object',
        // $rules: getRulesFn(obj.rules), // 陣列的 rules
        $eachState: model.map((itemModel: any) =>
          traverseSchemaToStateValidatorWithModel(itemModel, obj.items)
        )
      };
    }
    // 如果 items 底下非 object 類型
    else {
      return {
        ...JSON.parse(JSON.stringify(validatorCoreConfig)),
        $model: model,
        $type: obj.items.type
        // $rules: getRulesFn(obj.items.rules)
      };
    }
  }
  // 如果不是 object 或 array 類型
  else {
    return {
      ...JSON.parse(JSON.stringify(validatorCoreConfig)),
      $model: model,
      $type: obj.type
      // $rules: getRulesFn(obj.rules)
    };
  }
}

/**
 * 遞迴傳入的 shcema 物件，並輸出規則結構
 *
 * @description 遞迴傳入的 shcema 物件，並輸出規則結構(只適用於 `array-object` 和 `array-primitive`)
 * @param {Object} obj 被遞迴 schema object
 * @returns {Object} 規則結構
 */
function getEachRuleStructure(obj: Record<string, any>): any {
  // 檢查 obj 是否為 object 類型
  if (obj.type === 'object' && obj.properties) {
    const result: { [key: string]: any } = {};
    // 遍歷 properties 中的每個屬性
    for (const key in obj.properties) {
      // 遞歸調用 traverseSchemaToStateValidator 函數來處理每個子屬性
      result[key] = getEachRuleStructure(obj.properties[key]);
    }
    return result;
  }
  // 處理 array 類型
  else if (obj.type === 'array' && obj.items) {
    // 如果 items 底下是 object 類型，則遞歸調用 getEachRuleStructure 函數
    if (obj.items.type === 'object' && obj.items.properties) {
      return {
        $type: 'array-object',
        $rules: getRulesFn(obj.rules), // 陣列的 rules
        $eachRule: getEachRuleStructure(obj.items) // 繼續往下渲染
      };
    }
    // 如果 items 底下非 object 類型，則直接回傳 default 值
    else {
      return {
        $type: 'array-primitive',
        $rules: getRulesFn(obj.rules), // 陣列的 rules
        $eachRulePrimitive: getEachRuleStructure(obj.items) // 繼續往下渲染
      };
    }
  }
  // 如果不是 object 或 array 類型，則返回 default 值
  else {
    return {
      $type: obj.type,
      $rules: getRulesFn(obj.rules)
    };
  }
}

/**
 * 遞迴整個 shcema 物件，並輸出 stateValidator
 *
 * @description 用於遞迴整個 shcema 物件，並輸出 stateValidator
 * @param {Object} obj 被遞迴 schema object
 * @returns {Object} stateValidator
 */
export default function traverseSchemaToStateValidator(
  obj: Record<string, any>
): any {
  // 檢查 obj 是否為 object 類型
  if (obj.type === 'object' && obj.properties) {
    // 先假設物件不需要 validatorCoreConfig
    // const result: { [key: string]: any } = {
    //   ...JSON.parse(JSON.stringify(validatorCoreConfig))
    // };
    const result: { [key: string]: any } = {};
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
      ) {
        const newModel = deepClone(obj.default);
        return {
          ...JSON.parse(JSON.stringify(validatorCoreConfig)),
          $model: newModel,
          $type: 'array-object',
          // $rules: getRulesFn(obj.rules), // 陣列的 rules
          $eachState: newModel.map((itemModel: any) =>
            traverseSchemaToStateValidatorWithModel(itemModel, obj.items)
          )
          // $eachRule: getEachRuleStructure(obj.items) // 僅存放規則
        };
      }
      // 無 default 值，直接回傳空陣列
      else {
        return {
          ...JSON.parse(JSON.stringify(validatorCoreConfig)),
          $model: [],
          $type: 'array-object',
          // $rules: getRulesFn(obj.rules), // 陣列的 rules
          $eachState: []
          // $eachRule: getEachRuleStructure(obj.items) // 僅存放規則
        };
      }
    }
    // 如果 items 底下非 object 類型，則直接回傳 default 值
    else {
      // 有 default 值，繼續往下渲染
      if (
        obj.hasOwnProperty('default') &&
        Array.isArray(obj.default) &&
        obj.default.length > 0
      ) {
        const newModel = deepClone(obj.default);

        return {
          ...JSON.parse(JSON.stringify(validatorCoreConfig)),
          $model: newModel,
          $type: 'array-primitive',
          // $rules: getRulesFn(obj.rules), // 陣列的 rules
          $eachState: obj.default.map((itemModel: any) =>
            traverseSchemaToStateValidatorWithModel(itemModel, obj.items)
          )
          // $eachRulePrimitive: getEachRuleStructure(obj.items) // 僅存放規則
        };
      }
      // 無 default 值，直接回傳空陣列
      else {
        return {
          ...JSON.parse(JSON.stringify(validatorCoreConfig)),
          $model: [],
          $type: 'array-primitive',
          // $rules: getRulesFn(obj.rules), // 陣列的 rules
          $eachState: []
          // $eachRulePrimitive: getEachRuleStructure(obj.items) // 繼續往下渲染
        };
      }
    }
  }
  // 如果不是 object 或 array 類型，則返回 default 值
  else {
    return obj.hasOwnProperty('default')
      ? Array.isArray(obj.default)
        ? {
            ...JSON.parse(JSON.stringify(validatorCoreConfig)),
            $model: deepClone(obj.default),
            $type: obj.type
            // $rules: getRulesFn(obj.rules)
          }
        : {
            ...JSON.parse(JSON.stringify(validatorCoreConfig)),
            $model: obj.default,
            $type: obj.type
            // $rules: getRulesFn(obj.rules)
          }
      : {
          ...JSON.parse(JSON.stringify(validatorCoreConfig)),
          $model: getTypeDefault(obj.type),
          $type: obj.type
          // $rules: getRulesFn(obj.rules)
        };
  }
}
