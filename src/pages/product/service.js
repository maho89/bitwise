// pages/product/service.js
import { ref, inject } from 'vue'

const items = ref([])
const loaded = ref(false)

const useProductService = () => {
    const $http = inject('$http')

    const load = async () => {
        const res = await $http.get('Products/GetProducts')
        items.value = res.data
        loaded.value = true
    }

    const getById = (id) => items.value.find(p => p.id == id)

    const displayName = (id) => {
        const p = getById(id)
        return p?.name || `#${id}`
    }

    const save = async (data) => {
        await $http.post('Products/SaveProduct', data)
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

export default useProductService
