/**
 * 遞迴傳入 model 和 schema 物件，並輸出 stateValidator
 *
 * @description 遞迴傳入 model 和 schema 物件，並輸出 stateValidator(用於處理 `array-object` 和 `array-primitive`)
 * @param {any} model 被遞迴 model
 * @param {Object} obj 被遞迴 schema object
 * @returns {Object} stateValidator
 */
export default function traverseSchemaToStateValidatorWithModel(
  model: any,
  obj: Record<string, any>,
  path: string
): any {
  // 檢查 obj 是否為 object 類型
  if (obj.type === 'object' && obj.properties) {
    const result: { [key: string]: any } = {};
    // 遍歷 properties 中的每個屬性
    for (const key in obj.properties) {
      // 遞歸調用 traverseSchemaToStateValidatorWithModel 函數來處理每個子屬性
      result[key] = traverseSchemaToStateValidatorWithModel(
        model[key],
        obj.properties[key],
        `${path}.${key}`
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
        $type: 'array-object',
        $path: path,
        $rules: getRulesFn(obj.rules), // 陣列的 rules
        $model: model,
        $eachState: model.map((itemModel: any, index: number) =>
          traverseSchemaToStateValidatorWithModel(
            itemModel,
            obj.items,
            `${path}.${index}`
          )
        )
      };
    }
    // 如果 items 底下非 object 類型
    else {
      return {
        ...JSON.parse(JSON.stringify(validatorCoreConfig)),
        $type: obj.items.type,
        $path: path,
        $rules: getRulesFn(obj.items.rules),
        $model: model
      };
    }
  }
  // 如果不是 object 或 array 類型
  else {
    return {
      ...JSON.parse(JSON.stringify(validatorCoreConfig)),
      $type: obj.type,
      $path: path,
      $rules: getRulesFn(obj.rules),
      $model: model
    };
  }
}
