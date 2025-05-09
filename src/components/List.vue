<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  add: {
    type: String
  },
  fields: {},
  delete: {},
  to: {
    type: String
  }
});

const search = ref('');
let params = ref({});
const columnWidths = ref({});

function init() {
  if (props.add) params.value.add = props.add;
  if (props.delete) params.value.delete = props.delete;
  if (props.to) params.value.to = props.to;

  let f = props.fields || (props.items.length ? Object.keys(props.items[0]) : []);
  params.value.fields = Array.isArray(f)
      ? f.map(e => typeof e === 'string' ? { key: e, value: e } : { key: e.key, value: e.value || e.key, type:e.type || 'text' })
      : Object.entries(f).map(([k, v]) => ({ key: k, value: v.value || v || k, type:v.type || 'text' }));
}

init();

const filteredItems = computed(() => {
  if (!search.value) return props.items;
  return props.items.filter(item =>
      Object.values(item).some(val =>
          String(val).toLowerCase().includes(search.value.toLowerCase())
      )
  );
});

function startResize(colKey, event) {
  const startX = event.clientX;
  const startWidth = columnWidths.value[colKey] || 150;

  const onMouseMove = (e) => {
    const newWidth = startWidth + (e.clientX - startX);
    columnWidths.value[colKey] = Math.max(newWidth, 60); // მინიმუმ 60px
  };

  const onMouseUp = () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
}
</script>

<template>
  <v-card>
    <v-toolbar density="compact">
      <v-btn v-if="params.add" :to="params.add" icon="mdi-plus" />
      <v-spacer />
      <v-text-field
          v-model="search"
          append-inner-icon="mdi-magnify"
          density="compact"
          label="ძებნა"
          variant="solo"
          hide-details
          single-line
      />
    </v-toolbar>

    <v-list>
      <!-- Header -->
      <v-list-item elevation="1">
        <div class="d-flex flex-row">
          <div
              class="column-header flex-1-1 ma-2"
              v-for="col in params.fields"
              :key="col.key"
              :style="col.type=='img'?{maxWidth:'50px'}:{ width: (columnWidths[col.key] || 150) + 'px' }"
          >
            {{ col.value }}
            <span class="resizer" v-if="col.type!='img'" @mousedown="startResize(col.key, $event)"></span>
          </div>
        </div>
        <template v-slot:append v-if="params.delete">
          <v-btn icon="mdi-config" size="sm" variant="text"/>
        </template>
      </v-list-item>

      <!-- Rows -->
      <v-list-item
          elevation="1"
          v-for="(item, index) in filteredItems"
          :key="item.id ?? index"
          :to="params.to ? (params.to + '/' + item.id) : false"
          link
      >
        <div class="d-flex flex-row">
          <div
              v-for="col in params.fields"
              :key="col.key"
              class="text-left row-cell flex-1-1 ma-2"
              :style="col.type=='img'?{maxWidth:'50px'}:{ width: (columnWidths[col.key] || 150) + 'px' }"
          >
            <template v-if="col.type=='img'">
              <v-avatar style="position: absolute; margin: -6px;" :image="item[col.key]"></v-avatar>
            </template>
            <template v-else> {{ item[col.key] }}</template>

          </div>
        </div>
        <template v-slot:append v-if="params.delete">
          <v-btn icon="mdi-delete" @click="params.delete(item.id)" size="sm" variant="text"/>
        </template>
      </v-list-item>
    </v-list>

    <div v-if="!filteredItems.length" class="empty-message">
      ჩანაწერები არ მოიძებნა
    </div>
  </v-card>
</template>

<style scoped>
.empty-message {
  text-align: center;
  color: #777;
  padding: 16px;
  font-style: italic;
}

.column-header {
  display: flex;
  align-items: center;
  position: relative;
  user-select: none;
}

.resizer {
  width: 5px;
  height: 100%;
  cursor: col-resize;
  position: absolute;
  background: #2c3e50;
  right: 0;
  top: 0;
  z-index: 1;
}

.row-cell {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-right: 8px;
}
</style>
