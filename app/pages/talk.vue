<script setup lang="ts">
import type { MastodonConfig, MastodonStatus } from '../types/mastodon'
import { onMounted, ref } from 'vue'
import { getLocaleDatetime } from '../utils/time'

useHead({ title: '说说' })
definePageMeta({
	headerText: '说说',
})

const { author, mastodon } = useAppConfig()

const recentStatuses = ref<MastodonStatus[]>([])
const isLoading = ref(true)
const loadError = ref(false)
const expandedImages = ref<Set<string>>(new Set())

async function fetchMastodonStatuses() {
	if (isLoading.value) {
		isLoading.value = true
		loadError.value = false
	}

	try {
		const { instance, userId, token, tag, shownMax } = mastodon || {}
		if (!instance || !userId) {
			throw new Error('请在 homepage.config.ts 中配置 Mastodon 的 instance 和 userId')
		}

		const tagParam = tag ? `&tagged=${tag}` : ''
		const excludeReplies = '&exclude_replies=true'
		const url = `https://${instance}/api/v1/accounts/${userId}/statuses?limit=${shownMax || 30}${tagParam}${excludeReplies}`

		const headers: HeadersInit = {}
		if (token) {
			headers.Authorization = `Bearer ${token}`
		}

		const response = await fetch(url, { headers })

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json() as MastodonStatus[]
		recentStatuses.value = data.filter(status =>
			!status.in_reply_to_id && status.visibility !== 'direct',
		)
	}
	catch (error) {
		console.error('获取 Mastodon 数据失败:', error)
		loadError.value = true
	}
	finally {
		isLoading.value = false
	}
}

onMounted(() => {
	window.scrollTo(0, 0)
	fetchMastodonStatuses()
})

function formatDate(dateString: string) {
	return getLocaleDatetime(dateString)
		.replace(/\//g, '-')
}

function formatContent(content: string, emojis: any[]) {
	if (!emojis || emojis.length === 0) {
		return content
	}

	// 替换 emoji :shortcode: 为 img 标签
	return content.replace(/:(\w+):/g, (match, shortcode) => {
		const emoji = emojis.find(e => e.shortcode === shortcode)
		if (emoji) {
			return `<img class="emoji" src="${emoji.static_url}" alt=":${shortcode}:" />`
		}
		return match
	})
}

function toggleImages(statusId: string) {
	if (expandedImages.value.has(statusId)) {
		expandedImages.value.delete(statusId)
	}
	else {
		expandedImages.value.add(statusId)
	}
}

function getTags(status: MastodonStatus) {
	return status.tags.map(tag => tag.name)
}

function isExpanded(statusId: string) {
	return expandedImages.value.has(statusId)
}

function replyToStatus(status: MastodonStatus) {
	// 滚动到 Waline 容器
	const walineContainer = document.querySelector('#waline-container')
	if (!walineContainer) {
		console.warn('Waline 容器未找到')
		return
	}

	walineContainer.scrollIntoView({ behavior: 'smooth', block: 'start' })

	// 等待滚动完成后，尝试获取 textarea 并填入引用内容
	setTimeout(() => {
		// Waline 的 textarea 选择器（尝试多个选择器以提高兼容性）
		const textarea = document.querySelector('#waline-container .wl-textarea, #waline-container textarea') as HTMLTextAreaElement
		if (!textarea) {
			console.warn('Waline textarea 未找到，尝试延迟重试')
			// 如果第一次没找到，再等待一段时间重试
			setTimeout(() => {
				const retryTextarea = document.querySelector('#waline-container .wl-textarea, #waline-container textarea') as HTMLTextAreaElement
				if (retryTextarea) {
					fillReplyContent(retryTextarea, status)
				}
			}, 500)
			return
		}

		fillReplyContent(textarea, status)
	}, 300)
}

function fillReplyContent(textarea: HTMLTextAreaElement, status: MastodonStatus) {
	// 获取要引用的内容
	const targetStatus = status.reblog || status
	const authorName = targetStatus.account.display_name
	const content = targetStatus.content.replace(/<[^>]*>/g, '').trim() // 移除 HTML 标签

	// 构建引用内容
	let replyContent = ''
	if (content) {
		const lines = content.split('\n')
		replyContent = lines.map(line => `> ${line}`).join('\n')
		replyContent += '\n\n'
	}

	// 设置 textarea 值
	textarea.value = replyContent

	// 触发 input 事件以更新 Waline 的状态
	textarea.dispatchEvent(new Event('input', { bubbles: true }))

	// 聚焦到 textarea 末尾
	const length = textarea.value.length
	textarea.setSelectionRange(length, length)
	textarea.focus()
}
</script>

<template>
<div class="talk-page">
	<!-- 标题区域 -->
	<div class="page-header">
		<div class="header-content">
			<h1 class="page-title">
				说说
			</h1>
			<p class="page-subtitle">
				来自 Mastodon 的动态
			</p>
		</div>
		<div class="header-image">
			<img src="https://eimg.yujiay.wang/images/2025/12/27/-.jpg" alt="说说">
		</div>
	</div>

	<div class="talk-list">
		<!-- 加载状态 -->
		<template v-if="isLoading">
			<div class="loading-state">
				<div v-for="i in 3" :key="`skeleton-${i}`" class="skeleton">
					<div class="skeleton-meta">
						<div class="skeleton-avatar" />
						<div class="skeleton-info">
							<div class="skeleton-nick" />
							<div class="skeleton-date" />
						</div>
					</div>
					<div class="skeleton-content">
						<div class="skeleton-text" />
						<div class="skeleton-text" />
						<div class="skeleton-text" />
					</div>
					<div class="skeleton-bottom">
						<div class="skeleton-tags" />
					</div>
				</div>
			</div>
		</template>

		<!-- 错误状态 -->
		<template v-else-if="loadError">
			<div class="error-state">
				<div class="error-content">
					<Icon name="ph:alert-circle-bold" class="error-icon" />
					<h3>加载失败</h3>
					<p>获取 Mastodon 数据时出现错误，请稍后重试</p>
					<button class="retry-btn" @click="fetchMastodonStatuses">
						<Icon name="ph:refresh-bold" />
						重试
					</button>
				</div>
			</div>
		</template>

		<!-- 内容状态 -->
		<template v-else>
			<!-- 空状态 -->
			<div v-if="recentStatuses.length === 0" class="empty-state">
				<Icon name="ph:chat-circle-bold" class="empty-icon" />
				<p>暂无内容</p>
			</div>

			<!-- 内容列表 -->
			<transition-group v-else name="talk-fade" tag="div">
				<div
					v-for="status in recentStatuses"
					:key="status.id"
					class="talk-item"
				>
					<!-- Reblog 标记 -->
					<div v-if="status.reblog" class="reblog-badge">
						<Icon name="ph:repeat-bold" />
						<span>{{ status.account.display_name }} 转发了</span>
					</div>

					<div class="talk-meta">
						<NuxtImg
							class="avatar"
							:src="(status.reblog || status).account.avatar"
							:alt="(status.reblog || status).account.display_name"
						/>
						<div class="info">
							<div class="nick">
								{{ (status.reblog || status).account.display_name }}
								<Icon
									v-if="(status.reblog || status).account.bot"
									class="bot"
									name="ph:robot-bold"
								/>
							</div>
							<div class="date">
								{{ formatDate((status.reblog || status).created_at) }}
							</div>
						</div>
					</div>

					<div class="talk-content">
						<div class="text" v-html="formatContent((status.reblog || status).content, (status.reblog || status).emojis)" />
						<div v-if="(status.reblog || status).media_attachments.length > 0" class="images">
							<template v-if="isExpanded(status.id)">
								<NuxtLink
									v-for="media in (status.reblog || status).media_attachments"
									:key="media.id"
									:to="media.url"
									target="_blank"
									class="image"
								>
									<img :src="media.preview_url" :alt="media.description">
								</NuxtLink>
							</template>
							<button v-else class="show-images-btn" @click="toggleImages(status.id)">
								<Icon name="ph:images-bold" />
								显示图片 ({{ (status.reblog || status).media_attachments.length }})
							</button>
						</div>
					</div>

					<div class="talk-bottom">
						<div class="tags">
							<span
								v-for="tag in getTags(status.reblog || status)"
								:key="tag"
								class="tag"
							>
								<Icon name="ph:tag-bold" />
								<span>#{{ tag }}</span>
							</span>
							<a
								v-if="(status.reblog || status).url"
								class="source-link"
								:href="(status.reblog || status).url"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Icon name="ph:link-bold" />
								<span>原文</span>
							</a>
						</div>
						<div class="stats">
							<button class="comment-btn" title="评论" @click="replyToStatus(status)">
								<Icon name="ph:chats-bold" />
							</button>
							<span v-if="status.favourites_count > 0" class="stat">
								<Icon name="ph:heart-bold" />
								{{ status.favourites_count }}
							</span>
							<span v-if="status.reblogs_count > 0" class="stat">
								<Icon name="ph:repeat-bold" />
								{{ status.reblogs_count }}
							</span>
						</div>
					</div>
				</div>
			</transition-group>

			<div class="talk-footer">
				<p>仅显示最近 {{ recentStatuses.length }} 条记录</p>
			</div>
		</template>
	</div>

	<!-- Waline 评论组件 -->
	<client-only>
		<Waline path="/talk" title="说说" />
	</client-only>
</div>
</template>

<style lang="scss" scoped>
.talk-page {
	margin: 1rem;
	animation: float-in 0.3s ease;

	@media (max-width: 480px) {
		margin: 0.25rem 0.125rem;
	}
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

.talk-list {
	animation: float-in 0.2s backwards;

	.talk-item {
		animation: float-in 0.3s backwards;
		animation-delay: var(--delay);
		border-radius: 8px;
		box-shadow: 0 0 0 1px var(--c-bg-soft);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
		padding: 1rem;
		opacity: 1;
		transform: translateY(0);
		transition: opacity 0.3s ease, transform 0.3s ease;

		.reblog-badge {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			padding: 0.5rem 0.75rem;
			background-color: var(--c-bg-1);
			border-radius: 6px;
			font-size: 0.8rem;
			color: var(--c-text-2);

			.icon {
				font-size: 1rem;
			}
		}

		.talk-meta {
			align-items: center;
			display: flex;
			gap: 10px;

			.avatar {
				border-radius: 2em;
				box-shadow: 2px 4px 1rem var(--ld-shadow);
				width: 3em;
			}

			.nick {
				align-items: center;
				display: flex;
				gap: 5px;
			}

			.bot {
				color: var(--c-primary);
				font-size: 16px;
			}

			.date {
				color: var(--c-text-3);
				font-family: var(--font-monospace);
				font-size: 0.8rem;
			}
		}

		.talk-content {
			color: var(--c-text-2);
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			line-height: 1.6;

			:deep(a[href]) {
				margin: -0.1em -0.2em;
				padding: 0.1em 0.2em;
				background: linear-gradient(var(--c-primary-soft), var(--c-primary-soft)) no-repeat center bottom / 100% 0.1em;
				color: var(--c-primary);
				transition: all 0.2s;

				&:hover {
					border-radius: 0.3em;
					background-size: 100% 100%;
				}
			}

			:deep(.emoji) {
				vertical-align: middle;
				width: 1.2em;
				height: 1.2em;
				display: inline-block;
			}

			.images {
				display: flex;
				flex-direction: column;
				gap: 8px;
			}

			.image {
				display: block;
				border-radius: 8px;
				overflow: hidden;

				img {
					width: 100%;
					height: auto;
					border-radius: 8px;
					transition: transform 0.3s;

					&:hover {
						transform: scale(1.02);
					}
				}
			}

			.show-images-btn {
				display: flex;
				align-items: center;
				gap: 0.5rem;
				padding: 0.5rem 1rem;
				border: 1px solid var(--c-border);
				border-radius: 6px;
				background-color: var(--c-bg-1);
				color: var(--c-text-2);
				font-size: 0.9rem;
				cursor: pointer;
				transition: all 0.2s;

				&:hover {
					background-color: var(--c-bg-2);
					border-color: var(--c-primary);
					color: var(--c-primary);
				}

				.icon {
					font-size: 1rem;
				}
			}
		}

		.talk-bottom {
			align-items: center;
			color: var(--c-text-3);
			display: flex;
			justify-content: space-between;

			.tags {
				display: flex;
				font-size: 0.7rem;
				gap: 4px;
				flex-wrap: wrap;
			}

			.tag, .source-link {
				display: flex;
				padding: 2px 4px;
				border-radius: 4px;
				background-color: var(--c-bg-2);
				align-items: center;
				cursor: pointer;
				transition: all 0.2s;
				text-decoration: none;

				&:hover {
					opacity: 0.8;
				}
			}

			.source-link {
				color: var(--c-primary);
			}

			.stat {
				display: flex;
				align-items: center;
				gap: 0.25rem;
				font-size: 0.75rem;
				margin-left: 0.5rem;

				.icon {
					font-size: 0.9rem;
				}
			}

			.stats {
				display: flex;
				align-items: center;
				gap: 0.5rem;
			}

			.comment-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 32px;
				height: 32px;
				padding: 0;
				border: none;
				border-radius: 50%;
				background-color: var(--c-bg-1);
				color: var(--c-text-3);
				font-size: 0.9rem;
				cursor: pointer;
				transition: all 0.2s;

				&:hover {
					background-color: var(--c-primary);
					color: white;
					transform: translateY(-1px);
				}

				&:active {
					transform: translateY(0);
				}

				.icon {
					font-size: 1rem;
				}
			}
		}
	}

	.talk-footer {
		color: var(--c-text-3);
		font-size: 1rem;
		margin: 2rem 0;
		text-align: center;
	}

	/* 过渡动画 */
	.talk-fade-enter-active,
	.talk-fade-leave-active {
		transition: all 0.3s ease;
	}

	.talk-fade-enter-from {
		opacity: 0;
		transform: translateY(20px);
	}

	.talk-fade-leave-to {
		opacity: 0;
		transform: translateY(-20px);
	}

	/* 加载状态 */
	.loading-state {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 1rem 0;
	}

	.skeleton {
		border-radius: 8px;
		box-shadow: 0 0 0 1px var(--c-bg-soft);
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
	}

	.skeleton-meta {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.skeleton-avatar {
		width: 3em;
		height: 3em;
		border-radius: 50%;
		background: linear-gradient(90deg, var(--c-bg-2) 25%, var(--c-bg-soft) 50%, var(--c-bg-2) 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
	}

	.skeleton-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.skeleton-nick {
		width: 120px;
		height: 18px;
		border-radius: 4px;
		background: linear-gradient(90deg, var(--c-bg-2) 25%, var(--c-bg-soft) 50%, var(--c-bg-2) 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
	}

	.skeleton-date {
		width: 100px;
		height: 14px;
		border-radius: 4px;
		background: linear-gradient(90deg, var(--c-bg-2) 25%, var(--c-bg-soft) 50%, var(--c-bg-2) 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
	}

	.skeleton-content {
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

	.skeleton-text:nth-child(2) {
		width: 80%;
	}

	.skeleton-text:nth-child(3) {
		width: 60%;
	}

	.skeleton-bottom {
		height: 24px;
		border-radius: 4px;
		background: linear-gradient(90deg, var(--c-bg-2) 25%, var(--c-bg-soft) 50%, var(--c-bg-2) 75%);
		background-size: 200% 100%;
		animation: loading 1.5s infinite;
	}

	/* 错误状态 */
	.error-state {
		text-align: center;
		padding: 3rem 1rem;
		border-radius: 8px;
		box-shadow: 0 0 0 1px var(--c-bg-soft);
		margin: 1rem 0;
	}

	.error-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.error-icon {
		font-size: 3rem;
		color: var(--c-primary);
	}

	.error-state h3 {
		font-size: 1.2rem;
		margin: 0;
		color: var(--c-text-1);
	}

	.error-state p {
		color: var(--c-text-3);
		margin: 0;
	}

	.retry-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border: none;
		border-radius: 6px;
		background-color: var(--c-primary);
		color: white;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s;

		&:hover {
			background-color: var(--c-primary-hover);
			transform: translateY(-1px);
		}

		&:active {
			transform: translateY(0);
		}
	}

	/* 空状态 */
	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
		border-radius: 8px;
		box-shadow: 0 0 0 1px var(--c-bg-soft);
		margin: 1rem 0;
		color: var(--c-text-3);
	}

	.empty-icon {
		font-size: 3rem;
		margin-bottom: 0.5rem;
	}

	/* 加载动画 */
	@keyframes loading {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	/* 淡入动画 */
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
}
</style>
