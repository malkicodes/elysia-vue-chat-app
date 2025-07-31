<script setup lang="ts">
import { useMessageStore } from '@/stores/message'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import MessageDisplay from './components/MessageDisplay.vue'
import MessageInput from './components/MessageInput.vue'

const message = useMessageStore()

const messageContainer = ref<HTMLDivElement>()

onMounted(() => {
    message.open()
})

onBeforeUnmount(() => {
    message.close()
})
</script>

<template>
    <div
        class="w-screen h-screen flex items-center justify-center font-mono text-xl dark:bg-black dark:text-white"
    >
        <div class="flex flex-col w-max border-2 border-black dark:border-white rounded-lg">
            <header>
                <hgroup class="flex justify-between items-baseline px-4 p-2">
                    <h1 class="font-bold">Simple Chat App</h1>
                </hgroup>
            </header>
            <main class="flex flex-col w-max border-t-2 border-black dark:border-white">
                <div id="message-container" ref="messageContainer">
                    <MessageDisplay v-for="(m, i) in message.messages" :key="i" :message="m" />
                </div>
                <MessageInput />
            </main>
        </div>
    </div>
</template>

<style>
#message-container {
    @apply flex flex-col w-[min(64rem,100vw)] justify-end-safe h-128 overflow-y-scroll border-b-2 border-black p-4 mt-auto mb-0;
}

a {
    @apply underline!;
}
</style>
