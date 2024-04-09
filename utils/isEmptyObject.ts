export default function isEmptyObject(obj: Record<string, any>): boolean {
  // 判別空物件
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}
