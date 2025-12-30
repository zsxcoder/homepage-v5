<script setup lang="ts">
const appConfig = useAppConfig()
const route = useRoute()
const router = useRouter()
const colorMode = useColorMode()

// 外链跳转配置
const safegoConfig = {
	enableBase64Encode: true,
	countdowntime: 4,
	enableDarkMode: 'auto',
	title: appConfig.title,
	subtitle: appConfig.subtitle,
	avatar: appConfig.author.avatar,
}

const targetUrl = ref('')
const countdown = ref(safegoConfig.countdowntime)
const canAutoRedirect = ref(safegoConfig.countdowntime >= 0)
const redirectTimer = ref<NodeJS.Timeout | null>(null)

// 使用 Nuxt 的 colorMode 来判断暗黑模式
const isDarkMode = computed(() => {
	if (safegoConfig.enableDarkMode === 'auto') {
		return colorMode.value === 'dark'
	}
	return safegoConfig.enableDarkMode === true
})

// 解码 URL
function decodeUrl(encodedUrl: string): string {
	try {
		// Base64 URL 安全解码
		const base64 = encodedUrl.replace(/-/g, '+').replace(/_/g, '/')
		const decoded = atob(base64)
		return decodeURIComponent(decoded.split('').map(c =>
			`%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`,
		).join(''))
	}
	catch {
		// 如果解码失败，返回原始 URL
		return encodedUrl
	}
}

// 跳转到目标 URL
function redirectToTarget() {
	// 清除倒计时计时器
	if (redirectTimer.value) {
		clearInterval(redirectTimer.value)
		redirectTimer.value = null
	}

	if (targetUrl.value) {
		// 使用 location.replace 替代 href，避免浏览器阻止跳转
		window.location.replace(targetUrl.value)
	}
}

// 取消跳转
function cancelRedirect() {
	canAutoRedirect.value = false
	countdown.value = -1
	if (redirectTimer.value) {
		clearInterval(redirectTimer.value)
		redirectTimer.value = null
	}
}

// 尝试关闭当前标签页
function closeTab() {
	try {
		window.close()
	}
	catch {
		// 如果无法关闭（如用户手动打开的标签页），则跳转到首页
		router.push('/')
	}
}

// 初始化
onMounted(() => {
	const urlParam = route.query.u as string
	if (!urlParam) {
		alert('缺少目标链接参数')
		return
	}

	// 解码 URL
	targetUrl.value = safegoConfig.enableBase64Encode ? decodeUrl(urlParam) : urlParam

	// 启动倒计时
	if (canAutoRedirect.value) {
		redirectTimer.value = setInterval(() => {
			if (canAutoRedirect.value && countdown.value > 0) {
				countdown.value--
				if (countdown.value <= 0) {
					clearInterval(redirectTimer.value!)
					redirectToTarget()
				}
			}
			else {
				// 如果已取消，清除计时器
				if (redirectTimer.value) {
					clearInterval(redirectTimer.value)
					redirectTimer.value = null
				}
			}
		}, 1000)
	}
})

// 组件卸载时清除计时器
onBeforeUnmount(() => {
	if (redirectTimer.value) {
		clearInterval(redirectTimer.value)
		redirectTimer.value = null
	}
})

useSeoMeta({
	title: `${safegoConfig.title} - ${safegoConfig.subtitle}`,
	ogTitle: safegoConfig.title,
	description: `您即将跳转到 ${targetUrl.value}`,
})
</script>

<template>
	<div :class="['go-page', { dark: isDarkMode }]">
		<div class="container">
			<div class="content">
				<div class="avatar">
					<NuxtImg :src="safegoConfig.avatar" :alt="safegoConfig.title" />
				</div>

				<h1 class="title">{{ safegoConfig.title }}</h1>
				<h2 class="subtitle">{{ safegoConfig.subtitle }}</h2>

				<div class="message">
					<p>您即将离开本站，跳转到：</p>
					<div class="target-url">{{ targetUrl }}</div>
				</div>

				<div v-if="canAutoRedirect && countdown > 0" class="countdown">
					<p>⚡ 将在 <span class="countdown-number">{{ countdown }}</span> 秒后自动跳转，请自行确认链接安全性</p>
				</div>

				<div v-if="!canAutoRedirect && countdown < 0" class="cancelled-message">
					<p>✅ 跳转已取消</p>
				</div>

				<div class="actions">
					<button v-if="canAutoRedirect" class="btn btn-cancel" @click="cancelRedirect">
						取消跳转
					</button>
					<button v-if="!canAutoRedirect && countdown < 0" class="btn btn-close" @click="closeTab">
						关闭此页
					</button>
					<button class="btn btn-go" @click="redirectToTarget">
						{{ canAutoRedirect ? '立即跳转' : '跳转' }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.go-page {
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #333;
	padding: 1rem;
	transition: background 0.3s ease;
}

.go-page.dark {
	background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
	color: #fff;
}

.container {
	max-width: 600px;
	width: 100%;
}

.content {
	background: rgba(255, 255, 255, 0.95);
	backdrop-filter: blur(10px);
	border-radius: 16px;
	padding: 2.5rem 2rem;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
	text-align: center;
	animation: slideUp 0.5s ease-out;
}

.go-page.dark .content {
	background: rgba(30, 30, 50, 0.95);
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

@keyframes slideUp {
	from {
		opacity: 0;
		transform: translateY(30px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.avatar {
	margin-bottom: 1.5rem;
}

.avatar img {
	width: 100px;
	height: 100px;
	border-radius: 50%;
	border: 4px solid rgba(255, 255, 255, 0.5);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	object-fit: cover;
}

.title {
	font-size: 1.75rem;
	font-weight: 700;
	margin: 0 0 0.5rem;
	color: #333;
}

.go-page.dark .title {
	color: #fff;
}

.subtitle {
	font-size: 1rem;
	font-weight: 500;
	margin: 0 0 2rem;
	color: #666;
}

.go-page.dark .subtitle {
	color: #aaa;
}

.message {
	margin-bottom: 1.5rem;
}

.message p {
	font-size: 1rem;
	margin: 0 0 0.75rem;
	color: #666;
}

.go-page.dark .message p {
	color: #aaa;
}

.target-url {
	background: rgba(102, 126, 234, 0.1);
	padding: 0.75rem 1rem;
	border-radius: 8px;
	font-size: 0.9rem;
	word-break: break-all;
	color: #667eea;
	font-family: 'Consolas', 'Monaco', monospace;
}

.go-page.dark .target-url {
	background: rgba(102, 126, 234, 0.2);
	color: #a5b4fc;
}

.countdown {
	margin-bottom: 1.5rem;
}

.countdown p {
	font-size: 0.95rem;
	color: #666;
}

.go-page.dark .countdown p {
	color: #aaa;
}

.countdown-number {
	display: inline-block;
	min-width: 1.5rem;
	font-weight: 700;
	color: #667eea;
}

.go-page.dark .countdown-number {
	color: #a5b4fc;
}

.cancelled-message {
	margin-bottom: 1.5rem;
}

.cancelled-message p {
	font-size: 0.95rem;
	color: #22c55e;
	font-weight: 600;
}

.go-page.dark .cancelled-message p {
	color: #4ade80;
}

.actions {
	display: flex;
	gap: 1rem;
	justify-content: center;
}

.btn {
	padding: 0.75rem 2rem;
	border: none;
	border-radius: 8px;
	font-size: 1rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.3s ease;
}

.btn-cancel,
.btn-close {
	background: rgba(107, 114, 128, 0.1);
	color: #6b7280;
}

.go-page.dark .btn-cancel,
.go-page.dark .btn-close {
	background: rgba(255, 255, 255, 0.1);
	color: #fff;
}

.btn-cancel:hover,
.btn-close:hover {
	background: rgba(107, 114, 128, 0.2);
	transform: translateY(-2px);
}

.btn-go {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
	box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-go:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
}

.btn:active {
	transform: translateY(0);
}

@media (max-width: 480px) {
	.content {
		padding: 2rem 1.5rem;
	}

	.actions {
		flex-direction: column;
	}

	.btn {
		width: 100%;
	}
}
</style>
