/**
 * 取得指定層數的 Schema
 *
 * @param {Object} schema
 * @param {Array} paths
 * @param {number} lastKeyIndex 最後一個 key 的 index
 * @returns {Object} schema
 */
export default function getSchemaByPaths(
  schema: Record<string, any>,
  paths: unknown[],
  lastKeyIndex: number
): any {
  return paths
    .slice(0, lastKeyIndex)
    .reduce((parentSchema: any, currentKey: any) => {
      if (!isValidArrayPath(currentKey))
        return parentSchema['properties'][currentKey];
      else return parentSchema['items'];
    }, schema);
}
