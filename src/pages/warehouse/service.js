// pages/warehouse/service.js
import {ref, inject, onMounted} from 'vue'

const items = ref([])
const loaded = ref(false)

const useWarehouseService = () => {
    const $http = inject('$http')

    const load = async () => {
        const res = await $http.get('Warehouses/GetWarehouses')
        items.value = res.data
        loaded.value = true
    }

    const getById = (id) => {
        return items.value.find(w => w.id == id)
    }

    const displayName = (id) => {
        const w = getById(id)
        return w ? w.name : `#${id}`
    }

    const save = async (data) => {
        await $http.post('Warehouses/SaveWarehouse', data)
        await load()
    }

    return {
        items,
        loaded,
        load,
        getById,
        displayName,
        save
    }
}

onMounted(() => load())

export default useWarehouseService
