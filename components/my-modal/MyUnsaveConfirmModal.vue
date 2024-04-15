<script lang="ts" setup>
const emit = defineEmits(['confirm', 'cancel']);

function onConfirm() {
  emit('confirm');
}
function onCancel() {
  emit('cancel');
}
</script>
<template>
  <UModal prevent-close>
    <UCard>
      <p>表單尚未儲存，確定要離開嗎？</p>
      <template #footer>
        <div class="flex flex-row justify-end gap-x-2">
          <UButton @click="onCancel" color="gray" variant="outline">
            取消
          </UButton>
          <UButton @click="onConfirm"> 確定 </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>
