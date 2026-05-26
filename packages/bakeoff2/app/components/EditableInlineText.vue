<template>
  <div class="inline-edit">
    <button
      v-if="!isEditing"
      type="button"
      class="text-button"
      :class="{ 'text-button-empty': !modelValue }"
      @click="startEditing"
    >
      {{ modelValue || placeholder || 'Click to edit' }}
    </button>

    <div v-else class="edit-row">
      <input
        ref="inputRef"
        v-model="draft"
        type="text"
        class="text-input"
        @keydown.enter.prevent="save"
        @keydown.esc.prevent="cancel"
        @blur="save"
      >
      <button type="button" class="mini-btn" @mousedown.prevent @click="save">Save</button>
      <button type="button" class="mini-btn mini-btn-ghost" @mousedown.prevent @click="cancel">
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const isEditing = ref(false);
const draft = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

function startEditing() {
  isEditing.value = true;
  draft.value = props.modelValue;
  nextTick(() => {
    inputRef.value?.focus();
    inputRef.value?.select();
  });
}

function save() {
  emit('update:modelValue', draft.value.trim());
  isEditing.value = false;
}

function cancel() {
  isEditing.value = false;
  draft.value = '';
}
</script>

<style scoped>
.inline-edit {
  display: inline-flex;
  min-width: 0;
}

.text-button {
  border: 0;
  padding: 0;
  margin: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: text;
  font: inherit;
}

.text-button-empty {
  color: #94a3b8;
  font-style: italic;
}

.edit-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.4rem;
  align-items: center;
}

.text-input {
  border: 1px solid #93c5fd;
  border-radius: 0.45rem;
  padding: 0.3rem 0.5rem;
  font: inherit;
  min-width: 14rem;
}

.mini-btn {
  border: 1px solid #93c5fd;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 0.45rem;
  padding: 0.3rem 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.mini-btn-ghost {
  border-color: #cbd5e1;
  background: #fff;
  color: #334155;
}
</style>
