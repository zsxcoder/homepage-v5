<script setup lang="ts">
import { sponsors } from '~/data/sponsors'
import { ref, reactive } from 'vue'

// SEO 配置
useSeoMeta({
	title: '赞助支持',
	description: '您的每一份支持都是我们前进的动力。',
})

// 二维码卡片引用和效果状态
const qrCardRefs = ref<HTMLElement[]>([])
const qrCardEffects = reactive<Record<number, { x: number; y: number; show: boolean }>>({})

// 鼠标移动处理
function handleQrCardMouseMove(event: MouseEvent, index: number) {
	const card = qrCardRefs.value[index]
	if (!card) return

	const rect = card.getBoundingClientRect()
	qrCardEffects[index] = {
		x: event.clientX - rect.left,
		y: event.clientY - rect.top,
		show: true,
	}
}

// 鼠标离开处理
function handleQrCardMouseLeave(index: number) {
	if (qrCardEffects[index]) {
		qrCardEffects[index].show = false
	}
}
</script>

<template>
	<div class="page-sponsor">
		<!-- 标题区域 -->
		<div class="page-header">
			<div class="header-content">
				<h1 class="page-title">
					赞助支持
				</h1>
				<p class="page-subtitle">
					您的每一份支持都是我们前进的动力，让我们共同创造更多可能 ✨
				</p>
			</div>
			<div class="header-icon">
				<Icon name="ph:heart-bold" class="heart-icon" />
			</div>
		</div>

		<!-- 二维码区域 -->
		<div class="qr-section">
			<div
				v-for="(qr, index) in [
					{ name: '微信支付', icon: 'ph:chat-circle-dots', color: '#07c160', img: 'https://cdn.jsdelivr.net/gh/mcyzsx/picx-images-hosting@master/links/weixin.webp', desc: '扫一扫，请我喝杯咖啡' },
					{ name: '支付宝', icon: 'ri:alipay-fill', color: '#1677ff', img: 'https://cdn.jsdelivr.net/gh/mcyzsx/picx-images-hosting@master/links/alipay.webp', desc: '扫一扫，请我喝杯咖啡' },
					{ name: '爱发电支持', icon: 'ph:heart', color: '#ec4899', img: 'https://imgbed.mcyzsx.top/file/custom/Vuaj4DpO.jpg', desc: '在爱发电上支持我', link: 'https://afdian.com/a/zsxcoder' },
				]"
				:key="index"
				:ref="(el: any) => { if (el) qrCardRefs[index] = el }"
				class="qr-card gradient-card"
				@mousemove="(event) => handleQrCardMouseMove(event, index)"
				@mouseleave="() => handleQrCardMouseLeave(index)"
			>
				<!-- 鼠标跟随效果 -->
				<div
					v-if="qrCardEffects[index]?.show"
					class="qr-glow"
					:style="{
						left: qrCardEffects[index]?.x - 80 + 'px',
						top: qrCardEffects[index]?.y - 80 + 'px',
						background: `radial-gradient(circle, ${qr.color} 0%, ${qr.color}33 30%, ${qr.color}1A 60%, transparent 90%)`,
					}"
				></div>

				<div class="qr-header">
					<Icon :name="qr.icon" class="qr-icon" :style="{ color: qr.color }" />
					<h3>{{ qr.name }}</h3>
				</div>

				<div class="qr-placeholder">
					<img :src="qr.img" :alt="qr.name">
				</div>

				<p class="qr-description">{{ qr.desc }}</p>

				<a v-if="qr.link" :href="qr.link" class="qr-link" target="_blank" rel="nofollow">
					<Icon name="ph:arrow-square-out-bold" />
					前往爱发电
				</a>
			</div>
		</div>

		<!-- 提示信息 -->
		<div class="notice-card gradient-card">
			<div class="notice-icon">
				<Icon name="ph:info-bold" />
			</div>
			<div class="notice-content">
				<p class="notice-text">
					<strong>重要提示：</strong>赞助了一定要给 <a href="mailto:3149261770@qq.com" class="email-link">3149261770@qq.com</a> 发邮件，表明渠道和单号，和你自己名称和内容，否则我认不清可能加不上。
				</p>
			</div>
		</div>

		<!-- 赞助名单 -->
		<div class="sponsors-section">
			<div class="section-header">
				<h2 class="section-title">
					<Icon name="ph:users-bold" />
					赞助名单
				</h2>
			</div>

			<div class="sponsors-list">
				<div v-for="(sponsor, index) in sponsors" :key="index" class="sponsor-item gradient-card">
					<div class="sponsor-avatar">
						<img v-if="sponsor.avatar" :src="sponsor.avatar" :alt="sponsor.name">
						<Icon v-else name="ph:user-bold" class="default-avatar" />
					</div>
					<div class="sponsor-info">
						<div class="sponsor-name">{{ sponsor.name }}</div>
						<div class="sponsor-meta">
							<span class="sponsor-date">{{ sponsor.date }}</span>
							<span class="sponsor-amount">{{ sponsor.amount }}</span>
						</div>
					</div>
				</div>

				<!-- 空状态 -->
				<div v-if="sponsors.length === 0" class="empty-state">
					<Icon name="ph:heart-break-bold" class="empty-icon" />
					<p>暂无赞助记录，期待您的支持！</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.page-sponsor {
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
		text-align: center;
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

.header-icon {
	flex-shrink: 0;
	width: 120px;
	height: 120px;
	display: flex;
	align-items: center;
	justify-content: center;

	.heart-icon {
		font-size: 5rem;
		color: var(--c-danger);
	}
}

/* 二维码区域 */
.qr-section {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 1.5rem;
	margin-bottom: 2rem;
}

.qr-card {
	position: relative;
	overflow: hidden;
	padding: 1.5rem;
	text-align: center;
	border-radius: 12px;
	background-color: var(--c-bg-1);
	box-shadow: 0 0 0 1px var(--c-bg-soft);
	transition: all 0.2s ease;

	&:hover {
		box-shadow: 0 0 0 1px var(--c-primary-soft);
	}
}

.qr-glow {
	position: absolute;
	width: 160px;
	height: 160px;
	border-radius: 50%;
	blur-3xl: 1;
	transition: all 0.075s ease-out;
	pointer-events: none;
	z-index: 0;
}

.qr-header {
	position: relative;
	z-index: 1;
	margin-bottom: 1rem;
}

.qr-icon {
	font-size: 2rem;
	margin-bottom: 0.5rem;
	display: block;
}

.qr-card h3 {
	font-size: 1.125rem;
	font-weight: 600;
	color: var(--c-text);
	margin: 0;
}

.qr-placeholder {
	position: relative;
	z-index: 1;
	width: 160px;
	height: 160px;
	background-color: var(--c-bg-2);
	border-radius: 8px;
	margin: 0 auto 1rem;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0 0 1px var(--c-bg-soft);

	img {
		width: 140px;
		height: 140px;
		border-radius: 6px;
	}
}

.qr-description {
	position: relative;
	z-index: 1;
	color: var(--c-text-3);
	font-size: 0.875rem;
	margin-bottom: 0.75rem;
}

.qr-link {
	position: relative;
	z-index: 1;
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	background-color: var(--c-bg-2);
	color: var(--c-text-2);
	text-decoration: none;
	padding: 0.5rem 1rem;
	border-radius: 6px;
	font-size: 0.875rem;
	font-weight: 500;
	border: 1px solid var(--c-bg-soft);
	transition: all 0.2s ease;

	&:hover {
		background-color: var(--c-primary-soft);
		border-color: var(--c-primary);
		color: var(--c-primary);
	}
}

/* 提示卡片 */
.notice-card {
	display: flex;
	align-items: flex-start;
	gap: 1rem;
	padding: 1.25rem;
	margin-bottom: 2rem;
	background-color: var(--c-bg-1);
	border-radius: 8px;
	box-shadow: 0 0 0 1px var(--c-bg-soft);

	.notice-icon {
		flex-shrink: 0;
		width: 1.5rem;
		height: 1.5rem;
		color: var(--c-primary);
		font-size: 1.25rem;
		margin-top: 0.125rem;
	}

	.notice-content {
		flex: 1;
	}

	.notice-text {
		margin: 0;
		color: var(--c-text-2);
		font-size: 0.9375rem;
		line-height: 1.6;

		strong {
			color: var(--c-danger);
			font-weight: 600;
		}

		.email-link {
			color: var(--c-primary);
			text-decoration: none;
			background-color: var(--c-primary-soft);
			padding: 0.125rem 0.375rem;
			border-radius: 4px;
			font-family: var(--font-monospace);
			transition: all 0.2s ease;

			&:hover {
				background-color: var(--c-primary);
				color: white;
			}
		}
	}
}

/* 赞助名单区域 */
.sponsors-section {
	margin-bottom: 2rem;
}

.section-header {
	margin-bottom: 1rem;
}

.section-title {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	font-size: 1.5rem;
	font-weight: 700;
	color: var(--c-text);
	margin: 0;
}

.sponsors-list {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.sponsor-item {
	display: flex;
	align-items: center;
	gap: 1rem;
	padding: 1rem;
	background-color: var(--c-bg-1);
	border-radius: 8px;
	box-shadow: 0 0 0 1px var(--c-bg-soft);
	transition: all 0.2s ease;

	&:hover {
		box-shadow: 0 0 0 1px var(--c-primary-soft);
	}
}

.sponsor-avatar {
	flex-shrink: 0;
	width: 2.5rem;
	height: 2.5rem;
	border-radius: 50%;
	overflow: hidden;
	background-color: var(--c-bg-2);
	display: flex;
	align-items: center;
	justify-content: center;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.default-avatar {
		font-size: 1.5rem;
		color: var(--c-text-3);
	}
}

.sponsor-info {
	flex: 1;
	min-width: 0;
}

.sponsor-name {
	font-weight: 600;
	color: var(--c-text);
	font-size: 1rem;
	margin-bottom: 0.25rem;
}

.sponsor-meta {
	display: flex;
	align-items: center;
	gap: 1rem;
	color: var(--c-text-3);
	font-size: 0.875rem;
}

.sponsor-date {
	font-family: var(--font-monospace);
}

.sponsor-amount {
	font-weight: 500;
	color: var(--c-primary);
}

/* 空状态 */
.empty-state {
	text-align: center;
	padding: 3rem 1rem;
	border-radius: 8px;
	box-shadow: 0 0 0 1px var(--c-bg-soft);
	background-color: var(--c-bg-1);
}

.empty-icon {
	font-size: 3rem;
	color: var(--c-text-3);
	margin-bottom: 0.75rem;
}

.empty-state p {
	margin: 0;
	color: var(--c-text-3);
	font-size: 0.9375rem;
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

/* 响应式设计 */
@media (max-width: 768px) {
	.page-sponsor {
		margin: 0.5rem;
	}

	.page-title {
		font-size: 1.75rem;
	}

	.qr-section {
		grid-template-columns: 1fr;
	}

	.notice-card {
		flex-direction: column;
		text-align: center;
		align-items: center;

		.notice-icon {
			margin-top: 0;
		}

		.notice-text {
			text-align: left;
		}
	}

	.sponsor-item {
		flex-wrap: wrap;

		.sponsor-info {
			flex: 1 1 auto;
		}
	}
}
</style>
