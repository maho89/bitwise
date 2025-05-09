import {inject, ref} from "vue";
import loading from "@/view/Loading.vue";
const loaded = ref(false);
const paymentMethods = ref([]);
const saleStatuses = ref([]);

const useSaleService = () => {
    const $http = inject('$http')
    const loadPaymentMethods = async () => {
        const res = await $http.get('Sales/GetPaymentTypes')
        paymentMethods.value = res.data;
    }

    const loadSaleStatuses = async () => {
        const res = await $http.get('Sales/GetSaleStatuses')
        saleStatuses.value = res.data
    }
    const  load = async () => {
        await loadPaymentMethods();
        await loadSaleStatuses();
        loaded.value = true
    }

    return {
        load,
        loaded,
        paymentMethods,
        saleStatuses
    }
}
export default  useSaleService