export const useValidator = (state: any, rawSchema: any, schema: any) => {
  const rules = traverseSchemaToRules(rawSchema);
  const stateValidator = reactive(traverseSchemaToStateValidator(schema));
  // TODO: 觸發驗證器

  // update state
  function updateState(paths: any, newValue: any) {
    // 使用 reduce 方法來找到最深層的父物件，但停止在最後一個路徑之前
    // 當遇到陣列的時候 path item會是 `'i'`, i === 整數
    const lastKeyIndex = paths.length - 1;
    const lastParent = getStateByPaths(state, paths, lastKeyIndex);
    const currentRuleValidator = getRulesByPaths(rules, paths, paths.length);
    let result = true;
    for (const key in currentRuleValidator) {
      if (!currentRuleValidator[key].$validator(newValue)) {
        result = false;
        console.log('key:', key);
        console.log(
          'msg:',
          currentRuleValidator[key].$message({
            $params: currentRuleValidator[key].$params,
            $model: newValue
          })
        );
        break;
      }
    }

    // 更新最後一個鍵的值
    lastParent[paths[lastKeyIndex]] = newValue;
  }
  // 新增項目
  function addArrayState(paths: any, newValue: any) {
    // 使用 reduce 方法來找到最深層的父物件，但停止在最後一個路徑之前
    // 當遇到陣列包物件的時候 path item會是 "[0]"
    const lastKeyIndex = paths.length - 1;
    const lastParent = getStateByPaths(state, paths, lastKeyIndex);

    // 使用陣列 push 做新增
    const newArray = deepClone(lastParent[paths[lastKeyIndex]]);
    newArray.push(newValue);
    lastParent[paths[lastKeyIndex]] = newArray;
  }
  // 刪除項目
  function removeArrayState(paths: any, arrayIndex: number) {
    // 使用 reduce 方法來找到最深層的父物件，但停止在最後一個路徑之前
    // 當遇到陣列包物件的時候 path item會是 "[0]"
    const lastKeyIndex = paths.length - 1;
    const lastParent = getStateByPaths(state, paths, lastKeyIndex);

    // 將項目移除
    const newArray = deepClone(lastParent[paths[lastKeyIndex]]);
    newArray.splice(arrayIndex, 1);
    lastParent[paths[lastKeyIndex]] = newArray;
  }
  // 移動項目
  function moveArrayState(paths: any, fromIndex: number, toIndex: number) {
    // 使用 reduce 方法來找到最深層的父物件，但停止在最後一個路徑之前
    // 當遇到陣列包物件的時候 path item會是 "[0]"
    const lastKeyIndex = paths.length - 1;
    const lastParent = getStateByPaths(state, paths, lastKeyIndex);

    // 移動項目
    const newArray = deepClone(lastParent[paths[lastKeyIndex]]);
    const [removedItem] = newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, removedItem);
    lastParent[paths[lastKeyIndex]] = newArray;
  }
  // 刪除所有項目
  function clearArrayState(paths: any) {
    // 使用 reduce 方法來找到最深層的父物件，但停止在最後一個路徑之前
    // 當遇到陣列包物件的時候 path item會是 "[0]"
    const lastKeyIndex = paths.length - 1;
    const lastParent = getStateByPaths(state, paths, lastKeyIndex);

    // 使用陣列清空
    lastParent[paths[lastKeyIndex]] = [];
  }

  // watch(state, () => {
  //   console.log('State Watcher Trigger');
  // });

  return {
    // state
    stateValidator,
    rules, // 每個 rules 有 $validator fn 可以執行
    // action
    updateState,
    addArrayState,
    removeArrayState,
    moveArrayState,
    clearArrayState
  };
};
