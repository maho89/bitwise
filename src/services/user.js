// services/user.js
import { ref, inject } from 'vue'

const user = ref(null)
const loaded = ref(false)

const useUserService = () => {
    const $http = inject('$http')

    const init = async () => {
        try {
            const res = await $http.get('User/Init')
            user.value = res
        } catch {
            user.value = false
        } finally {
            loaded.value = true
        }
    }

    const login = async (credentials) => {
        const res = await $http.post('User/Authenticate', credentials)
        if (res.code === 0) {
            localStorage.setItem('token', res.sessionToken)
            location.reload()
        }
        return res
    }

    const logout = async () => {
        await $http.post('User/Logout')
        localStorage.removeItem('token')
        user.value = null
    }

    const isLoggedIn = () => !!user.value
    const hasRole = (role) => user.value?.role === role

    return {
        user,
        loaded,
        init,
        login,
        logout,
        isLoggedIn,
        hasRole
    }
}

export default useUserService
