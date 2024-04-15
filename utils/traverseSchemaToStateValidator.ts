/**
 * 遞迴整個 shcema 物件，並輸出 stateValidator
 *
 * @description 用於遞迴整個 shcema 物件，並輸出 stateValidator
 * @param {Object} obj 被遞迴 schema object
 * @param {Object} stateObj 被遞迴 state object(把 state 的資料給 stateValidator 做 $model 的參考, 以達自動更新)
 * @returns {Object} stateValidator
 */
export default function traverseSchemaToStateValidator(
  obj: Record<string, any>,
  state: Record<string, any>,
  path: string = ''
): any {
  // 檢查 obj 是否為 object 類型
  if (obj.type === 'object' && obj.properties) {
    const result: { [key: string]: any } = {
      $type: 'object',
      $path: path,
      $dirty: false,
      $properties: {}
    };
    // 遍歷 properties 中的每個屬性
    for (const key in obj.properties) {
      // 遞歸調用 traverseSchemaToStateValidator 函數來處理每個子屬性
      result['$properties'][key] = traverseSchemaToStateValidator(
        obj.properties[key],
        state,
        `${path === '' ? '' : `${path}.`}${key}`
      );
    }
    return result;
  }
  // 處理 array 類型
  else if (obj.type === 'array' && obj.items) {
    // 如果 items 底下是 object 類型
    if (obj.items.type === 'object' && obj.items.properties) {
      const currentModel = getStateByPaths(
        state,
        path.split('.'),
        path.split('.').length
      );
      return {
        ...JSON.parse(JSON.stringify(validatorCoreConfig)),
        $type: 'array-object',
        $path: path,
        $rules: getRulesFn(obj.rules), // 陣列的 rules
        $model: currentModel,
        $eachState: currentModel.map((itemModel: any, index: number) =>
          traverseSchemaToStateValidatorWithModel(
            itemModel,
            obj.items,
            `${path === '' ? '' : `${path}.`}${index}`
          )
        )
      };
    }
    // 如果 items 底下非 object 類型
    else {
      const currentModel = getStateByPaths(
        state,
        path.split('.'),
        path.split('.').length
      );
      return {
        ...JSON.parse(JSON.stringify(validatorCoreConfig)),
        $type: 'array-primitive',
        $path: path,
        $rules: getRulesFn(obj.rules), // 陣列的 rules
        $model: currentModel,
        $eachState: currentModel.map((itemModel: any, index: number) =>
          traverseSchemaToStateValidatorWithModel(
            itemModel,
            obj.items,
            `${path === '' ? '' : `${path}.`}${index}`
          )
        )
      };
    }
  }
  // 如果不是 object 或 array 類型
  else {
    const currentModel = getStateByPaths(
      state,
      path.split('.'),
      path.split('.').length
    );
    return {
      ...JSON.parse(JSON.stringify(validatorCoreConfig)),
      $type: obj.type,
      $path: path,
      $rules: getRulesFn(obj.rules),
      $model: currentModel
    };
  }
}
