<script lang="ts" setup>
const props = defineProps({
  modalContent: {
    type: String,
    default: ''
  },
  buttonText: {
    type: String,
    default: '確定'
  },
  buttonColor: {
    type: String,
    default: 'primary'
  },
  // 透過按鈕傳遞參數
  params: {
    type: Object,
    default: () => ({})
  }
});
const emit = defineEmits(['confirm', 'cancel']);

function onConfirm() {
  emit('confirm', props.params);
}
function onCancel() {
  emit('cancel', props.params);
}
</script>
<template>
  <UModal prevent-close>
    <UCard>
      <p>{{ modalContent }}</p>
      <template #footer>
        <div class="flex flex-row justify-end gap-x-2">
          <UButton @click="onCancel" color="gray" variant="ghost">
            取消
          </UButton>
          <UButton :color="buttonColor" @click="onConfirm">
            {{ buttonText }}
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
