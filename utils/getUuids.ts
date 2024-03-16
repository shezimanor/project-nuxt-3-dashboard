import { v4 as uuid } from 'uuid';
export default function getUuids(length: number): string[] {
  // 建立一個空陣列
  let arr = [];

  // 使用循環來填充陣列
  for (let i = 0; i < length; i++) {
    // 將 uuid 加入到陣列中
    arr.push(uuid());
  }

  return arr;
}
