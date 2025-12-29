<script setup lang="ts">
// 配置选项
const UserConfig = {
	private_api_url: 'https://fc.mcyzsx.top/',
	page_turning_number: 20,
	error_img: 'https://fastly.jsdelivr.net/gh/willow-god/Friend-Circle-Lite@latest/static/favicon.ico',
}

// 定义数据接口
interface Article {
	author: string
	avatar: string
	title: string
	created: string
	link: string
}

interface StatisticalData {
	friends_num: number
	active_num: number
	article_num: number
	last_updated_time: string
}

interface ApiResponse {
	article_data: Article[]
	statistical_data: StatisticalData
}

// SEO 配置
const appConfig = useAppConfig()
useSeoMeta({
	title: '友链朋友圈',
	ogType: 'profile',
	description: `${appConfig.title}的友链朋友圈页面。`,
})

// 状态管理
const fcircleState = useState('fcircle', () => ({
	allArticles: [] as Article[],
	displayedArticles: [] as Article[],
	stats: {
		friends_num: 0,
		active_num: 0,
		article_num: 0,
		last_updated_time: '',
	},
	start: 0,
	hasMoreArticles: true,
	randomArticle: null as Article | null,
	lastFetchTime: 0,
}))

const loading = computed(() => fcircleState.value.allArticles.length === 0)
const hasMoreArticles = computed(() => fcircleState.value.hasMoreArticles)
const randomArticle = computed(() => fcircleState.value.randomArticle)
const displayedArticles = computed(() => fcircleState.value.displayedArticles)
const stats = computed(() => fcircleState.value.stats)

// 模态框状态
const showModal = ref(false)
const currentAuthor = ref('')
const currentAuthorAvatar = ref('')
const authorOrigin = ref('')
const authorArticles = ref<Article[]>([])

// 加载更多文章
async function loadMoreArticles() {
	const cacheKey = 'friend-circle-lite-cache'
	const cacheTimeKey = 'friend-circle-lite-cache-time'
	const now = Date.now()

	// 检查缓存
	if (process.client && window.localStorage) {
		const cacheTime = window.localStorage.getItem(cacheTimeKey)
		if (cacheTime && (now - Number.parseInt(cacheTime, 10) < 10 * 60 * 1000)) {
			const cachedData = window.localStorage.getItem(cacheKey)
			if (cachedData) {
				const data = JSON.parse(cachedData) as ApiResponse
				processArticles(data)
				return
			}
		}
	}

	try {
		const response = await fetch(`${UserConfig.private_api_url}all.json`)
		const data = await response.json() as ApiResponse

		// 更新缓存
		if (process.client && window.localStorage) {
			window.localStorage.setItem(cacheKey, JSON.stringify(data))
			window.localStorage.setItem(cacheTimeKey, now.toString())
		}

		processArticles(data)
	}
	catch (error) {
		console.error('加载文章失败:', error)
	}
}

// 处理文章数据
function processArticles(data: ApiResponse) {
	// 更新统计数据
	fcircleState.value.stats = {
		friends_num: data.statistical_data.friends_num,
		active_num: data.statistical_data.active_num,
		article_num: data.statistical_data.article_num,
		last_updated_time: data.statistical_data.last_updated_time,
	}

	// 合并新旧文章
	const newArticles = data.article_data
	const mergedArticles = [...fcircleState.value.allArticles, ...newArticles]
	fcircleState.value.allArticles = mergedArticles

	// 更新显示的列表
	const newDisplayed = mergedArticles.slice(
		fcircleState.value.start,
		fcircleState.value.start + UserConfig.page_turning_number,
	)
	fcircleState.value.displayedArticles = [...fcircleState.value.displayedArticles, ...newDisplayed]

	// 更新起始位置
	fcircleState.value.start += UserConfig.page_turning_number

	// 检查是否有更多文章
	fcircleState.value.hasMoreArticles = fcircleState.value.start < mergedArticles.length

	// 显示随机文章
	if (!fcircleState.value.randomArticle && mergedArticles.length > 0) {
		const randomIndex = Math.floor(Math.random() * mergedArticles.length)
		fcircleState.value.randomArticle = mergedArticles[randomIndex]
	}
}

// 格式化日期
function formatDate(dateString: string): string {
	return dateString ? dateString.substring(0, 10) : ''
}

// 显示随机文章
function displayRandomArticle() {
	if (fcircleState.value.allArticles.length > 0) {
		const randomIndex = Math.floor(Math.random() * fcircleState.value.allArticles.length)
		fcircleState.value.randomArticle = fcircleState.value.allArticles[randomIndex]
	}
}

// 头像加载处理
function avatarOrDefault(avatar: string): string {
	return avatar || UserConfig.error_img
}

function handleAvatarError(event: Event) {
	const target = event.target as HTMLImageElement
	target.src = UserConfig.error_img
}

// 打开文章链接
function openArticle(link: string) {
	window.open(link, '_blank')
}

// 打开随机文章
function openRandomArticle() {
	if (randomArticle.value) {
		window.open(randomArticle.value.link, '_blank')
	}
}

// 显示作者文章模态框
function showAuthorArticles(author: string, avatar: string, link: string) {
	currentAuthor.value = author
	currentAuthorAvatar.value = avatar
	authorOrigin.value = new URL(link).origin
	authorArticles.value = fcircleState.value.allArticles
		.filter(article => article.author === author)
		.slice(0, 4)

	showModal.value = true
	document.body.classList.add('overflow-hidden')
}

// 隐藏模态框
function hideModal() {
	showModal.value = false
	document.body.classList.remove('overflow-hidden')
}

// 全局点击事件处理
function globalClickHandler(event: MouseEvent) {
	const target = event.target as HTMLElement
	if (target.id === 'modal') {
		hideModal()
	}
}

// 组件挂载时初始化
onMounted(() => {
	loadMoreArticles()
})

// 清理事件监听
onUnmounted(() => {
	document.body.classList.remove('overflow-hidden')
})
</script>

<template>
	<div class="page-fcircle">
		<!-- 标题区域 -->
		<div class="page-header">
			<div class="header-content">
				<h1 class="page-title">
					友链朋友圈
				</h1>
				<p class="page-subtitle">
					发现更多有趣的博主
				</p>
			</div>
			<div class="header-image">
				<img src="https://eimg.yujiay.wang/images/2025/12/27/-.jpg" alt="友链朋友圈">
			</div>
		</div>

		<!-- 统计信息 -->
		<div class="stats-section">
			<div class="stats-card gradient-card">
				<div class="stat-item">
					<div class="stat-value">
						{{ stats.friends_num }}
					</div>
					<div class="stat-label">
						友链数
					</div>
				</div>
				<div class="stat-divider" />
				<div class="stat-item">
					<div class="stat-value">
						{{ stats.active_num }}
					</div>
					<div class="stat-label">
						活跃数
					</div>
				</div>
				<div class="stat-divider" />
				<div class="stat-item">
					<div class="stat-value">
						{{ stats.article_num }}
					</div>
					<div class="stat-label">
						文章数
					</div>
				</div>
			</div>
			<div class="update-time">
				更新于 {{ stats.last_updated_time }}
			</div>
		</div>

		<!-- 文章列表 -->
		<div class="article-list">
			<!-- 随机文章区域 -->
			<div v-if="randomArticle" class="random-article">
				<div class="random-container-title">
					随机钓鱼
				</div>
				<a href="#" class="article-item random-item" @click.prevent="openRandomArticle">
					<div class="article-container gradient-card">
						<div class="article-author">
							{{ randomArticle.author }}
						</div>
						<div class="article-title">
							{{ randomArticle.title }}
						</div>
						<div class="article-date">
							{{ randomArticle.created }}
						</div>
					</div>
				</a>
				<button class="refresh-btn gradient-card" @click="displayRandomArticle">
					<Icon name="ph:arrows-clockwise-bold" />
				</button>
			</div>

			<!-- 加载状态 -->
			<template v-if="loading">
				<div class="loading-state">
					<div v-for="i in 3" :key="`skeleton-${i}`" class="skeleton">
						<div class="skeleton-avatar" />
						<div class="skeleton-content">
							<div class="skeleton-text skeleton-text-title" />
							<div class="skeleton-text" />
						</div>
					</div>
				</div>
			</template>

			<!-- 文章列表区域 -->
			<template v-else>
				<transition-group name="article-fade" tag="div" class="articles-list">
					<div
						v-for="(article, index) in displayedArticles"
						:key="index"
						class="article-item"
						:style="{ '--delay': `${index * 0.05}s` }"
					>
						<div class="article-image" @click="showAuthorArticles(article.author, article.avatar, article.link)">
							<img
								:src="avatarOrDefault(article.avatar)"
								:alt="article.author"
								@error="handleAvatarError"
							>
						</div>
						<div class="article-container gradient-card">
							<div class="article-author">
								{{ article.author }}
							</div>
							<div class="article-title" @click="openArticle(article.link)">
								{{ article.title }}
							</div>
							<div class="article-date">
								{{ formatDate(article.created) }}
							</div>
						</div>
					</div>
				</transition-group>

				<!-- 加载更多按钮 -->
				<div class="load-more-container">
					<button
						v-show="hasMoreArticles"
						class="load-more gradient-card"
						@click="loadMoreArticles"
					>
						再来亿点
					</button>
					<div v-show="!hasMoreArticles" class="no-more">
						没有更多了
					</div>
				</div>
			</template>
		</div>

		<!-- 作者模态框 -->
		<client-only>
			<Transition name="modal">
				<div
					v-if="showModal"
					id="modal"
					class="modal"
					@click="globalClickHandler"
				>
					<div class="modal-content" @click.stop>
						<div class="modal__header">
							<img
								id="modal-author-avatar"
								:src="avatarOrDefault(currentAuthorAvatar)"
								:alt="currentAuthor"
								@error="handleAvatarError"
							>
							<a id="modal-author-name-link" :href="authorOrigin" target="_blank" rel="nofollow">
								{{ currentAuthor }}
							</a>
							<button class="modal-close" @click="hideModal">
								<Icon name="ph:x-bold" />
							</button>
						</div>

						<div id="modal-articles-container">
							<div
								v-for="(article, index) in authorArticles"
								:key="index"
								class="modal-article"
							>
								<a
									class="modal-article-title"
									:href="article.link"
									target="_blank"
									rel="nofollow"
								>
									{{ article.title }}
								</a>
								<div class="modal-article-date">
									📅 {{ formatDate(article.created) }}
								</div>
							</div>
						</div>

						<img
							id="modal-bg"
							:src="avatarOrDefault(currentAuthorAvatar)"
							alt=""
							@error="handleAvatarError"
						>
					</div>
				</div>
			</Transition>
		</client-only>
	</div>
</template>

<style scoped lang="scss">
.page-fcircle {
	margin: 1rem;
	animation: float-in 0.3s ease;
}

/* 标题区域 */
.page-header {
	background: linear-gradient(135deg, var(--c-primary-soft) 0%, rgba(255, 255, 255, 0) 100%);
	border-radius: 12px;
	padding: 2rem;
	margin-bottom: 2rem;
	display: flex;
	align-items: center;
	gap: 2rem;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

	@media (max-width: 768px) {
		flex-direction: column;
		padding: 1.5rem;
	}
}

.header-content {
	flex: 1;
}

.page-title {
	font-size: 2.25rem;
	font-weight: 700;
	color: var(--c-text);
	margin: 0 0 0.5rem 0;
}

.page-subtitle {
	font-size: 1rem;
	color: var(--c-text-2);
	margin: 0;
}

.header-image {
	flex-shrink: 0;
	width: 120px;
	height: 120px;

	img {
		width: 100%;
		height: 100%;
		border-radius: 12px;
		object-fit: cover;
		box-shadow: 2px 4px 12px rgba(0, 0, 0, 0.1);
	}
}

/* 统计信息区域 */
.stats-section {
	margin-bottom: 2rem;
	text-align: center;
}

.stats-card {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 1.5rem 2rem;
	margin-bottom: 0.75rem;
}

.stat-item {
	text-align: center;
	min-width: 80px;
}

.stat-value {
	font-size: 1.5rem;
	font-weight: 700;
	color: var(--c-text);
	margin-bottom: 0.25rem;
}

.stat-label {
	font-size: 0.875rem;
	color: var(--c-text-3);
}

.stat-divider {
	width: 1px;
	height: 40px;
	background-color: var(--c-border);
	margin: 0 2rem;
}

.update-time {
	font-size: 0.875rem;
	color: var(--c-text-3);
	font-family: var(--font-monospace);
}

/* 文章列表 */
.article-list {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

/* 随机文章区域 */
.random-article {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 0.5rem;

	@media (max-width: 768px) {
		flex-direction: column;
	}
}

.random-container-title {
	font-size: 1.2rem;
	font-weight: 600;
	color: var(--c-text);
	white-space: nowrap;

	@media (max-width: 768px) {
		display: none;
	}
}

.random-item {
	flex: 1;
	min-width: 0;
}

.refresh-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 2.5rem;
	height: 2.5rem;
	border: none;
	background-color: var(--c-bg-1);
	color: var(--c-text-2);
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		color: var(--c-text);
		transform: rotate(180deg);
	}
}

/* 文章列表区域 */
.articles-list {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.article-item {
	display: flex;
	align-items: center;
	gap: 10px;
	width: 100%;
}

.article-image {
	border-radius: 50%;
	box-shadow: 0 0 0 1px var(--c-border);
	display: flex;
	flex-shrink: 0;
	height: 2rem;
	overflow: hidden;
	width: 2rem;
	cursor: pointer;
	transition: all 0.2s ease;

	img {
		height: 100%;
		object-fit: cover;
		opacity: 0.8;
		transition: all 0.2s ease;
		width: 100%;
	}

	&:hover {
		box-shadow: 0 0 0 1px var(--c-primary);

		img {
			opacity: 1;
			transform: scale(1.05);
		}
	}
}

.article-container {
	align-items: center;
	display: flex;
	gap: 8px;
	height: 2.5rem;
	overflow: hidden;
	padding: 10px;
	width: 100%;
	cursor: pointer;

	&:hover {
		.article-title {
			color: var(--c-text);
		}
	}

	.article-author {
		color: var(--c-text-3);
		font-size: 0.85rem;
		flex-shrink: 0;
	}

	.article-title {
		color: var(--c-text-2);
		flex: 1;
		font-size: 0.9375rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		transition: color 0.2s ease;
	}

	.article-date {
		color: var(--c-text-3);
		font-family: var(--font-monospace);
		font-size: 0.75rem;
		flex-shrink: 0;
	}
}

/* 加载状态 */
.loading-state {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.skeleton {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 10px;
	border-radius: 8px;
	box-shadow: 0 0 0 1px var(--c-border);
	background-color: var(--c-bg-1);
}

.skeleton-avatar {
	width: 2rem;
	height: 2rem;
	border-radius: 50%;
	flex-shrink: 0;
	background: linear-gradient(90deg, var(--c-bg-2) 25%, var(--c-bg-soft) 50%, var(--c-bg-2) 75%);
	background-size: 200% 100%;
	animation: loading 1.5s infinite;
}

.skeleton-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.skeleton-text {
	height: 16px;
	border-radius: 4px;
	background: linear-gradient(90deg, var(--c-bg-2) 25%, var(--c-bg-soft) 50%, var(--c-bg-2) 75%);
	background-size: 200% 100%;
	animation: loading 1.5s infinite;
}

.skeleton-text-title {
	width: 60%;
}

/* 加载更多按钮 */
.load-more-container {
	text-align: center;
	margin-top: 1.5rem;
}

.load-more {
	background-color: var(--c-bg-1);
	border: none;
	border-radius: 8px;
	box-shadow: 0 0 0 1px var(--c-border);
	color: var(--c-text-2);
	cursor: pointer;
	display: inline-block;
	font-size: 0.875rem;
	height: 42px;
	padding: 0.75rem 2rem;
	transition: all 0.2s ease;

	&:hover {
		color: var(--c-text);
		box-shadow: 0 0 0 1px var(--c-primary);
	}

	&:active {
		transform: scale(0.98);
	}
}

.no-more {
	color: var(--c-text-3);
	font-size: 0.875rem;
	padding: 1rem 0;
}

/* 模态框样式 */
.modal {
	align-items: center;
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	display: flex;
	justify-content: center;
	inset: 0;
	position: fixed;
	z-index: 1000;
}

.modal-content {
	background-color: var(--c-bg-1);
	border-radius: 12px;
	box-shadow: 0 0 0 1px var(--c-border);
	max-height: 80vh;
	max-width: 500px;
	overflow-y: auto;
	padding: 1.5rem;
	position: relative;
	width: 90%;
	animation: modal-in 0.2s ease;
}

.modal__header {
	align-items: center;
	border-bottom: 1px solid var(--c-border);
	display: flex;
	gap: 15px;
	margin-bottom: 1.5rem;
	padding-bottom: 1rem;
	position: relative;

	img {
		border-radius: 50%;
		height: 50px;
		object-fit: cover;
		width: 50px;
	}

	a {
		color: var(--c-text-2);
		text-decoration: none;
		transition: color 0.2s ease;
		font-size: 1rem;

		&:hover {
			color: var(--c-text);
		}
	}
}

.modal-close {
	position: absolute;
	right: 0;
	top: -5px;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	border: none;
	background: transparent;
	color: var(--c-text-3);
	cursor: pointer;
	transition: all 0.2s ease;
	border-radius: 6px;

	&:hover {
		background-color: var(--c-bg-2);
		color: var(--c-text);
	}
}

#modal-articles-container {
	.modal-article {
		padding: 0 0 1rem 1.25rem;
		position: relative;

		&:not(:last-child) {
			border-bottom: 1px solid var(--c-border);
			padding-bottom: 1rem;
			margin-bottom: 1rem;
		}

		.modal-article-title {
			color: var(--c-text-2);
			display: block;
			line-height: 1.4;
			text-decoration: none;
			transition: color 0.2s ease;

			&:hover {
				color: var(--c-text);
			}
		}

		.modal-article-date {
			color: var(--c-text-3);
			font-family: var(--font-monospace);
			font-size: 0.875rem;
			margin-top: 0.25rem;
		}
	}
}

#modal-bg {
	border-radius: 50%;
	bottom: 1.25rem;
	filter: blur(5px);
	height: 128px;
	opacity: 0.6;
	overflow: hidden;
	pointer-events: none;
	position: absolute;
	right: 1.25rem;
	width: 128px;
	z-index: -1;
}

/* 动画 */
@keyframes float-in {
	from {
		opacity: 0;
		transform: translateY(20px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes loading {
	0% {
		background-position: 200% 0;
	}
	100% {
		background-position: -200% 0;
	}
}

@keyframes modal-in {
	from {
		opacity: 0;
		transform: scale(0.95);
	}
	to {
		opacity: 1;
		transform: scale(1);
	}
}

/* 过渡动画 */
.article-fade-enter-active,
.article-fade-leave-active {
	transition: all 0.3s ease;
}

.article-fade-enter-from {
	opacity: 0;
	transform: translateY(20px);
}

.article-fade-leave-to {
	opacity: 0;
	transform: translateY(-20px);
}

.modal-enter-active,
.modal-leave-active {
	transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
	.page-fcircle {
		margin: 0.5rem;
	}

	.stats-card {
		padding: 1rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.stat-item {
		flex: 1;
		min-width: 60px;
	}

	.stat-divider {
		display: none;
	}

	.stat-value {
		font-size: 1.25rem;
	}

	.article-item {
		flex-wrap: wrap;

		.article-container {
			flex: 1;
			min-width: 0;
			height: auto;
			flex-direction: column;
			align-items: flex-start;
			gap: 0.25rem;
		}

		.article-author {
			font-size: 0.8rem;
		}

		.article-title {
			font-size: 0.85rem;
			white-space: normal;
		}

		.article-date {
			font-size: 0.7rem;
		}
	}

	.modal-content {
		max-width: 95%;
		padding: 1.25rem;
	}

	.modal__header {
		gap: 10px;
	}

	.modal__header img {
		width: 40px;
		height: 40px;
	}

	.modal-close {
		top: -8px;
		right: -5px;
	}
}

/* 无障碍支持 */
@media (prefers-reduced-motion: reduce) {
	* {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
	}
}
</style>
