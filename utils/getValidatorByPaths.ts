/**
 * 取得指定層數的 validator
 *
 * @param {Object} validator
 * @param {Array} paths
 * @param {number} lastKeyIndex 最後一個 key 的 index
 * @returns {Object} state
 */
export default function getValidatorByPaths(
  validator: Record<string, any>,
  paths: unknown[],
  lastKeyIndex: number
): any {
  return paths
    .slice(0, lastKeyIndex)
    .reduce((parentValidator: any, currentKey: any) => {
      if (!isValidArrayPath(currentKey)) return parentValidator[currentKey];
      else return parentValidator[Number(currentKey)];
    }, validator);
}
