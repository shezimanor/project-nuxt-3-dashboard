export const useValidator = (state: any, rawSchema: any, schema: any) => {
  const rules = traverseSchemaToRules(rawSchema);
  const stateValidator = reactive(traverseSchemaToStateValidator(schema));
  // TODO: 觸發驗證器

  // update state
  function updateState(paths: any, newValue: any) {
    // 使用 reduce 方法來找到最深層的父物件，但停止在最後一個路徑之前
    // 當遇到陣列的時候 path item會是 `'i'`, i === 整數
    const lastKeyIndex = paths.length - 1;
    // 取得父層的 state
    const lastParentState = getStateByPaths(state, paths, lastKeyIndex);
    // 取得當層的驗證器
    const currentStateValidator = getStateValidatorByPaths(
      stateValidator,
      paths,
      paths.length
    );
    // 取得當層的驗證規則
    const currentRulesObj = getRulesByPaths(rules, paths, paths.length);
    let invalidMessage = '';
    // 遍歷所有規則
    for (const ruleKey in currentRulesObj) {
      // 當驗證失敗，取得訊息並中斷遍歷(把 lastParentState 傳入是為了讓"部分"驗證器可以取得其他欄位的值)
      if (!currentRulesObj[ruleKey].$validator(newValue, lastParentState)) {
        invalidMessage = getValidationMessage({
          ruleKey: ruleKey,
          currentRuleValidator: currentRulesObj[ruleKey],
          model: newValue
        });
        break;
      }
    }
    // 更新驗證器的狀態
    currentStateValidator.$dirty = true;
    currentStateValidator.$invalid = false;
    currentStateValidator.$message = '';
    if (invalidMessage.length > 0) {
      currentStateValidator.$invalid = true;
      currentStateValidator.$message = invalidMessage;
    }
    currentStateValidator.$model = newValue;

    // 更新 state
    lastParentState[paths[lastKeyIndex]] = newValue;
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
