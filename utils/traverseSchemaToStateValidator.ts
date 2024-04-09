/**
 * 遞迴整個 shcema 物件，並輸出 stateValidator
 *
 * @description 用於遞迴整個 shcema 物件，並輸出 stateValidator
 * @param {Object} obj 被遞迴 schema object
 * @returns {Object} stateValidator
 */
export default function traverseSchemaToStateValidator(
  obj: Record<string, any>,
  path: string = ''
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
      result[key] = traverseSchemaToStateValidator(
        obj.properties[key],
        `${path === '' ? '' : `${path}.`}${key}`
      );
    }
    return result;
  }
  // 處理 array 類型
  else if (obj.type === 'array' && obj.items) {
    // 如果 items 底下是 object 類型，則遞歸調用 traverseSchemaToStateValidator 函數
    if (obj.items.type === 'object' && obj.items.properties) {
      // 有 default 值，繼續往下渲染
      if (
        Object.prototype.hasOwnProperty.call(obj, 'default') &&
        Array.isArray(obj.default) &&
        obj.default.length > 0
      ) {
        const newModel = deepClone(obj.default);
        return {
          ...JSON.parse(JSON.stringify(validatorCoreConfig)),
          $type: 'array-object',
          $path: path,
          $rules: getRulesFn(obj.rules), // 陣列的 rules
          $model: newModel,
          $eachState: newModel.map((itemModel: any, index: number) =>
            traverseSchemaToStateValidatorWithModel(
              itemModel,
              obj.items,
              `${path === '' ? '' : `${path}.`}${index}`
            )
          )
        };
      }
      // 無 default 值，直接回傳空陣列
      else {
        return {
          ...JSON.parse(JSON.stringify(validatorCoreConfig)),
          $type: 'array-object',
          $path: path,
          $rules: getRulesFn(obj.rules), // 陣列的 rules
          $model: [],
          $eachState: []
        };
      }
    }
    // 如果 items 底下非 object 類型，則直接回傳 default 值
    else {
      // 有 default 值，繼續往下渲染
      if (
        Object.prototype.hasOwnProperty.call(obj, 'default') &&
        Array.isArray(obj.default) &&
        obj.default.length > 0
      ) {
        const newModel = deepClone(obj.default);

        return {
          ...JSON.parse(JSON.stringify(validatorCoreConfig)),
          $type: 'array-primitive',
          $path: path,
          $rules: getRulesFn(obj.rules), // 陣列的 rules
          $model: newModel,
          $eachState: obj.default.map((itemModel: any, index: number) =>
            traverseSchemaToStateValidatorWithModel(
              itemModel,
              obj.items,
              `${path === '' ? '' : `${path}.`}${index}`
            )
          )
        };
      }
      // 無 default 值，直接回傳空陣列
      else {
        return {
          ...JSON.parse(JSON.stringify(validatorCoreConfig)),
          $type: 'array-primitive',
          $path: path,
          $rules: getRulesFn(obj.rules), // 陣列的 rules
          $model: [],
          $eachState: []
        };
      }
    }
  }
  // 如果不是 object 或 array 類型，則返回 default 值
  else {
    return Object.prototype.hasOwnProperty.call(obj, 'default')
      ? Array.isArray(obj.default)
        ? {
            ...JSON.parse(JSON.stringify(validatorCoreConfig)),
            $type: obj.type,
            $path: path,
            $rules: getRulesFn(obj.rules),
            $model: deepClone(obj.default)
          }
        : {
            ...JSON.parse(JSON.stringify(validatorCoreConfig)),
            $type: obj.type,
            $path: path,
            $rules: getRulesFn(obj.rules),
            $model: obj.default
          }
      : {
          ...JSON.parse(JSON.stringify(validatorCoreConfig)),
          $type: obj.type,
          $path: path,
          $rules: getRulesFn(obj.rules),
          $model: getTypeDefault(obj.type)
        };
  }
}
