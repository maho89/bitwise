import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
const savedTheme = localStorage.getItem('theme') || 'dark'
export default createVuetify({
    theme: {
        defaultTheme: savedTheme,
    }
})
