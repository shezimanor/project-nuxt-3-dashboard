import getTypeDefault from './getTypeDefault';

// 🔆 請注意這個版本的 items 底下不能接 `type: object` 以外的結構

/**
 * 遞迴整個 shcema 物件，並輸出 state
 *
 * @description 用於遞迴整個 shcema 物件，並輸出 state
 * @param {Object} obj 被遞迴 schema object
 * @returns {Object} state
 */
export default function traverseSchemaToState(obj: any): any {
  // 檢查 obj 是否為 object 類型
  if (obj.type === 'object' && obj.properties) {
    // Add index signature to the result object
    const result: { [key: string]: any } = {};
    // 遍歷 properties 中的每個屬性
    for (const key in obj.properties) {
      // 遞歸調用 traverseSchemaToState 函數來處理每個子屬性
      result[key] = traverseSchemaToState(obj.properties[key]);
    }
    return result;
  }
  // 處理 array 類型
  else if (obj.type === 'array' && obj.items) {
    // 如果 items 底下是 object 類型，則遞歸調用 traverseSchemaToState 函數
    if (obj.items.type === 'object') {
      return [traverseSchemaToState(obj.items)];
    } else {
      // items 底下"不是" object 類型，就是錯誤的寫法
    }
  }
  // 如果不是 object 或 array 類型，則返回 default 值
  else {
    return obj.hasOwnProperty('default')
      ? obj.default
      : getTypeDefault(obj.type);
  }
}
