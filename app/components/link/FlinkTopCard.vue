<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import feeds from '~/feeds'

// 使用 safego 外链安全跳转
const { transformLink, isExternal } = useSafego()

// 定义类型接口
interface FriendEntry {
	author: string
	link: string
	avatar: string
	hundredSuffix?: string
	date?: string
}

interface LinkGroup {
	name: string
	entries: FriendEntry[]
	hundredSuffix?: string
}

// 从环境变量获取域名
const domain = 'https://home.zsxcoder.top/'

// 动态生成 URL
function urlFor(path: string): string {
	if (path.startsWith('http://') || path.startsWith('https://'))
		return path
	if (path.startsWith(''))
		return `${domain}${path}`
	return path
}

// 转换外链为安全链接
function safeUrlFor(path: string): string {
	const url = urlFor(path)
	return isExternal(url) ? transformLink(url) : url
}

// 主题配置
const theme = ref({
	error_img: {
		flink: 'https://img.314926.xyz/images/2025/08/19/404.gif',
	},
})

// 横幅信息
const bannerInfo = ref([
	{
		title: '友情链接',
		description: '与数百名博主无限进步',
		buttonTextOne: '随机访问',
		buttonTextTwo: '申请友链',
	},
])

// 友情链接数据加载状态
const friendsData = ref<LinkGroup[]>([])
const isLoading = ref(true)

// 异步加载数据
onMounted(() => {
	setTimeout(() => {
		friendsData.value = feeds as LinkGroup[]
		isLoading.value = false
	}, 300)
})

// 处理头像 URL（移除感叹号）
function getAvatarWithoutExclamationMark(url: string): string {
	const exclamationIndex = url.indexOf('!')
	return exclamationIndex !== -1 ? url.substring(0, exclamationIndex) : url
}

// 图片加载错误处理
function handleImageError(event: Event): void {
	const target = event.target as HTMLImageElement
	target.onerror = null
	target.src = urlFor(theme.value.error_img.flink)
}

const allPairs = computed(() => {
	return friendsData.value.flatMap((group: LinkGroup) => {
		const linkList = [...group.entries]
		const evenNum = linkList.filter((_, index) => index % 2 === 0)
		const oddNum = linkList.filter((_, index) => index % 2 === 1)
		const hundredSuffix = group.hundredSuffix || ''

		const validPairs: Array<{
			even: FriendEntry
			odd: FriendEntry
			evenAvatar: string
			oddAvatar: string
			hundredSuffix: string
		}> = []

		const maxPairCount = Math.min(evenNum.length, oddNum.length)
		for (let i = 0; i < maxPairCount; i++) {
			const evenItem = evenNum[i]
			const oddItem = oddNum[i]
			if (evenItem && oddItem) {
				validPairs.push({
					even: evenItem,
					odd: oddItem,
					evenAvatar: getAvatarWithoutExclamationMark(evenItem.avatar),
					oddAvatar: getAvatarWithoutExclamationMark(oddItem.avatar),
					hundredSuffix,
				})
			}
		}
		return validPairs
	})
})

// 复制多次以确保足够宽度的滚动内容
const duplicatedPairs = computed(() => {
	// 重复至少 4 次以确保能填满整个容器宽度
	const repeated = [...allPairs.value, ...allPairs.value, ...allPairs.value, ...allPairs.value]
	return repeated
})
</script>

<template>
<div id="flink-top">
	<!-- 横幅区域 -->
	<div id="flink-banners">
		<div v-for="(info, infoItem) in bannerInfo" :key="infoItem" class="banner-top-box">
			<div class="flink-banners-title">
				<div class="banners-title-small">
					{{ info.title }}
				</div>
				<div class="banners-title-big">
					{{ info.description }}
				</div>
			</div>
		</div>

		<!-- 技能标签组区域 -->
		<div id="skills-tags-group-all">
			<div class="tags-group-wrapper">
				<!-- 遍历当前组的图标对（重复多次以实现无缝循环） -->
				<div v-for="(pair, pairIndex) in duplicatedPairs" :key="pairIndex" class="tags-group-icon-pair">
					<!-- 渲染偶数项头像 -->
					<a class="tags-group-icon no-text-decoration" target="_blank" rel="noopener" :href="safeUrlFor(pair.even.link)" :title="pair.even.author">
						<img class="no-lightbox" :title="pair.even.author" :src="urlFor(pair.evenAvatar + pair.hundredSuffix)" :alt="pair.even.author" @error="handleImageError">
					</a>

					<!-- 渲染奇数项头像 -->
					<a class="tags-group-icon no-text-decoration" target="_blank" rel="noopener" :href="safeUrlFor(pair.odd.link)" :title="pair.odd.author">
						<img class="no-lightbox" :title="pair.odd.author" :src="urlFor(pair.oddAvatar + pair.hundredSuffix)" :alt="pair.odd.author" @error="handleImageError">
					</a>
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<style scoped lang="scss">
#flink-top {
	max-width: 1100px;
	margin: 0 auto;
	padding: 0 1rem;
}

/* 横幅区域样式 */
#flink-banners {
	display: flex;
	flex-direction: column;
	position: relative;
	overflow: hidden;
	height: 320px;
	margin: 1.5rem 0;
	padding: 2rem 2rem 1.5rem;
	border: 1px solid var(--c-border);
	border-radius: 16px;
	background: var(--c-bg-2);
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
	transition: all 0.3s ease;

	&:hover {
		box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
	}
}

.banner-top-box {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 60px;
	flex-shrink: 0;
	margin-bottom: 1rem;
}

.flink-banners-title {
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
}

.banners-title-small {
	font-size: 0.875rem;
	color: var(--c-text-2);
	font-weight: 500;
	margin: 0;
	line-height: 1.2;
}

.banners-title-big {
	font-size: 2rem;
	font-weight: 700;
	color: var(--c-text);
	margin: 0;
	line-height: 1.2;
}

/* 技能标签组区域 */
#skills-tags-group-all {
	display: flex;
	width: 100%;
	overflow: hidden;
	position: relative;
	flex: 1;
	align-items: center;
	margin-top: auto;
	mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
	-webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
}

.tags-group-wrapper {
	display: flex;
	flex-wrap: nowrap;
	animation: rowup 40s linear infinite;

	&:hover {
		animation-play-state: paused;
	}
}

.tags-group-icon-pair {
	display: flex;
	gap: 0.75rem;
	margin-left: 1.5rem;
	flex-shrink: 0;
}

.tags-group-icon {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 70px;
	height: 70px;
	border-radius: 50%;
	background: var(--c-bg-1);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	transition: all 0.3s ease;
	cursor: pointer;

	&:hover {
		transform: translateY(-4px) scale(1.05);
		box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
	}

	&:active {
		transform: translateY(-2px) scale(1.02);
	}
}

.tags-group-icon img {
	width: 100%;
	height: 100%;
	border-radius: 50%;
	object-fit: cover;
	transition: opacity 0.3s ease;

	&:hover {
		opacity: 0.9;
	}
}

.no-text-decoration {
	text-decoration: none;
}

.no-lightbox {
	display: block;
}

/* 滚动动画 */
@keyframes rowup {
	0% {
		transform: translateX(0);
	}

	100% {
		transform: translateX(-25%);
	}
}

/* 响应式设计 */
@media (max-width: 768px) {
	#flink-banners {
		height: 280px;
		padding: 1.5rem 1.5rem 1rem;
		margin: 1rem 0;
	}

	.banner-top-box {
		height: 50px;
		margin-bottom: 0.75rem;
	}

	.banners-title-big {
		font-size: 1.75rem;
	}

	.banners-title-small {
		font-size: 0.8rem;
	}

	.tags-group-icon {
		width: 60px;
		height: 60px;
	}

	.tags-group-icon-pair {
		margin-left: 1rem;
		gap: 0.6rem;
	}
}

@media (max-width: 480px) {
	#flink-top {
		padding: 0 0.5rem;
	}

	#flink-banners {
		height: 260px;
		padding: 1.25rem 1rem 0.75rem;
		margin: 0.75rem 0;
		border-radius: 12px;
	}

	.banner-top-box {
		height: auto;
		margin-bottom: 0.5rem;
	}

	.flink-banners-title {
		align-items: flex-start;
		gap: 0.2rem;
	}

	.banners-title-small {
		font-size: 0.75rem;
	}

	.banners-title-big {
		font-size: 1.5rem;
	}

	.tags-group-icon {
		width: 52px;
		height: 52px;
	}

	.tags-group-icon-pair {
		margin-left: 0.75rem;
		gap: 0.5rem;
	}
}

/* 暗色模式适配 */
:global(html.dark) {
	#flink-banners {
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

		&:hover {
			box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
		}
	}

	.tags-group-icon {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);

		&:hover {
			box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
		}
	}
}
</style>
