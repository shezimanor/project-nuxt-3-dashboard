<script lang="ts" setup>
// 有別於物件排版元件，這個「陣列排版元件」就會直接對 rootState 進行操作
import { useMySchemaStore } from '~/stores/mySchemaStore';
const mySchemaStore = useMySchemaStore();

// props
const props = defineProps({
  schema: {
    type: Object,
    default: null
  },
  state: {
    type: Object,
    required: true
  },
  paths: {
    type: Array,
    default: () => []
  }
});
console.log('props state', props.state);
</script>

<template>
  <div class="flex flex-col">
    <!-- <h3>Form Layout Array</h3> -->
    <UPageCard
      v-show="mySchemaStore.state.testMode"
      title="Form Layout Array"
      description="陣列排版元件：底下渲染各個 items"
      icon="i-heroicons-rectangle-stack-20-solid"
    />
    <div
      v-for="(item, index) in state"
      :key="`layout_arr_${index}`"
      class="flex flex-col p-4 pr-0 pb-4"
      :class="{ 'gap-y-4': mySchemaStore.state.testMode }"
    >
      <div>
        <UBadge
          v-show="mySchemaStore.state.testMode"
          color="amber"
          variant="outline"
          :ui="{ base: 'grow-0' }"
          >Index: {{ index }}</UBadge
        >
      </div>
      <MySchemaFormItem
        :schema="schema.items"
        :state="state[index]"
        :paths="paths.concat(`${index}`)"
      />
    </div>
  </div>
</template>

<style scoped></style>
