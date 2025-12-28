<script setup lang="ts">
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { onMounted, ref } from 'vue'
import 'swiper/css'
import 'swiper/css/autoplay'

const appConfig = useAppConfig()

const modules = [Autoplay]

const techStack = ref([
	{ name: 'Vue', color: '#42b883' },
	{ name: 'React', color: '#61dafb' },
	{ name: 'TypeScript', color: '#dd0031' },
	{ name: 'Next.js', color: '#000000', darkColor: '#ffffff' },
	{ name: 'Astro', color: '#e0234e' },
	{ name: 'Tailwind', color: '#38bdf8' },
	{ name: 'Vite', color: '#646cff' },
])

const isDark = ref(false)

onMounted(() => {
	isDark.value = document.documentElement.classList.contains('dark')
})

const swiperOptions = {
	modules,
	direction: 'vertical' as const,
	autoplay: {
		delay: 1500,
		disableOnInteraction: false,
	},
	loop: true,
}
</script>

<template>
<div class="about-introduce">
	<!-- 左侧欢迎卡片 -->
	<div class="introduce-left">
		<div class="introduce-subtitle">
			你好，很高兴认识你 👏
		</div>
		<div class="introduce-name">
			{{ appConfig.author.name }}
		</div>
		<div class="introduce-desc">
			是一名 博客写作者、资源分享者，小说爱好者
		</div>
	</div>

	<!-- 右侧深度卡片 -->
	<div class="introduce-right">
		<div class="introduce-label">
			座右铭
		</div>
		<div class="introduce-core">
			<span>每一段旅行</span>
			<span>都有终点~</span>
			<span class="break-line"></span>
			<span>总有些事情</span>
			<!-- <del class="delete-text">而不</del> -->
			<span>高于其他！</span>
		</div>
		<div class="tech-swiper">
			<Swiper v-bind="swiperOptions" class="tech-swiper-container">
				<SwiperSlide
					v-for="(tech, index) in techStack"
					:key="index"
					class="tech-slide"
					:style="{ color: tech.darkColor && isDark ? tech.darkColor : tech.color }"
				>
					<div
						class="tech-item"
						:style="{ color: tech.color }"
					>
						{{ tech.name }}
					</div>
				</SwiperSlide>
			</Swiper>
		</div>
	</div>
</div>
</template>

<style lang="scss" scoped>
.about-introduce {
	display: flex;
	gap: 0;
	margin-top: 16px;

	@media (min-width: 768px) {
		margin-top: 26px;
	}

	@media (max-width: 480px) {
		margin-top: 8px;
	}
}

.introduce-left {
	flex: 4 1 0%;
	padding: 8px;
	border-radius: 1rem;
	border: 1px solid #e3e8f7;
	background: linear-gradient(121deg, rgba(196, 255, 255, 0.15) 0%, rgba(190, 83, 69, 0.1) 100%);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);

	@media (min-width: 768px) {
		padding: 20px 40px;
	}

	@media (max-width: 480px) {
		padding: 4px;
		border-radius: 0.5rem;
	}

	.dark & {
		border-color: #3d3d3f;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.31);
	}
}

.introduce-right {
	flex: 3 1 0%;
	padding: 8px;
	border-radius: 1rem;
	border: 1px solid #e3e8f7;
	background: linear-gradient(121deg, rgba(239, 184, 174, 0.15) 0%, rgba(127, 156, 76, 0.1) 100%);
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin-top: 16px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);

	@media (min-width: 768px) {
		padding: 20px 40px;
		margin-top: 0;
	}

	@media (max-width: 480px) {
		padding: 4px;
		margin-top: 8px;
		border-radius: 0.5rem;
	}

	.dark & {
		border-color: #3d3d3f;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.31);
	}
}

.introduce-subtitle {
	font-size: 14px;
	color: var(--c-text-2);
}

.introduce-name {
	font-size: 32px;
	font-weight: 700;
	color: var(--c-text);
	margin: 10px 0;
}

.introduce-desc {
	font-size: 14px;
	color: var(--c-text-2);
}

.introduce-label {
	font-size: 14px;
	color: #888;
}

.introduce-core {
	display: flex;
	align-items: baseline;
	gap: 0.25rem;
	flex-wrap: wrap;
	justify-content: center;
	font-size: 24px;
	font-weight: 700;
	color: var(--c-text);

	.break-line {
		flex-basis: 100%;
		height: 0;
	}

	.delete-text {
		opacity: 0.6;
		text-decoration: line-through;
	}
}

.tech-swiper {
	height: 30px;
	display: flex;
	align-items: center;
	margin-top: 10px;
	overflow: hidden;
	position: relative;
	width: 100%;
}

.tech-swiper-container {
	width: 100%;
	height: 100%;
}

.tech-slide {
	display: flex;
	align-items: center;
	justify-content: center;
}

.tech-item {
	height: 30px;
	display: flex;
	align-items: center;
	font-size: 18px;
	font-weight: 700;
	color: #42b883;
}

@media (max-width: 768px) {
	.about-introduce {
		flex-direction: column;
	}

	.introduce-left,
	.introduce-right {
		flex: 1;
	}
}
</style>
