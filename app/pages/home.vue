<script setup lang="ts">
useHead({ title: '' })
definePageMeta({
	alias: ['/'],
	title: '主页',
})
// const appConfig = useAppConfig()

const leftTags = [
	{ text: '大学普通牛马一名', delay: 0 },
	{ text: '什么都会一点点', delay: 0.6 },
	{ text: '安卓 用户', delay: 1.2 },
	{ text: 'Windows 11 用户', delay: 1.8 },
]

const rightTags = [
	{ text: 'Vue', delay: 0 },
	{ text: 'Astro', delay: 0.6 },
	{ text: 'TypeScript', delay: 1.2 },
	{ text: 'Nuxt.js', delay: 1.8 },
]

// 只在客户端加载脚本
if (process.client) {
	onMounted(() => {
		window.scrollTo(0, 0)
		// 动态加载外部 JS 脚本
		/*
		const loadScript = (url: string, callback?: () => void) => {
			return new Promise<void>((resolve, reject) => {
				// 检查是否已加载
				if (document.querySelector(`script[src="${url}"]`)) {
					resolve()
					return
				}

				// 创建 script 标签
				const script = document.createElement('script')
				script.src = url
				script.type = 'text/javascript'
				script.async = true // 异步加载（不阻塞页面渲染）

				// 加载成功回调
				script.onload = () => {
					callback?.()
					resolve()
				}

				// 加载失败回调
				script.onerror = (err) => {
					console.error('脚本加载失败', err)
					reject(err)
				}

				// 添加到 DOM（推荐添加到 head 或 body 末尾）
				document.head.appendChild(script)
			})
		}
		*/

		// loadScript('https://www.myxz.top/assets/js/about.js')
		// 	.then(() => {
		// 	})
		// 	.catch((err) => {
		// 		console.error('友链顶部重要JS加载完毕', err)
		// 	})
	})
}
</script>

<template>
<div class="home-container">
	<ZhiluAvatar class="avatar-bg" />

	<!-- 顶部渐变背景区域 -->
	<div class="header-section">
		<AboutUser :left-tags="leftTags" :right-tags="rightTags" />
	</div>

	<!-- 主要内容区域 -->
	<div class="main-content">
		<div class="section-title">
			关于本站
		</div>

		<!-- 介绍部分 -->
		<AboutIntroduce />

		<!-- 技能卡片 -->
		<AboutSkill />

		<!-- 性格卡片 -->
		<AboutPersonality />

		<!-- 爱好游戏 -->
		<AboutGames />

		<!-- 近期活动卡片 -->
		<div class="card activity-card">
			<h3 class="card-title">
				📅 近期活动
			</h3>
			<div class="card-content">
				<div class="timeline-item">
					<div class="timeline-date">
						2025年12月
					</div>
					<p>重构了<ZLink to="https://blog.zsxcoder.top">博客</ZLink>以及开始主页的修改。</p>
				</div>
				<div class="timeline-item">
					<div class="timeline-date">
						2025年2月
					</div>
					<p>第一次搭建 纸鹿 大佬的<ZLink to="https://github.com/L33Z22L11/blog-v3" icon="ri:github-line">个人博客</ZLink>自用。</p>
				</div>
				<div class="timeline-item">
					<div class="timeline-date">
						2024年11月
					</div>
					<p>开始我的博客之旅</p>
					<!-- <p>完善<ZLink to="https://wiki.cooo.site/">西邮Wiki</ZLink></p> -->
				</div>
			</div>
		</div>

		<!-- 关于主页卡片 -->
		<div class="card about-site-card">
			<h3 class="card-title">
				🏠 关于主页
			</h3>
			<div class="card-content">
				<p>在2025年开始用过一次，目前(2025/12/17~?)开始且使用。</p>
				<p>
					感谢
					<ZBadge link="https://github.com/L33Z22L11">
						纸鹿大佬
					</ZBadge>
					的开源项目分享。
				</p>
				<p>
					魔改参考
					<ZLink to="https://github.com/MC-YCY/blog-ui" icon="ri:github-line">MC-YCY/blog-ui</ZLink>的前端代码
					。
				</p>
				<p>
					魔改代码开源在
					<ZLink to="https://github.com/zsxcoder/homepage-v5" icon="ri:github-line">zsxcoder/homepage-v5</ZLink>
					上。
				</p>
				<div class="fork-list">
					<p>欢迎使用~</p>
					<!-- <ZBadge v-for="item in appConfig.fork" :key="item.link" v-bind="item" /> -->
				</div>
			</div>
		</div>
	</div>

	<!-- Waline 评论组件 -->
	<client-only>
		<Waline path="/home" title="主页" />
	</client-only>
</div>
</template>

<style lang="scss" scoped>
.home-container {
	margin: 1rem;
	position: relative;

	@media (max-width: 480px) {
		margin: 0.25rem 0.125rem;
	}
}

.avatar-bg {
	position: fixed;
	opacity: 0.1;
	top: 0;
	right: 20vw;
	margin-right: -0.4em;
	font-size: min(100vw, 60vh);
	z-index: -1;
}

/* 顶部渐变背景区域 */
.header-section {
	background: linear-gradient(180deg, rgba(196, 255, 255, 0.3) 0%, rgba(0, 0, 0, 0) 100%);
	padding: 6rem 1rem 1rem;
	margin: -1rem -1rem 0 -1rem;
}

/* 主要内容区域 */
.main-content {
	max-width: 1400px;
	margin: 0 auto;
	padding: 0 1rem 2rem;

	@media (max-width: 480px) {
		padding: 0 0.125rem 1rem;
	}
}

.section-title {
	font-size: 2.25rem;
	font-weight: 700;
	color: var(--c-text);
	opacity: 0.9;
	text-align: center;
	margin-bottom: 2.5rem;
}

/* 内容卡片区域 */
.content-cards {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 1rem;
	margin-bottom: 2rem;
}

.card {
	background: var(--c-bg-2);
	border: 1px solid var(--c-border);
	border-radius: 1rem;
	padding: 1.25rem 2.5rem;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
	transition: transform 0.2s, box-shadow 0.2s;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}
}

.card-title {
	font-size: 1.5rem;
	font-weight: 700;
	margin: 0 0 1rem 0;
	line-height: 1.3;
}

.card-content {
	margin-bottom: 1rem;
}

/* 近期活动卡片 */
.activity-card {
	.timeline-item {
		padding: 0.75rem 0;
		border-left: 2px solid var(--c-border);
		padding-left: 1rem;
		position: relative;

		&::before {
			content: '';
			position: absolute;
			left: -5px;
			top: 1rem;
			width: 8px;
			height: 8px;
			background: var(--c-primary);
			border-radius: 50%;
		}

		&:last-child {
			border-left-color: transparent;
		}
	}

	.timeline-date {
		font-size: 0.75rem;
		color: var(--c-text-2);
		margin-bottom: 0.25rem;
		font-weight: 600;
	}

	p {
		margin: 0;
		font-size: 0.875rem;
		line-height: 1.6;
	}
}

/* 关于主页卡片 */
.about-site-card {
	.card-content {
		p {
			margin: 0 0 0.75rem 0;
			font-size: 0.875rem;
			line-height: 1.6;

			&:last-child {
				margin-bottom: 0;
			}
		}
	}

	.fork-list {
		margin-top: 1rem;

		p {
			font-size: 0.75rem;
			color: var(--c-text-2);
			margin-bottom: 0.5rem;
		}

		:deep(.z-badge) {
			margin-right: 0.5rem;
			margin-bottom: 0.5rem;
		}
	}
}

/* 响应式 */
@media (max-width: 768px) {
	.header-section {
		padding: 3rem 1rem 1rem;
	}

	.main-content {
		padding: 0 1rem 2rem;
	}

	.card {
		padding: 1rem;
	}
}

@media (max-width: 480px) {
	.header-section {
		padding: 2rem 0.25rem 1rem;
		margin: -0.25rem -0.125rem 0 -0.125rem;
	}

	.section-title {
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}

	.card {
		padding: 0.375rem 0.5rem;

		&.activity-card,
		&.about-site-card {
			padding: 0.5rem;
		}
	}

	.card-title {
		font-size: 1.125rem;
		margin-bottom: 0.5rem;
	}
}
</style>
