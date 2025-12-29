<script setup lang="ts">
import { format, formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { computed, onMounted, ref } from 'vue'

// SEO 配置
useSeoMeta({
	title: '即刻短文',
	description: '记录生活点滴，一些想法。',
})

// API 配置
const API_CONFIG = {
	ECHO_API: 'https://ech0.050815.xyz/api/echo/page',
}

// 定义数据接口
interface EchoExtension {
	title?: string
	site?: string
}

interface Tag {
	id: number
	name: string
}

interface EchoItem {
	id: number
	content: string
	username: string
	layout: string
	private: boolean
	user_id: number
	extension: string
	extension_type: 'WEBSITE' | 'VIDEO' | 'MUSIC' | ''
	fav_count: number
	created_at: string
	tags: Tag[]
}

interface EchoResponse {
	code: number
	msg: string
	data: {
		total: number
		items: EchoItem[]
	}
}

interface FormattedItem {
	id: number
	content: string
	username: string
	extension: {
		type: string
		data: EchoExtension | string | null
	} | null
	date: string
	relativeTime: string
	displayTime: string
	favCount: number
	tags: Tag[]
}

// 状态管理
const essaysState = useState('essays', () => ({
	items: [] as FormattedItem[],
	loading: true,
	error: false,
	lastFetchTime: 0,
}))

const loading = computed(() => essaysState.value.loading)
const error = computed(() => essaysState.value.error)
const items = computed(() => essaysState.value.items)

function formatTime(time: string) {
	return format(new Date(time), 'yyyy-MM-dd HH:mm')
}

function formatDisplayTime(time: string): string {
	const now = new Date()
	const date = new Date(time)
	const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

	// 24小时内显示相对时间
	if (diffHours < 24) {
		return formatDistanceToNow(date, { locale: zhCN, addSuffix: true })
	}
	// 24小时外显示具体时间
	return formatTime(time)
}

function parseExtension(extension_type: string, extension: string) {
	if (!extension_type || !extension)
		return null

	// MUSIC 和 VIDEO 类型的 extension 是直接的字符串，不是 JSON
	if (extension_type === 'MUSIC' || extension_type === 'VIDEO') {
		return {
			type: extension_type.toLowerCase(),
			data: extension,
		}
	}

	// 其他类型（WEBSITE）的 extension 是 JSON 字符串
	try {
		const extData = JSON.parse(extension)
		return {
			type: extension_type.toLowerCase(),
			data: extData,
		}
	}
	catch (e) {
		console.error('解析 extension 失败:', e)
		return null
	}
}

function formatContent(content: string) {
	// 先处理行级元素
	let formatted = content
		.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
		.replace(/\[(.*?)\]\((.*?)\)/g, '<a class="essay-link" target="_blank" rel="nofollow" href="$2">$1</a>')

	// 处理列表
	const lines = formatted.split('\n')
	const result: string[] = []
	let inList = false

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]

		// 匹配列表项 `- 文本`
		const listMatch = line.match(/^-\s+(.+)$/)
		if (listMatch) {
			const itemText = listMatch[1]

			// 检查是否是待办事项
			const todoMatch = itemText.match(/^\[([ x])\]\s*(.+)$/)
			if (todoMatch) {
				const checked = todoMatch[1] === 'x'
				const todoText = todoMatch[2]
				result.push(`<li class="todo-item ${checked ? 'checked' : ''}">${checked ? '✓' : '○'} ${todoText}</li>`)
			}
			else {
				result.push(`<li>${itemText}</li>`)
			}

			if (!inList) {
				inList = true
			}
		}
		else {
			// 非列表行
			if (inList) {
				result.unshift('<ul>')
				result.push('</ul>')
				inList = false
			}
			result.push(line)
		}
	}

	// 如果最后还在列表中，闭合 ul 标签
	if (inList) {
		result.unshift('<ul>')
		result.push('</ul>')
	}

	return result.join('\n')
}

// 解析网易云音乐 URL 获取参数
function getMusicId(url: string): string {
	const match = url.match(/id=(\d+)/)
	return match ? match[1] : ''
}

function getMusicServer(url: string): string {
	if (url.includes('music.163.com'))
		return 'netease'
	if (url.includes('music.qq.com'))
		return 'tencent'
	if (url.includes('y.qq.com'))
		return 'tencent'
	if (url.includes('kugou.com'))
		return 'kugou'
	if (url.includes('kuwo.cn'))
		return 'kuwo'
	if (url.includes('xiami.com'))
		return 'xiami'
	if (url.includes('bilibili.com'))
		return 'bilibili'
	return 'netease'
}

function getMusicType(url: string): string {
	if (url.includes('/song?'))
		return 'song'
	if (url.includes('/playlist?'))
		return 'playlist'
	if (url.includes('/album?'))
		return 'album'
	if (url.includes('/artist?'))
		return 'artist'
	return 'song'
}

async function fetchEssays() {
	const now = Date.now()
	if (now - essaysState.value.lastFetchTime < 30 * 60 * 1000) {
		return
	}
	try {
		essaysState.value.loading = true
		essaysState.value.error = false

		const response = await fetch(API_CONFIG.ECHO_API, {
			method: 'GET',
		})

		if (!response.ok)
			throw new Error(`HTTP error! status: ${response.status}`)

		const data = await response.json() as EchoResponse

		if (data.code === 1 && data.data?.items) {
			const formattedItems = data.data.items.map((item: EchoItem) => ({
				id: item.id,
				content: formatContent(item.content),
				username: item.username,
				extension: parseExtension(item.extension_type, item.extension),
				date: formatTime(item.created_at),
				relativeTime: formatDistanceToNow(new Date(item.created_at), { locale: zhCN, addSuffix: true }),
				displayTime: formatDisplayTime(item.created_at),
				favCount: item.fav_count,
				tags: item.tags || [],
			}))
			essaysState.value.items = formattedItems
			essaysState.value.lastFetchTime = Date.now()
		}
	}
	catch (err) {
		console.error('获取短文数据失败:', err)
		essaysState.value.error = true
	}
	finally {
		essaysState.value.loading = false
	}
}

function replyToEssay(item: FormattedItem) {
	// 滚动到 Waline 容器
	const walineContainer = document.querySelector('#waline-container')
	if (!walineContainer) {
		console.warn('Waline 容器未找到')
		return
	}

	walineContainer.scrollIntoView({ behavior: 'smooth', block: 'start' })

	// 等待滚动完成后，尝试获取 textarea 并填入引用内容
	setTimeout(() => {
		// Waline 的 textarea 选择器
		const textarea = document.querySelector('#waline-container .wl-textarea, #waline-container textarea') as HTMLTextAreaElement
		if (!textarea) {
			console.warn('Waline textarea 未找到，尝试延迟重试')
			// 如果第一次没找到，再等待一段时间重试
			setTimeout(() => {
				const retryTextarea = document.querySelector('#waline-container .wl-textarea, #waline-container textarea') as HTMLTextAreaElement
				if (retryTextarea) {
					fillEssayReplyContent(retryTextarea, item)
				}
			}, 500)
			return
		}

		fillEssayReplyContent(textarea, item)
	}, 300)
}

function fillEssayReplyContent(textarea: HTMLTextAreaElement, item: FormattedItem) {
	// 获取要引用的内容
	const content = item.content.replace(/<[^>]*>/g, '').trim() // 移除 HTML 标签
	const time = item.displayTime

	// 构建引用内容
	let replyContent = ''
	if (content) {
		const lines = content.split('\n')
		replyContent = lines.map(line => `> ${line}`).join('\n')
		replyContent += '\n\n'
		replyContent += `> 发表于 ${time}\n\n`
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

onMounted(() => {
	window.scrollTo(0, 0)

	// 加载外部脚本和样式
	const loadScript = (src: string) => {
		return new Promise((resolve, reject) => {
			if (document.querySelector(`script[src="${src}"]`))
				return resolve(null)

			const script = document.createElement('script')
			script.src = src
			script.async = true
			script.onload = resolve
			script.onerror = reject
			document.head.appendChild(script)
		})
	}

	const loadStyle = (href: string) => {
		return new Promise((resolve, reject) => {
			if (document.querySelector(`link[href="${href}"]`))
				return resolve(null)

			const link = document.createElement('link')
			link.rel = 'stylesheet'
			link.href = href
			link.onload = resolve
			link.onerror = reject
			document.head.appendChild(link)
		})
	}

	// 并行加载 APlayer 和 Meting
	Promise.all([
		loadScript('/js/APlayer.min.js'),
		loadScript('/js/Meting.min.js'),
		loadStyle('/css/APlayer.min.css'),
	])
		.then(() => fetchEssays())
		.catch(err => console.error('脚本加载失败:', err))
})
</script>

<template>
<div class="page-essays">
	<!-- 标题区域 -->
	<div class="page-header">
		<div class="header-content">
			<h1 class="page-title">
				即刻短文
			</h1>
			<p class="page-subtitle">
				记录生活点滴，一些想法
			</p>
		</div>
		<div class="header-image">
			<img src="https://eimg.yujiay.wang/images/2025/12/27/-.jpg" alt="即刻短文">
		</div>
	</div>

	<div class="essays-list">
		<!-- 加载状态 -->
		<template v-if="loading">
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
					</div>
				</div>
			</div>
		</template>

		<!-- 错误状态 -->
		<template v-else-if="error">
			<div class="error-state">
				<div class="error-content">
					<Icon name="ph:alert-circle-bold" class="error-icon" />
					<h3>加载失败</h3>
					<p>获取短文数据时出现错误，请刷新页面重试</p>
					<button class="retry-btn" @click="fetchEssays">
						<Icon name="ph:refresh-bold" />
						重试
					</button>
				</div>
			</div>
		</template>

		<!-- 内容状态 -->
		<template v-else>
			<!-- 空状态 -->
			<div v-if="items.length === 0" class="empty-state">
				<Icon name="ph:chat-circle-bold" class="empty-icon" />
				<p>暂无内容</p>
			</div>

			<!-- 内容列表 -->
			<transition-group v-else name="essay-fade" tag="div">
				<div
					v-for="item in items"
					:key="item.id"
					class="essay-item"
					:style="{ '--delay': `${item.id * 0.05}s` }"
				>
					<div class="essay-meta">
						<div class="avatar">
							<img src="https://wsrv.nl/?url=github.com/zsxcoder.png" alt="avatar">
						</div>
						<div class="info">
							<div class="username">
								钟神秀
							</div>
							<div class="date">
								{{ item.displayTime }}
							</div>
						</div>
					</div>

					<div class="essay-content">
						<div class="text" v-html="item.content" />

						<!-- 网站分享卡片 -->
						<div v-if="item.extension?.type === 'website'" class="website-card gradient-card">
							<a
								:href="(item.extension.data as EchoExtension).site"
								target="_blank"
								rel="nofollow noreferrer"
							>
								<div class="card-content">
									<div class="card-icon">
										<Icon name="ph:globe-bold" />
									</div>
									<div class="card-info">
										<div class="card-title">{{ (item.extension.data as EchoExtension).title }}</div>
										<div class="card-url">{{ (item.extension.data as EchoExtension).site }}</div>
									</div>
									<div class="card-arrow">
										<Icon name="ph:arrow-right-bold" />
									</div>
								</div>
							</a>
						</div>

						<!-- 视频播放器 -->
						<div v-if="item.extension?.type === 'video'" class="video-player">
							<div class="video-wrapper">
								<iframe
									:src="`//player.bilibili.com/player.html?bvid=${item.extension.data}&autoplay=0`"
									scrolling="no"
									frameborder="no"
									allowfullscreen="true"
									loading="lazy"
								/>
							</div>
							<a
								class="video-link"
								:href="`https://www.bilibili.com/video/${item.extension.data}`"
								target="_blank"
								rel="nofollow noreferrer"
							>
								<Icon name="ph:link-bold" />
								查看原视频
							</a>
						</div>

						<!-- 音乐播放器 -->
						<ClientOnly>
							<div v-show="item.extension?.type === 'music'" class="music-player">
								<meting-js
									:id="item.extension?.type === 'music' ? getMusicId(item.extension.data as string) : ''"
									:server="item.extension?.type === 'music' ? getMusicServer(item.extension.data as string) : 'netease'"
									:type="item.extension?.type === 'music' ? getMusicType(item.extension.data as string) : 'song'"
									theme="#448aff"
									list-folded="true"
									list-max-height="200"
								/>
							</div>
						</ClientOnly>

						<!-- 标签 -->
						<div v-if="item.tags && item.tags.length > 0" class="essay-tags">
							<span v-for="tag in item.tags" :key="tag.id" class="tag">
								{{ tag.name }}
							</span>
						</div>
					</div>

					<div class="essay-bottom">
						<div class="date-full">
							{{ item.date }}
						</div>
						<div class="stats">
							<button class="comment-btn" title="评论" @click="replyToEssay(item)">
								<Icon name="ph:chats-bold" />
							</button>
							<div v-if="item.favCount > 0" class="fav-count">
								<Icon name="ph:heart-bold" />
								{{ item.favCount }}
							</div>
						</div>
					</div>
				</div>
			</transition-group>

			<div class="essays-footer">
				<p>共 {{ items.length }} 条短文</p>
			</div>
		</template>
	</div>

	<!-- Waline 评论组件 -->
	<client-only>
		<Waline path="/essays" title="即刻短文" />
	</client-only>
</div>
</template>

<style lang="scss" scoped>
.page-essays {
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

/* 短文列表 */
.essays-list {
  animation: float-in 0.2s backwards;
}

.essay-item {
  border-radius: 8px;
  box-shadow: 0 0 0 1px var(--c-bg-soft);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 1.25rem;
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.3s ease, transform 0.3s ease;
  background-color: var(--c-bg-1);

  &:hover {
    box-shadow: 0 0 0 1px var(--c-primary-soft);
  }
}

.essay-meta {
  display: flex;
  align-items: center;
  gap: 10px;

  .avatar {
    width: 3em;
    height: 3em;
    border-radius: 50%;
    overflow: hidden;
    border: 2px solid var(--c-primary-soft);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .info {
    .username {
      font-weight: 600;
      color: var(--c-text);
    }

    .date {
      font-size: 0.8rem;
      color: var(--c-text-3);
      font-family: var(--font-monospace);
    }
  }
}

.essay-content {
  color: var(--c-text-2);
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  :deep(.essay-link) {
    margin: -0.1em -0.2em;
    padding: 0.1em 0.2em;
    background: linear-gradient(var(--c-primary-soft), var(--c-primary-soft)) no-repeat center bottom / 100% 0.1em;
    color: var(--c-primary);
    text-decoration: none;
    transition: all 0.2s;

    &:hover {
      border-radius: 0.3em;
      background-size: 100% 100%;
    }
  }

  :deep(strong) {
    font-weight: 600;
    color: var(--c-text);
  }

  /* 列表样式 */
  :deep(ul) {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
    list-style: disc;
  }

  :deep(li) {
    margin: 0.25rem 0;
    color: var(--c-text-2);
    line-height: 1.6;
  }

  /* 待办事项样式 */
  :deep(.todo-item) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    list-style: none;
    padding-left: 0;
  }

  :deep(.todo-item.checked) {
    text-decoration: line-through;
    opacity: 0.6;
  }
}

/* 标签样式 */
.essay-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.essay-tags .tag {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 4px;
  background-color: var(--c-primary-soft);
  color: var(--c-primary);
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: var(--c-primary);
    color: white;
  }
}

/* 卡片样式 */
.gradient-card {
  overflow: hidden;
  background-color: var(--c-bg-2);
  box-shadow: 0 0 0 1px var(--c-bg-soft);
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 0 0 1px var(--c-primary-soft);
  }

  a {
    display: flex;
    text-decoration: none;
    color: inherit;
  }

  .card-content {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
  }

  .card-icon {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background-color: var(--c-primary-soft);
    color: var(--c-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }

  .card-info {
    flex: 1;
    min-width: 0;

    .card-title {
      font-weight: 600;
      color: var(--c-text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .card-url,
    .card-id {
      font-size: 0.85rem;
      color: var(--c-text-3);
      margin-top: 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .card-arrow {
    flex-shrink: 0;
    color: var(--c-text-3);
    font-size: 1.2rem;
    transition: transform 0.2s;
  }

  &:hover {
    .card-arrow {
      transform: translateX(4px);
    }
  }
}

.website-card .card-icon {
  background-color: #e3f2fd;
  color: #1976d2;
}

/* 视频播放器样式 */
.video-player {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  .video-wrapper {
    position: relative;
    width: 100%;
    max-width: 600px;
    padding-bottom: 42%; /* 较小的 16:9 宽高比 */
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--c-bg-2);
    box-shadow: 0 0 0 1px var(--c-bg-soft);

    @media (max-width: 768px) {
      max-width: 100%;
      padding-bottom: 56.25%; /* 移动端恢复标准比例 */
    }

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
    }
  }

  .video-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid var(--c-border);
    border-radius: 6px;
    background-color: var(--c-bg-1);
    color: var(--c-text-2);
    font-size: 0.9rem;
    text-decoration: none;
    transition: all 0.2s;

    &:hover {
      background-color: var(--c-primary-soft);
      border-color: var(--c-primary);
      color: var(--c-primary);
    }
  }
}

/* 音乐播放器样式 */
.music-player {
  margin-top: 0.5rem;

  :deep(.aplayer) {
    box-shadow: 0 0 0 1px var(--c-bg-soft);
    border-radius: 8px;
    background-color: var(--c-bg-2) !important;
  }

  :deep(.aplayer .aplayer-pic) {
    border-radius: 8px 0 0 8px;
    background-color: var(--c-bg-2);
  }

  :deep(.aplayer .aplayer-info) {
    background-color: var(--c-bg-2);
  }

  /* 歌曲信息文字 */
  :deep(.aplayer .aplayer-music .aplayer-title) {
    color: var(--c-text) !important;
  }

  :deep(.aplayer .aplayer-music .aplayer-author) {
    color: var(--c-text-2) !important;
  }

  /* 控制按钮 */
  :deep(.aplayer .aplayer-controller .aplayer-bar-wrap .aplayer-bar) {
    background-color: var(--c-bg-3);
  }

  :deep(.aplayer .aplayer-controller .aplayer-bar-wrap .aplayer-bar .aplayer-loaded) {
    background-color: var(--c-bg-soft);
  }

  :deep(.aplayer .aplayer-controller .aplayer-bar-wrap .aplayer-bar .aplayer-played) {
    background-color: var(--c-primary);
  }

  :deep(.aplayer .aplayer-controller .aplayer-bar-wrap .aplayer-thumb) {
    background-color: var(--c-primary);
  }

  /* 控制按钮图标 */
  :deep(.aplayer .aplayer-icon) {
    color: var(--c-text-2);
  }

  :deep(.aplayer .aplayer-icon:hover) {
    color: var(--c-primary);
  }

  /* 歌词样式 */
  :deep(.aplayer .aplayer-lrc) {
    background-color: transparent !important;
  }

  :deep(.aplayer .aplayer-lrc p) {
    color: var(--c-text-2);
  }

  :deep(.aplayer .aplayer-lrc p.aplayer-lrc-current) {
    color: var(--c-primary) !important;
    font-weight: 600;
  }

  /* 播放列表 */
  :deep(.aplayer .aplayer-list) {
    background-color: var(--c-bg-1) !important;
  }

  :deep(.aplayer .aplayer-list ol li) {
    border-top: 1px solid var(--c-bg-soft);
    color: var(--c-text-2);
  }

  :deep(.aplayer .aplayer-list ol li:hover) {
    background-color: var(--c-bg-2) !important;
  }

  :deep(.aplayer .aplayer-list ol li.aplayer-list-light) {
    background-color: var(--c-primary-soft) !important;
    color: var(--c-primary) !important;
  }

  :deep(.aplayer .aplayer-list ol li .aplayer-list-index) {
    color: var(--c-text-3);
  }

  /* 时间显示 */
  :deep(.aplayer .aplayer-time) {
    color: var(--c-text-3) !important;
  }

  /* 音量控制 */
  :deep(.aplayer .aplayer-volume-wrap) {
    background-color: var(--c-bg-2);
  }

  :deep(.aplayer .aplayer-volume-wrap .aplayer-volume-bar-wrap .aplayer-volume-bar) {
    background-color: var(--c-bg-3);
  }

  :deep(.aplayer .aplayer-volume-wrap .aplayer-volume-bar-wrap .aplayer-volume-bar .aplayer-volume-bar-current) {
    background-color: var(--c-primary);
  }

  /* 遮罩层 - 移除 */
  :deep(.aplayer .aplayer-lrc::before) {
    background: transparent !important;
  }

  :deep(.aplayer .aplayer-lrc::after) {
    background: transparent !important;
  }

  /* 进度条容器样式 */
  :deep(.aplayer .aplayer .aplayer-lrc-content) {
    height: 100px !important;
  }

  :deep(.aplayer .aplayer .aplayer-lrc p) {
    margin: 8px 0 !important;
    line-height: 1.4 !important;
  }

  /* 调整播放器内部间距 */
  :deep(.aplayer .aplayer-body) {
    position: relative !important;
  }
}

.essay-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
  border-top: 1px solid var(--c-bg-soft);
  color: var(--c-text-3);

  .date-full {
    font-size: 0.8rem;
    font-family: var(--font-monospace);
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
  }

  .fav-count {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.85rem;
    color: var(--c-danger);
  }
}

/* 底部提示 */
.essays-footer {
  text-align: center;
  padding: 2rem 0;
  color: var(--c-text-3);
  font-size: 0.9rem;
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
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  background-color: var(--c-bg-1);
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
  width: 80px;
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

/* 过渡动画 */
.essay-fade-enter-active,
.essay-fade-leave-active {
  transition: all 0.3s ease;
}

.essay-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.essay-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
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
</style>
