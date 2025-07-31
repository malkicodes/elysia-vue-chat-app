<script setup lang="ts">
import { useMessageStore } from '@/stores/message'
import { ref } from 'vue'

const message = useMessageStore()

const content = ref('')
const loading = ref(false)

function handleInputMessage(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
    }
}

function handleSendMessage() {
    if (content.value.length === 0) return

    loading.value = true

    message.sendMessage(content.value)
    content.value = ''

    loading.value = false
}
</script>

<template>
    <div class="flex gap-4 m-4">
        <input
            class="w-full border border-black dark:border-white px-2 placeholder:text-black/50 dark:placeholder:text-white/50 rounded outline-offset-2 bg-transparent"
            v-model="content"
            placeholder="Type here..."
            maxlength="1024"
            @keydown="handleInputMessage"
        />
        <button
            @click="handleSendMessage"
            :disabled="loading || content.length <= 0"
            class="border disabled:opacity-50 border-black dark:border-white px-2 placeholder:text-black/50 dark:placeholder:text-white/50 rounded transition-opacity"
        >
            Send
        </button>
    </div>
</template>
