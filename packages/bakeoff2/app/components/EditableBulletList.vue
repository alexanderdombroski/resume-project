<template>
  <ul class="bullet-list">
    <li v-for="bullet in bullets" :key="bullet.id">
      <button
        v-if="editingId !== bullet.id"
        type="button"
        class="bullet-button"
        @click="startEditing(bullet.id, bullet.content)"
      >
        {{ bullet.content }}
      </button>
      <button
        v-if="editingId !== bullet.id"
        type="button"
        class="mini-btn mini-btn-ghost mini-btn-remove"
        @click="removeBullet(bullet.id)"
      >
        -
      </button>

      <div v-else class="bullet-edit-row">
        <input
          :ref="(el) => setInputRef(el, bullet.id)"
          v-model="draft"
          type="text"
          class="bullet-input"
          @keydown.enter.prevent="saveEdit(bullet.id)"
          @keydown.esc.prevent="cancelEdit"
          @blur="saveEdit(bullet.id)"
        />
        <button type="button" class="mini-btn" @mousedown.prevent @click="saveEdit(bullet.id)">
          Save
        </button>
        <button
          type="button"
          class="mini-btn mini-btn-ghost"
          @mousedown.prevent
          @click="cancelEdit"
        >
          Cancel
        </button>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
type BulletPoint = {
  id: number;
  content: string;
};

defineProps<{
  bullets: BulletPoint[];
}>();

const emit = defineEmits<{
  update: [payload: { id: number; content: string }];
  remove: [payload: { id: number }];
}>();

const editingId = ref<number | null>(null);
const draft = ref('');
const inputRefs = new Map<number, HTMLInputElement>();

function setInputRef(el: Element | null, id: number) {
  if (el instanceof HTMLInputElement) {
    inputRefs.set(id, el);
  } else {
    inputRefs.delete(id);
  }
}

function startEditing(id: number, content: string) {
  editingId.value = id;
  draft.value = content;

  nextTick(() => {
    inputRefs.get(id)?.focus();
    inputRefs.get(id)?.select();
  });
}

function saveEdit(id: number) {
  const content = draft.value.trim();
  emit('update', { id, content });
  editingId.value = null;
}

function cancelEdit() {
  editingId.value = null;
  draft.value = '';
}

function removeBullet(id: number) {
  emit('remove', { id });
}
</script>

<style scoped>
.bullet-list {
  margin: 0;
  padding-left: 1.2rem;
  color: #334155;
  display: grid;
  gap: 0.35rem;
}

.bullet-list li {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.5rem;
  align-items: start;
}

.bullet-button {
  border: 0;
  padding: 0.1rem 0;
  margin: 0;
  color: inherit;
  background: transparent;
  text-align: left;
  width: 100%;
  cursor: text;
  font: inherit;
  line-height: 1.4;
}

.bullet-button:hover {
  color: #0f172a;
}

.bullet-edit-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.4rem;
  align-items: center;
}

.bullet-input {
  border: 1px solid #93c5fd;
  border-radius: 0.45rem;
  padding: 0.35rem 0.5rem;
  font: inherit;
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

.mini-btn-remove {
  width: 1.5rem;
  height: 1.5rem;
  min-width: 1.5rem;
  padding: 0;
  border-color: #fecaca;
  color: #b91c1c;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  line-height: 1;
  font-weight: 700;
  align-self: start;
}

.mini-btn-remove:hover {
  background: #fef2f2;
  border-color: #fca5a5;
}
</style>
