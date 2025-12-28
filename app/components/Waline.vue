<script setup lang="ts">
import { onMounted } from 'vue'
import { useHead } from '#imports'

const props = defineProps<{
	path: string
	title?: string
}>()

const serverURL = 'https://waline-home-v5.zsxcoder.top'

// 添加 Waline CSS
useHead({
	link: [
		{
			rel: 'stylesheet',
			href: 'https://unpkg.com/@waline/client@v3/dist/waline.css',
		},
	],
})

async function initWaline() {
	const container = document.querySelector('#waline-container')
	if (!container) return

	// 从 CDN 动态导入 Waline
	const { init } = await import('https://unpkg.com/@waline/client@v3/dist/waline.js')

	init({
		el: '#waline-container',
		serverURL,
		path: props.path,
		lang: 'zh-CN',
		dark: 'html.dark',
		emoji: [
			'//unpkg.com/@waline/emojis@1.2.0/weibo',
			'//unpkg.com/@waline/emojis@1.2.0/bilibili',
			'//unpkg.com/@waline/emojis@1.2.0/qq',
		],
		meta: ['nick', 'mail', 'link'],
		requiredMeta: ['nick'],
		reaction: true,
		pageview: true,
		imageUploader: false,
	})
}

onMounted(() => {
	initWaline()
})
</script>

<template>
	<div id="waline-container" class="waline-container" />
</template>

<style>
/* Waline 容器 */
#waline-container {
	margin-top: 2rem;
	margin-bottom: 2rem;
}

/* Waline 深色模式适配 */
:root {
	--waline-white: var(--c-bg-1);
	--waline-light-grey: var(--c-border);
	--waline-dark-grey: var(--c-text-2);
	--waline-theme-color: var(--c-primary);
	--waline-active-color: var(--c-primary);
	--waline-text-color: var(--c-text);
	--waline-bg-color: var(--c-bg-2);
	--waline-border-color: var(--c-border);
}

:global(.dark) :root {
	--waline-white: var(--c-bg-1);
	--waline-light-grey: var(--c-border);
	--waline-dark-grey: var(--c-text-2);
	--waline-theme-color: var(--c-primary);
	--waline-active-color: var(--c-primary);
	--waline-text-color: var(--c-text);
	--waline-bg-color: var(--c-bg-2);
	--waline-border-color: var(--c-border);
}

/* 覆盖 Waline 默认样式 */
.wl {
	font-family: inherit;
}

.wl-card {
	background: var(--c-bg-2) !important;
	border: 1px solid var(--c-border) !important;
	border-radius: 12px;
}

.wl-header {
	border-bottom: 1px solid var(--c-border) !important;
}

.wl-editor {
	background: var(--c-bg-1) !important;
	color: var(--c-text) !important;
	border-color: var(--c-border) !important;
}

.wl-textarea {
	background: var(--c-bg-1) !important;
	color: var(--c-text) !important;
	border-color: var(--c-border) !important;
}

.wl-textarea:focus {
	border-color: var(--c-primary) !important;
}

.wl-btn {
	background: var(--c-primary) !important;
	color: white !important;
	border: none !important;
}

.wl-btn:hover {
	opacity: 0.9 !important;
}

.wl-content {
	color: var(--c-text) !important;
}

.wl-meta {
	color: var(--c-text-2) !important;
}

.wl-emoji-popup {
	background: var(--c-bg-1) !important;
	border-color: var(--c-border) !important;
}

.wl-reaction {
	background: var(--c-bg-1) !important;
	border: 1px solid var(--c-border) !important;
}
</style>
