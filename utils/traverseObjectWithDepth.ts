/**
 * 遞迴整個物件，並回傳物件深度
 *
 * @description 用於遞迴整個物件讀取深度
 * @param {Object} obj 被遞迴的物件
 * @param {string} parentKey 父層的 key
 * @param {number} depth 遞迴深度計數器
 * @returns {number} 深度計數
 */
export default function traverseObjectWithDepth(
  obj: Record<string, any>,
  parentKey = '',
  depth = 0
): number {
  let maxDepth = depth;

  // check if obj is not a object
  if (typeof obj !== 'object' || obj === null) return maxDepth;

  // traverse object
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let fullKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (Array.isArray(obj[key])) {
          obj[key].forEach((item: any, index: number) => {
            maxDepth = Math.max(
              maxDepth,
              traverseObjectWithDepth(item, `${fullKey}[${index}]`, depth + 1)
            );
          });
        } else {
          maxDepth = Math.max(
            maxDepth,
            traverseObjectWithDepth(obj[key], fullKey, depth + 1)
          );
        }
      }
    }
  }

  return maxDepth;
}
