/**
 * 根據傳入型別，給出對應的預設值
 *
 * @description 用來解決沒有預設值的 schema 給出符合型別的預設值
 * @param {string} type 型別
 * @returns {Object} state
 */
export default function getTypeDefault(type: string): any {
  switch (type) {
    case 'string':
      return '';
    case 'boolean':
      return true;
    // 會有 array 出現在這裡，雖然他不是 Primitive
    case 'array':
      return [];
    case 'number':
    default:
      return undefined;
  }
}
