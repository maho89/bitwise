import vuetify from './vuetify'
import router from './router'
import Http from '@/Http.js'
import { ref } from 'vue'

export default {
    install(app) {
        app.config.globalProperties.$menuOpen = ref(false)

        app.config.globalProperties.toggleTheme = () => {
            const current = vuetify.theme.global.name.value
            const next = current === 'light' ? 'dark' : 'light'
            vuetify.theme.global.name.value = next
            localStorage.setItem('theme', next)
        }


        app.use(vuetify).use(router).use(Http)
    }
}
