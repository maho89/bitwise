// pages/stock/service.js
import { ref, inject } from 'vue'
import useProductService from '../product/service'
import useWarehouseService from '../warehouse/service'

const items = ref([])
const loaded = ref(false)

const useStockService = () => {
    const $http = inject('$http')
    const { items: products, load: loadProducts } = useProductService()
    const { items: warehouses, load: loadWarehouses } = useWarehouseService()

    const load = async () => {
        await Promise.all([
            loadProducts(),
            loadWarehouses()
        ])

        const stockRes = await $http.get('Stock/GetStock')
        items.value = stockRes.data
        loaded.value = true
    }

    const getProductName = (productId) => {
        const p = products.value.find(p => p.id === productId)
        return p?.name || `#${productId}`
    }

    const getWarehouseName = (warehouseId) => {
        const w = warehouses.value.find(w => w.id === warehouseId)
        return w?.name || `#${warehouseId}`
    }

    return {
        items,
        loaded,
        load,
        getProductName,
        getWarehouseName
    }
}

export default useStockService
