import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.config.errorHandler = (error: unknown, instance, info: string): void => {
    console.error('[Vue Error Boundary]', { error, instance, info })

    // Em produção, os erros devem ser enviados para um coletor externo (ex: Sentry)
    // Sentry.captureException(error, { extra: { info } })
}

if (import.meta.env.DEV) {
    app.config.warnHandler = (msg: string, instance, trace: string): void => {
        console.warn('[Vue Dev Warning]', { msg, instance, trace })
    }
}

app.use(createPinia())
app.use(router)

app.mount('#app')
