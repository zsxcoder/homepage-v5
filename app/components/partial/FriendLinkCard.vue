<script setup lang="ts">
import { ref } from 'vue'

// 动态接收友链数据
const props = defineProps<{
	siteName: string
	sitenick: string
	siteUrl: string
	siteDesc: string
	siteIcon?: string
	upstream?: boolean
	date?: string
	qrcode?: string
	recommend?: boolean
}>()

// 控制二维码模态框显示
const showQrcodeModal = ref(false)

// 使用 safego 外链安全跳转
const { transformLink, isExternal } = useSafego()

// 获取友链状态
const { getStatusInfo } = useFlinkStatus()

// 计算转换后的链接
const safeSiteUrl = computed(() => {
	// 如果是外链则转换，否则返回原始链接
	return isExternal(props.siteUrl) ? transformLink(props.siteUrl) : props.siteUrl
})

// 计算状态信息
const statusInfo = computed(() => getStatusInfo(props.siteUrl))

// 跳转到友链网站
function navigateToSite() {
	if (safeSiteUrl.value) {
		window.open(safeSiteUrl.value, '_blank')
	}
}
</script>

<template>
<div class="friend-link-card">
	<!-- 状态标签 -->
	<div v-if="statusInfo" class="status-tag" :class="statusInfo.className">
		{{ statusInfo.text }}
	</div>

	<!-- 卡片内部孔洞效果 -->
	<div class="card-punch-hole" />

	<!-- 卡片标题：友链展示 -->
	<div class="friend-link-card__title">
		{{ sitenick }}
	</div>

	<!-- 友链核心信息 -->
	<div class="friend-link-card__info-list">
		<div class="info-header">
			<div class="author-info">
				<span class="author-name">{{ siteName }}</span>
			</div>
			<div class="description-info">
				{{ siteDesc }}
			</div>
		</div>
	</div>

	<!-- 站点图标（可选） -->
	<div v-if="siteIcon" class="friend-link-card__icon">
		<img
			:src="siteIcon"
			:alt="`${siteName} icon`"
			class="site-icon"
		>
	</div>

	<!-- 右下角日期显示 -->
	<div v-if="date" class="date-display">
		{{ date }}
	</div>

	<!-- 右下角upstream图片 -->
	<div v-if="upstream" class="upstream-image">
		<img
			src="https://cdn.atao.cyou/Web/upstream.png"
			alt="upstream"
			class="upstream-img"
		>
	</div>

	<!-- 右下角recommend图片 -->
	<div v-if="recommend" class="recommend-image">
		<img
			src="https://cdn.atao.cyou/Web/recommend.png"
			alt="recommend"
			class="recommend-img"
		>
	</div>

	<!-- 左下角二维码图片 -->
	<div v-if="qrcode" class="qrcode-image" @click="showQrcodeModal = true">
		<img
			:src="qrcode"
			alt="二维码"
			class="qrcode-img"
		>
	</div>

	<!-- 底部跳转指示器 -->
	<div
		class="link-indicator"
		@click="navigateToSite"
	>
		<span class="indicator-text">前往网站</span>
		<span class="indicator-arrow">→</span>
	</div>

	<!-- 二维码模态框 -->
	<Teleport to="body">
		<div v-if="showQrcodeModal" class="qrcode-modal" @click.self="showQrcodeModal = false">
			<div class="modal-content">
				<img
					:src="qrcode"
					alt="放大二维码"
					class="modal-qrcode"
				>
				<button class="modal-close" @click="showQrcodeModal = false">
					×
				</button>
			</div>
		</div>
	</Teleport>
</div>
</template>

<style scoped lang="scss">
/* 状态标签样式 */
.status-tag {
  position: absolute;
  top: 0px;
  left: 0px;
  padding: 3px 8px;
  border-radius: 12px 0px 12px 0px;
  font-size: 12px;
  color: white;
  font-weight: bold;
  transition: font-size 0.3s ease-out, opacity 0.3s ease-out;
  z-index: 15;
}

.friend-link-card:hover .status-tag {
  font-size: 0px;
  opacity: 0;
}

/* 固态颜色 */
.status-tag-green {
  background-color: #005E00; /* 绿色 */
}

.status-tag-light-yellow {
  background-color: #FED101; /* 浅黄色 */
  color: #333;
}

.status-tag-dark-yellow {
  background-color: #F0B606; /* 深黄色 */
  color: #333;
}

.status-tag-red {
  background-color: #B90000; /* 红色 */
}

/* 卡片容器基础样式 */
.friend-link-card {
  position: relative;
  width: 100%;
  max-width: 320px;
  height: 210px;
  padding: 20px;
  background-color: var(--c-bg-2);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-family: system-ui, -apple-system, sans-serif;
  transition: all 0.3s ease;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
}

/* 卡片标题样式 */
.friend-link-card__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--c-text);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--c-border);
  user-select: none;
}

/* 信息列表容器 */
.friend-link-card__info-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 简约信息头部样式 */
.info-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.author-info {
  display: flex;
  align-items: center;
}

.author-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--c-text);
  cursor: default;
}

.description-info {
  font-size: 14px;
  color: var(--c-text-2);
  line-height: 1.4;
  font-weight: 400;
  cursor: default;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 真实穿孔效果 */
.card-punch-hole {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--c-bg);
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.15),
    inset 0 1px 2px rgba(0, 0, 0, 0.2),
    inset 0 -1px 1px rgba(255, 255, 255, 0.1);
  z-index: 5;
  pointer-events: none;
}

/* 站点图标样式 */
.friend-link-card__icon {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
}

.site-icon {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}

/* upstream图片样式 */
.upstream-image {
  position: absolute;
  top: 110px;
  right: 18px;
  width: 60px;
  height: 60px;
  z-index: 10;
  transition: all 0.3s ease;
  transform: rotate(-10deg);
}

.upstream-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 6px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.upstream-image:hover {
  transform: rotate(-15deg) scale(1.05);
  filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.25));
}

/* recommend图片样式 */
.recommend-image {
  position: absolute;
  top: 110px;
  right: 18px;
  width: 60px;
  height: 60px;
  z-index: 10;
  transition: all 0.3s ease;
  transform: rotate(-10deg);
}

.recommend-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 6px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.recommend-image:hover {
  transform: rotate(-15deg) scale(1.05);
  filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.25));
}

/* 日期显示样式 */
.date-display {
  position: absolute;
  bottom: 15px;
  right: 15px;
  font-size: 11px;
  color: var(--c-text-2);
  font-family: monospace;
  cursor: default;
  user-select: none;
  opacity: 0.8;
}

/* 二维码图片样式 */
.qrcode-image {
  position: absolute;
  bottom: 15px;
  left: 15px;
  width: 50px;
  height: 50px;
  z-index: 10;
  transition: all 0.3s ease;
  cursor: pointer;
}

.qrcode-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 6px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.qrcode-image:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.25));
}

/* 底部跳转指示器样式 */
.link-indicator {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%) translateY(5px);
  height: 18px;
  background: rgba(100, 116, 139, 0.7);
  color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
  opacity: 0;
  transition: all 0.12s ease;
  border-radius: 6px;
  font-weight: 300;
  z-index: 20;
  padding: 0 8px;
  min-width: 50px;
  font-size: 10px;
  letter-spacing: 0.1px;
}

.link-indicator:hover {
  background: rgba(71, 85, 105, 0.8);
  transform: translateX(-50%) translateY(0);
}

.indicator-text {
  font-size: 10px;
}

.indicator-arrow {
  font-size: 10px;
  transition: transform 0.12s ease;
}

.link-indicator:hover .indicator-arrow {
  transform: translateX(0.3px);
}

/* 卡片hover时显示指示器 */
.friend-link-card:hover .link-indicator {
  opacity: 0.8;
  transform: translateX(-50%) translateY(0);
}

/* 二维码模态框样式 */
.qrcode-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  position: relative;
  background: var(--c-bg-2);
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-qrcode {
  width: 280px;
  height: 280px;
  object-fit: contain;
  display: block;
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  border: none;
  background: var(--c-bg-1);
  border-radius: 50%;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
  color: var(--c-text);
}

.modal-close:hover {
  background: var(--c-bg-3);
  transform: scale(1.1);
}

/* 响应式调整 */
@media (max-width: 480px) {
  .upstream-image,
  .recommend-image {
    width: 50px;
    height: 50px;
    top: 50px;
    right: 12px;
  }

  .date-display {
    font-size: 10px;
    bottom: 12px;
    right: 12px;
  }

  .qrcode-image {
    width: 40px;
    height: 40px;
    bottom: 12px;
    left: 12px;
  }
}
</style>
