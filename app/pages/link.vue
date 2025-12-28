<script setup lang="ts">
import { computed } from 'vue'
import FlinkTopCard from '~/components/link/FlinkTopCard.vue'
import FriendLinkCard from '~/components/partial/FriendLinkCard.vue'
import feeds from '~/feeds'

const appConfig = useAppConfig()

useSeoMeta({
	title: '友链',
	ogType: 'profile',
	description: `${appConfig.title}的友链页面，收集了添加他为友链的网站和他订阅的网站列表。`,
})

const copyFields = {
	博主: '钟神秀',
	标题: '钟神秀 (@ZSXCoder)',
	介绍: '造化钟神秀，阴阳割昏晓。',
	网址: 'https://home.zsxcoder.top/',
	头像: 'https://home.zsxcoder.top/api/avatar.png',
}

// 分类友链
const categorizedFeeds = computed(() => {
	return feeds.reduce((acc: Record<string, any[]>, category) => {
		acc[category.name] = category.entries || []
		return acc
	}, {} as Record<string, any[]>)
})

const activeCategory = ref(feeds[0]?.name || '')
const isTransitioning = ref(false)

function handleCategoryChange(category: string) {
	if (isTransitioning.value)
		return
	isTransitioning.value = true
	activeCategory.value = category
	setTimeout(() => {
		isTransitioning.value = false
	}, 300)
}

// 复制到剪贴板功能
async function copyToClipboard(text: string, prompt: string) {
	try {
		await navigator.clipboard.writeText(text)
		showToast(`已复制${prompt}`)
	}
	catch (err) {
		console.error('复制失败:', err)
		showToast('复制失败，请重试')
	}
}

// 显示提示消息
function showToast(message: string) {
	const toast = document.createElement('div')
	toast.textContent = message
	toast.style.position = 'fixed'
	toast.style.top = '20px'
	toast.style.left = '50%'
	toast.style.transform = 'translateX(-50%)'
	toast.style.backgroundColor = 'var(--c-primary)'
	toast.style.color = 'white'
	toast.style.padding = '0.8rem 1.5rem'
	toast.style.borderRadius = '8px'
	toast.style.zIndex = '1000'
	toast.style.fontSize = '0.9rem'
	toast.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'

	document.body.appendChild(toast)

	setTimeout(() => {
		document.body.removeChild(toast)
	}, 3000)
}
</script>

<template>
<div class="page-links">
	<!-- 我的博客信息 -->
	<div class="my-blog-section">
		<div class="my-blog-card">
			<!-- 头像和基本信息 -->
			<div class="blog-header">
				<div class="avatar-wrapper">
					<img :src="copyFields.头像" :alt="copyFields.博主" class="blog-avatar">
					<span class="blog-owner-badge">博主</span>
				</div>
				<div class="blog-main-info">
					<h3 class="blog-name">
						{{ copyFields.博主 }}
					</h3>
					<p class="blog-subtitle">
						{{ copyFields.标题 }}
					</p>
				</div>
			</div>

			<!-- 博客描述 -->
			<div class="blog-content">
				<p class="blog-desc">
					{{ copyFields.介绍 }}
				</p>
			</div>

			<!-- 复制按钮 -->
			<div class="blog-actions">
				<div class="copy-buttons">
					<template v-for="(code, prompt) in copyFields" :key="prompt">
						<div class="copy-item">
							<span class="copy-label">{{ prompt }}</span>
							<span class="copy-value">{{ code }}</span>
							<button class="copy-btn" @click="copyToClipboard(code, prompt)">
								复制
							</button>
						</div>
					</template>
				</div>
			</div>
		</div>
	</div>

	<FlinkTopCard />

	<!-- 友链分类标签 -->
	<div class="categories-section">
		<h2 class="section-title">
			友链分类
		</h2>
		<div class="category-tabs">
			<button
				v-for="category in Object.keys(categorizedFeeds)"
				:key="category"
				class="category-tab"
				:class="{ active: activeCategory === category }"
				@click="handleCategoryChange(category)"
			>
				{{ category }}
			</button>
		</div>
	</div>

	<!-- 友链网格 -->
	<div class="feeds-section">
		<div class="feeds-grid" :class="{ 'is-transitioning': isTransitioning }">
			<FriendLinkCard
				v-for="feed in categorizedFeeds[activeCategory]"
				:key="feed.link"
				:site-name="feed.author"
				:sitenick="feed.sitenick || feed.author"
				:site-url="feed.link"
				:site-desc="feed.desc"
				:site-icon="feed.avatar"
				:date="feed.date"
				:upstream="feed.upstream || false"
				:qrcode="feed.qrcode || ''"
				:recommend="feed.recommend || false"
			/>
		</div>
	</div>

	<!-- 申请友链 -->
	<div class="apply-section">
		<h2>申请友链</h2>

		<div class="apply-content">
			<!-- 申请要求 -->
			<div class="apply-block">
				<h3>申请要求</h3>
				<ul class="apply-list">
					<li>
						<span class="check-icon">✓</span>
						<span>能够<strong>长期更新维护</strong>，并输出<strong>有价值的原创内容</strong></span>
					</li>
					<li>
						<span class="check-icon">✓</span>
						<span>可以参考 <a href="https://www.travellings.cn/docs/join.html" target="_blank" rel="noopener">加入开往</a> 页面的规则</span>
					</li>
				</ul>
			</div>

			<!-- 申请方式 -->
			<div class="apply-block">
				<h3>申请方式</h3>
				<div class="apply-method">
					<p>
						在<ZBadge link="https://github.com/zsxcoder/homepage-v5/tree/main/app/feeds.ts" icon="ri:github-line">
							仓库
						</ZBadge>添加Pr或发送邮件到：
					</p>
					<div class="email-box">
						<span class="email-text">3149261770@qq.com</span>
						<button class="copy-email-btn" @click="copyToClipboard('3149261770@qq.com', '邮箱')">
							复制
						</button>
					</div>

					<p>邮件标题注明：</p>
					<code class="email-subject">友链申请: 你的昵称</code>

					<p>附上友链信息：</p>
					<div class="friend-link-info">
						<div class="info-placeholder">
							博客名称、描述、地址、头像等信息
						</div>
						<div class="info-tip">
							任意格式均可，包含基本信息即可
						</div>
					</div>
				</div>
			</div>

			<!-- 注意事项 -->
			<div class="apply-block">
				<h3>注意事项</h3>
				<div class="notice-box">
					<strong>注意：</strong>信息可能会被适当修改，以保证展示效果
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<style scoped lang="scss">
.page-links {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* 我的博客信息区域 */
.my-blog-section {
  margin-bottom: 2.5rem;
}

.my-blog-card {
  background: var(--c-bg-2);
  border: 1px solid var(--c-border);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  max-width: 800px;
  margin: 0 auto;

  &:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  }
}

.blog-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.blog-avatar {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  object-fit: cover;
  border: 1.5px solid var(--c-border);
}

.blog-owner-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--c-primary);
  color: white;
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 0.65rem;
  font-weight: 600;
  z-index: 5;
}

.blog-main-info {
  flex: 1;
}

.blog-name {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--c-text);
}

.blog-subtitle {
  font-size: 1rem;
  color: var(--c-text-2);
  margin: 0;
  font-weight: 500;
}

.blog-content {
  margin-bottom: 1.5rem;
}

.blog-desc {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--c-text);
  margin: 0;
  padding: 0.8rem;
  background: var(--c-bg-1);
  border-radius: 10px;
  border-left: 3px solid var(--c-primary);
}

.copy-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
}

.copy-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.8rem;
  background: var(--c-bg-1);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.875rem;
}

.copy-label {
  color: var(--c-text-2);
  font-weight: 500;
}

.copy-value {
  color: var(--c-text);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.copy-btn {
  padding: 0.2rem 0.6rem;
  background: var(--c-primary-soft);
  color: var(--c-primary);
  border: 1px solid var(--c-primary);
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--c-primary);
    color: white;
  }
}

/* 友链分类区域 */
.categories-section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--c-text);
  margin-bottom: 1.25rem;
  text-align: center;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.category-tab {
  padding: 0.6rem 1.75rem;
  border-radius: 25px;
  background: var(--c-bg-2);
  border: 1px solid var(--c-border);
  color: var(--c-text-2);
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
  font-size: 0.95rem;

  &:hover {
    background: var(--c-primary-soft);
    color: var(--c-primary);
    border-color: var(--c-primary);
  }

  &.active {
    background: var(--c-primary);
    color: white;
    border-color: var(--c-primary);
  }
}

/* 友链网格区域 */
.feeds-section {
  margin-bottom: 3rem;
}

.feeds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  justify-content: center;
  transition: opacity 0.3s ease;

  &.is-transitioning {
    opacity: 0.5;
  }
}

/* 申请友链区域 */
.apply-section {
  background: var(--c-bg-2);
  border: 1px solid var(--c-border);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;

  > h2 {
    font-size: 1.6rem;
    font-weight: 700;
    color: var(--c-text);
    margin: 0 0 1.5rem 0;
    text-align: center;
  }
}

.apply-content {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--c-text);
}

.apply-block {
  margin-bottom: 1.75rem;

  &:last-child {
    margin-bottom: 0;
  }

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--c-text);
    margin: 0 0 1rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      background: var(--c-primary);
      border-radius: 50%;
    }
  }
}

.apply-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    display: flex;
    align-items: flex-start;
    margin-bottom: 0.75rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.check-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: var(--c-primary-soft);
  color: var(--c-primary);
  border-radius: 50%;
  font-weight: 600;
  margin-right: 0.75rem;
  flex-shrink: 0;
  font-size: 0.75rem;
}

.apply-method {
  p {
    margin: 0 0 0.75rem 0;
  }

  a {
    color: var(--c-primary);
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}

.email-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--c-bg-1);
  border-radius: 8px;
  border: 1px solid var(--c-border);
  margin-bottom: 1rem;
}

.email-text {
  flex: 1;
  font-family: monospace;
  font-size: 0.95rem;
  color: var(--c-primary);
  font-weight: 600;
}

.copy-email-btn {
  padding: 0.3rem 0.8rem;
  background: var(--c-primary-soft);
  color: var(--c-primary);
  border: 1px solid var(--c-primary);
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--c-primary);
    color: white;
  }
}

.email-subject {
  display: inline-block;
  background: var(--c-primary-soft);
  color: var(--c-primary);
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: monospace;
  font-weight: 600;
  margin-bottom: 1rem;
}

.friend-link-info {
  background: var(--c-bg-1);
  border: 2px dashed var(--c-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  text-align: center;
}

.info-placeholder {
  font-family: monospace;
  font-size: 1rem;
  color: var(--c-primary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.info-tip {
  font-size: 0.9rem;
  color: var(--c-text-2);
}

.notice-box {
  background: var(--c-bg-1);
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  color: var(--c-text);

  strong {
    color: var(--c-primary);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .page-links {
    padding: 1rem 0.5rem;
  }

  .my-blog-card {
    padding: 1.5rem;
  }

  .blog-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .blog-name {
    font-size: 1.25rem;
  }

  .blog-avatar {
    width: 80px;
    height: 80px;
  }

  .copy-buttons {
    justify-content: center;
  }

  .copy-item {
    width: 100%;
    justify-content: space-between;
  }

  .copy-value {
    flex: 1;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .category-tab {
    padding: 0.5rem 1.25rem;
    font-size: 0.875rem;
  }

  .feeds-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .apply-section {
    padding: 1.5rem;
  }

  .email-box {
    flex-direction: column;
    text-align: center;
  }

  .email-text {
    word-break: break-all;
  }
}

@media (max-width: 480px) {
  .page-links {
    padding: 0.75rem 0.25rem;
  }

  .my-blog-card {
    padding: 1rem;
  }

  .blog-name {
    font-size: 1.15rem;
  }

  .blog-subtitle {
    font-size: 0.875rem;
  }

  .blog-desc {
    font-size: 0.9rem;
    padding: 0.6rem;
  }

  .section-title {
    font-size: 1.35rem;
  }

  .category-tab {
    padding: 0.4rem 1rem;
    font-size: 0.825rem;
  }

  .apply-section {
    padding: 1rem;
  }

  .apply-block h3 {
    font-size: 1rem;
  }

  .friend-link-info {
    padding: 1rem;
  }
}
</style>
