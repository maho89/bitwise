<script setup>
import {ref, computed, watch, onMounted, nextTick} from "vue";

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
};
const filter = {
  search: ref(''),
  filteredItems: computed(() => {
    if (!filter.search.value) return props.items;
    return props.items.filter(item =>
        Object.values(item).some(val =>
            String(val).toLowerCase().includes(filter.search.value.toLowerCase())
        )
    );
  }),
};
const pagination = {
  itemsPerPage: ref(10),
  currentPage: ref(1),

  pageCount: computed(() =>
      Math.ceil(filter.filteredItems.value.length / pagination.itemsPerPage.value)
  ),

  pagedItems: computed(() => {
    const start = (pagination.currentPage.value - 1) * pagination.itemsPerPage.value;
    return filter.filteredItems.value.slice(start, start + pagination.itemsPerPage.value);
  })
};
const displayItems = computed(() => pagination.pagedItems.value);
let bodyRef = ref(null)

watch(columnWidths, (val) => {
  localStorage.setItem('columnWidths', JSON.stringify(val));
}, { deep: true });
onMounted(() => {
  const saved = localStorage.getItem('columnWidths');
  if (saved) columnWidths.value = JSON.parse(saved);
  nextTick(()=>{
    if (bodyRef.value && bodyRef.value.clientHeight){
      pagination.itemsPerPage.value = Math.ceil((bodyRef.value.clientHeight) / 48);
    }
  })


});

</script>

<template>
  <v-card  class="d-flex flex-column fill-height">
    <v-toolbar density="compact">
      <v-btn v-if="params.add" :to="params.add" icon="mdi-plus" />
      <v-spacer />
      <v-text-field
          v-model="filter.search.value"
          append-inner-icon="mdi-magnify"
          density="compact"
          label="ძებნა"
          variant="solo"
          hide-details
          single-line
      />
    </v-toolbar>
    <v-list class="d-flex flex-column fill-height pa-0">
      <!-- Header -->
      <div>
        <v-list-item elevation="1" >
          <div class="d-flex flex-row">
            <div
                class="column-header flex-1-1 ma-2"
                v-for="col in params.fields"
                :key="col.key"
                :style="col.type == 'img' ? { maxWidth: '50px' } : { width: (columnWidths[col.key] || 150) + 'px' }"
            >
              {{ col.value }}
              <span class="resizer" v-if="col.type != 'img'" @mousedown="startResize(col.key, $event)"></span>
            </div>
          </div>
          <template v-slot:append v-if="params.delete">
            <v-btn icon="mdi-config" size="sm" variant="text" />
          </template>
        </v-list-item>
      </div>
      <!-- Rows - scrollable -->
      <div class="flex-grow-1 overflow-y-auto scrollable" ref="bodyRef">
        <v-list-item
            v-for="(item, index) in displayItems"
            :key="item.id ?? index"
            :to="params.to ? (params.to + '/' + item.id) : false"
            link
            elevation="1"
        >
          <div class="d-flex flex-row">
            <div
                v-for="col in params.fields"
                :key="col.key"
                class="text-left row-cell flex-1-1 ma-2"
                :style="col.type == 'img' ? { maxWidth: '50px' } : { width: (columnWidths[col.key] || 150) + 'px' }"
            >
              <template v-if="col.type == 'img'">
                <v-avatar style="position: absolute; margin: -6px;" :image="item[col.key]" />
              </template>
              <template v-else>
                {{ item[col.key] }}
              </template>
            </div>
          </div>
          <template v-slot:append v-if="params.delete">
            <v-btn icon="mdi-delete" @click="params.delete(item.id)" size="sm" variant="text" />
          </template>
        </v-list-item>
      </div>
      <!-- Footer -->
      <div>


            <v-pagination
                v-model="pagination.currentPage.value"
                :length="pagination.pageCount.value"
                size="small"
            />

      </div>

    </v-list>
    <div v-if="!displayItems.length" class="empty-message">
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
}
.scrollable{
  flex: 1 1 260px;
}
.row-cell {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-right: 8px;
}
</style>
