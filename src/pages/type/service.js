// pages/type/service.js
import {ref, inject, onMounted} from 'vue'

const items = ref([])
const loaded = ref(false)

const useTypeService = () => {
    const $http = inject('$http')

    const load = async () => {
        const res = await $http.get('ProductTypes/GetProductTypes')
        items.value = res.data
        loaded.value = true
    }

    const getById = (id) => items.value.find(t => t.id == id)

    const displayName = (id) => {
        const t = getById(id)
        return t ? t.name : `#${id}`
    }

    const save = async (data) => {
        await $http.post('ProductTypes/SaveProductType', data)
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

// პირველივე იმპორტისას ავტო-დატვირთვა
onMounted(() => load())

export default useTypeService
