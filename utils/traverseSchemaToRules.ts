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
    // ...obj.rules 不用管 rules 是 undefined 或空物件 traverseSchemaToRules(obj.items)
    if (obj.items.type === 'object') {
      return {
        ...getRulesFn(obj.rules),
        $each: traverseSchemaToRules(obj.items)
      };
    } else if (
      obj.items.hasOwnProperty('rules') &&
      !isEmptyObject(obj.items.rules)
    ) {
      return {
        ...getRulesFn(obj.rules),
        $eachPrimitive: getRulesFn(obj.items.rules)
      };
    } else {
      return {
        ...getRulesFn(obj.rules)
      };
    }
  }
  // 如果不是 object 或 array 結構類型，則返回 default 值
  else {
    return Object.prototype.hasOwnProperty.call(obj, 'rules') &&
      !isEmptyObject(obj.rules)
      ? getRulesFn(obj.rules)
      : {};
  }
}
