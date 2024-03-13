/**
 * 深層拷貝物件
 *
 * @param {Object} obj 要被複製的物件
 * @returns {Object} 新的物件
 */
export default function deepClone(obj: Record<string, any>): any {
  if (obj === null) return null;
  if (typeof obj !== 'object') return obj;

  if (obj instanceof Array) {
    const copy: any[] = [];
    obj.forEach((elem: any) => {
      copy.push(deepClone(elem));
    });
    return copy;
  }

  if (obj instanceof Object) {
    const copy: { [key: string]: any } = {};
    for (const attr in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, attr)) {
        copy[attr] = deepClone(obj[attr]);
      }
    }
    return copy;
  }

  throw new Error('無法複製，內含不支援的類型');
}
