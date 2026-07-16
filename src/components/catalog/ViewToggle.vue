<template>
  <div class="view-toggle-wrapper">
    <div class="row items-center q-col-gutter-md">
      <div class="col-12 col-sm-6">
        <q-input
          :model-value="search"
          dense
          outlined
          placeholder="Buscar productos..."
          clearable
          @update:model-value="$emit('update:search', ($event ?? '') as string)"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-6">
        <div class="row justify-end q-gutter-sm view-toggle-buttons">
          <q-btn
            v-for="opt in options"
            :key="opt.value"
            :icon="opt.icon"
            round
            dense
            flat
            size="md"
            :color="viewMode === opt.value ? 'primary' : 'grey-6'"
            :text-color="viewMode === opt.value ? 'white' : 'grey-8'"
            :style="viewMode === opt.value ? 'background: var(--view-btn-bg, #1A2F2B);' : ''"
            @click="$emit('update:viewMode', opt.value)"
          >
            <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 4]">
              {{ opt.tooltip }}
            </q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ViewMode } from './types';

export type { ViewMode };

defineProps<{
  search: string;
  viewMode: ViewMode;
}>();

defineEmits<{
  (e: 'update:search', value: string): void;
  (e: 'update:viewMode', value: ViewMode): void;
}>();

const options: { value: ViewMode; icon: string; tooltip: string }[] = [
  { value: 'small_grid', icon: 'grid_view', tooltip: 'Cuadrícula compacta (2 columnas)' },
  { value: 'large_grid', icon: 'view_stream', tooltip: 'Vista amplia (1 columna)' },
  { value: 'list', icon: 'view_list', tooltip: 'Vista lista' },
];
</script>

<style scoped>
.view-toggle-wrapper {
  position: sticky;
  top: 56px;
  z-index: 20;
  background: #F5EDE0;
  padding: 8px 0;
}

.view-toggle-buttons {
  flex-wrap: nowrap;
}
</style>
