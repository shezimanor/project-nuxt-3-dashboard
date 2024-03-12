import { defineStore } from 'pinia';
const configDefault = {
  testMode: false
};

export const useMySchemaStore = defineStore('mySchemaStore', () => {
  const state = useLocalStorage('my-schema-config', configDefault);

  function updateTestMode(newValue: boolean) {
    console.log('newValue', newValue);
    state.value.testMode = newValue;
  }

  return {
    // State
    state,
    // Getter
    // Action
    updateTestMode
  };
});
