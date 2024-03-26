/**
 * 取得指定層數的 State
 *
 * @param {Object} state
 * @param {Array} paths
 * @param {number} lastKeyIndex 最後一個 key 的 index
 * @returns {Object} state
 */
export default function getStateByPaths(
  state: Record<string, any>,
  paths: string[],
  lastKeyIndex: number
): any {
  return paths
    .slice(0, lastKeyIndex)
    .reduce((parentState: any, currentKey: any) => {
      if (!isValidArrayPath(currentKey)) return parentState[currentKey];
      else return parentState[Number(currentKey)];
    }, state);
}
