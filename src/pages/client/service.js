// pages/client/service.js
import {ref, inject, onMounted} from 'vue'

const items = ref([])
const types = ref([])
const loaded = ref(false)

const useClientService = () => {

    const $http = inject('$http')
    const load = async () => {
        const [clientsRes, typesRes] = await Promise.all([
            $http.get('Clients/GetClients'),
            $http.get('Clients/GetClientTypes')
        ])
        items.value = clientsRes.data
        types.value = typesRes?.data || []
        loaded.value = true
    }

    const getById = (id) => items.value.find(c => c.id == id)

    const getTypeName = (typeId) => {
        const type = types.value.find(t => t.id == typeId)
        return type?.name || 'უცნობია'
    }

    const displayName = (id) => {
        const client = getById(id)
        return client?.name || `#${id}`
    }

    const save = async (data) => {
        await $http.post('Clients/SaveClient', data)
        await load()
    }

    return {
        items,
        types,
        loaded,
        load,
        getById,
        getTypeName,
        displayName,
        save
    }
}
export default useClientService
