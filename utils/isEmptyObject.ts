export default function isEmptyObject(obj: any): boolean {
  // 判別空物件
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}
