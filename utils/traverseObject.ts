/**
 * 遞迴整個物件
 *
 * @description 用於遞迴整個物件，並輸出基礎型別的 key、type、value
 * @param {Object} obj 被遞迴的物件
 * @param {string} parentKey 父層的 key
 * @returns {void}
 */
export default function traverseObject(
  obj: Record<string, any>,
  parentKey = ''
) {
  // check if obj is not a object
  if (typeof obj !== 'object' || obj === null) {
    console.log(`Key: ${parentKey}, Type: ${typeof obj}, Value: ${obj}`);
    return;
  }
  // traverse object
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let fullKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (Array.isArray(obj[key])) {
          console.log(
            // `Key: ${fullKey}, Type: array, Value: ${JSON.stringify(obj[key])}`
            `Key: ${fullKey}, Type: array`
          );
          obj[key].forEach((item: any, index: number) => {
            traverseObject(item, `${fullKey}[${index}]`);
          });
        } else {
          console.log(
            // `Key: ${fullKey}, Type: object, Value: ${JSON.stringify(obj[key])}`
            `Key: ${fullKey}, Type: Object`
          );
          traverseObject(obj[key], fullKey);
        }
      } else {
        console.log(
          `Key: ${fullKey}, Type: ${typeof obj[key]}, Value: ${obj[key]}`
        );
      }
    }
  }
}
