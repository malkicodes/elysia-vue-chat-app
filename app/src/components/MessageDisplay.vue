<script setup lang="ts">
import { Event, type ChatEvent } from '@shared/index'
import { onMounted } from 'vue'

defineProps<{
    message: ChatEvent
}>()

const SCROLL_THRESHOLD = 50

onMounted(() => {
    const messageContainer = document.getElementById('message-container')

    if (!messageContainer) return

    const maxScroll = messageContainer.scrollHeight - messageContainer.clientHeight

    if (maxScroll - messageContainer.scrollTop < SCROLL_THRESHOLD) {
        messageContainer.scrollTo({
            top: messageContainer.scrollHeight,
            behavior: 'smooth',
        })
    }
})
</script>

<template>
    <div class="message" v-if="message.event === Event.MESSAGE">
        <p>
            <span>{{ message.userId }}</span
            >: {{ message.content }}
        </p>
    </div>
    <div class="message" v-else>
        <p>
            <span>{{ message.userId }}</span>
            {{ message.event === Event.USER_LEAVE ? 'left the chat.' : 'joined the chat!' }}
        </p>
    </div>
</template>

<style>
.message > p > span {
    @apply font-bold;
}
</style>
