import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import { Event, type ChatEvent } from '@shared/index'

export const useMessageStore = defineStore('counter', () => {
    const ws = ref<WebSocket | undefined>(undefined)
    const connected = computed(() => ws.value?.readyState === WebSocket.OPEN)
    const messages = reactive<ChatEvent[]>([])

    const userId = ref<number>(-1)

    function open() {
        const websocket = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL)

        if (!websocket) return

        websocket.addEventListener('message', (e) => {
            const data = JSON.parse(e.data) as ChatEvent

            switch (data.event) {
                case Event.USER_WELCOME:
                    userId.value = data.userId
                    break;
                default:
                    messages.push(data);
            }


            console.log(data)
        })

        websocket.addEventListener('close', close)

        ws.value = websocket
    }

    function close() {
        ws.value?.close()
        userId.value = -1
    }

    function sendMessage(message: string): boolean {
        if (!ws.value) return false

        ws.value.send(message)

        return true
    }

    return { ws, connected, messages, open, close, sendMessage }
})
