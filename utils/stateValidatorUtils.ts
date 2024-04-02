// 'array': 這個大部分是指放在多選選單的值，不驗證值本身，只會驗證陣列相關的規則
// 'array-object': 這個是陣列包物件，除了會驗證陣列相關的規則外，也會驗證裡面的物件
// 'array-primitive': 這個是陣列包基本型別，除了會驗證陣列相關的規則外，也會驗證裡面的值

const validatorCoreConfig = {
  $dirty: false,
  $invalid: false,
  $pending: false,
  $message: ''
};

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

export { traverseSchemaToStateValidatorWithModel, validatorCoreConfig };
