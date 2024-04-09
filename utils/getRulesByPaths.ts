/**
 * 取得指定層數的 Rules
 *
 * @param {Object} rules
 * @param {Array} paths
 * @param {number} lastKeyIndex 最後一個 key 的 index
 * @returns {Object} rules
 */
export default function getRulesByPaths(
  rules: Record<string, any>,
  paths: unknown[],
  lastKeyIndex: number
): any {
  return paths
    .slice(0, lastKeyIndex)
    .reduce((parentRule: any, currentKey: any) => {
      if (!isValidArrayPath(currentKey)) return parentRule[currentKey];
      else if (
        Object.prototype.hasOwnProperty.call(parentRule, '$eachPrimitive')
      )
        return parentRule['$eachPrimitive'];
      else return parentRule['$each'];
    }, rules);
}
