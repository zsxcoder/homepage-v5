<script setup lang="ts">
import * as echarts from 'echarts'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { AboutCardSkillColorMap, AboutCardSkillTimeline, skills, skillsTools } from '~/constants/about-const'
import { installChartResize } from '~/utils/resize-chart'
import 'swiper/css'
import 'swiper/css/autoplay'

const chartRef = ref<HTMLDivElement | null>(null)
let myChartInstance: echarts.ECharts | null = null

const swiperOptions = {
	modules: [Autoplay],
	spaceBetween: 10,
	slidesPerView: 'auto' as const,
	autoplay: {
		delay: 0,
		disableOnInteraction: false,
	},
	speed: 4000,
	loop: true,
}

// 获取图表配置
function getChartOptions() {
	// 获取当前主题的颜色值
	const isDark = document.documentElement.classList.contains('dark')
	const getComputedColor = (cssVar: string) => {
		return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim()
	}

	const textColor = getComputedColor('--c-text') || '#333'
	const textSecondaryColor = getComputedColor('--c-text-2') || '#666'
	const borderColor = getComputedColor('--c-border') || '#e0e0e0'
	const primaryColor = getComputedColor('--c-primary') || '#4caf50'
	const bgColor = getComputedColor('--c-bg') || '#fff'

	const options = AboutCardSkillTimeline.map((item) => {
		return {
			series: [
				{
					type: 'bar',
					label: {
						show: true,
						position: 'top',
						fontSize: 10,
						fontWeight: 'bold',
						distance: 4,
						color: textSecondaryColor,
					},
					barWidth: '30%',
					barMinHeight: 2,
					itemStyle: {
						color: (param: { name: string }) => {
							return AboutCardSkillColorMap[param.name]
						},
					},
					data: item.data,
				},
			],
		}
	})

	const option: echarts.EChartsOption = {
		baseOption: {
			color: [
				primaryColor,
			],
			tooltip: {
				trigger: 'axis',
				padding: [6, 10],
				backgroundColor: bgColor,
				borderColor,
				borderWidth: 1,
				textStyle: {
					color: textColor,
					fontSize: 12,
				},
				axisPointer: {
					type: 'shadow',
					z: 111,
					shadowStyle: {
						color: primaryColor,
						opacity: 0.2,
					},
				},
				formatter: (param) => {
					if (Array.isArray(param)) {
						const find = param[0]
						if (!find)
							return '' // 添加安全检查
						const data = find.data as { tooltip: string }
						return data?.tooltip
					}
					return ''
				},
			},
			timeline: {
				top: '80%',
				left: 'center',
				right: 'auto',
				width: '90%',
				axisType: 'category',
				autoPlay: true,
				playInterval: 3000,
				data: [
					'2024',
					'2025',
				],
				symbol: 'circle',
				symbolSize: 10,
				label: {
					position: 'bottom',
					interval: 0,
					fontSize: 11,
					color: textSecondaryColor,
					distance: 8,
				},
				lineStyle: {
					color: borderColor,
					width: 1,
				},
				itemStyle: {
					color: textSecondaryColor,
				},
				checkpointStyle: {
					symbolSize: 12,
					color: primaryColor,
					borderColor: bgColor,
					borderWidth: 2,
				},
				controlStyle: {
					itemSize: 14,
					itemGap: 20,
					showPrevBtn: false,
					showNextBtn: false,
					color: primaryColor,
					borderColor: primaryColor,
				},
				progress: {
					lineStyle: {
						color: primaryColor,
					},
					itemStyle: {
						color: primaryColor,
					},
					label: {
						color: textColor,
					},
				},
				emphasis: {
					itemStyle: {
						color: primaryColor,
					},
					controlStyle: {
						color: textSecondaryColor,
						borderColor: textSecondaryColor,
					},
				},
			},
			xAxis: {
				type: 'category',
				data: [
					'Vue',
					'React',
					'TypeScript',
					'NextJs',
					'Astro',
					'HTML',
					'CSS',
					'JS',
				],
				axisLine: {
					show: true,
					lineStyle: {
						width: 1,
						color: borderColor,
					},
				},
				axisTick: {
					show: true,
					length: 3,
					lineStyle: {
						color: borderColor,
						width: 1,
					},
				},
				axisLabel: {
					interval: 0,
					fontSize: 10,
					color: textSecondaryColor,
					margin: 8,
					rotate: 0,
					formatter: (value: string, index: number) => {
						// 偶数标签正常位置，奇数标签向下偏移
						if (index % 2 === 1) {
							return `\n${value}`
						}
						return value
					},
					lineHeight: 14,
				},
			},
			yAxis: {
				type: 'value',
				splitNumber: 4,
				axisLabel: {
					show: false,
				},
				max: 100,
				splitLine: {
					show: true,
					lineStyle: {
						color: borderColor,
						width: 0.5,
						type: 'dashed',
					},
				},
			},
			grid: {
				top: '8%',
				left: 0,
				right: 0,
				bottom: '30%',
				containLabel: true,
			},
		},
		options: options as echarts.EChartsOption['options'],
	}

	return { option, isDark }
}

// 初始化图表
function initChart() {
	const el = chartRef.value
	if (!el)
		return

	// 销毁现有实例
	if (myChartInstance) {
		myChartInstance.dispose()
	}

	const { option, isDark } = getChartOptions()

	requestAnimationFrame(() => {
		myChartInstance = echarts.init(el, isDark ? 'dark' : null)
		myChartInstance.setOption(option)
		installChartResize(el, myChartInstance)
	})
}

// 监听主题变化
function handleThemeChange() {
	initChart()
}

onMounted(() => {
	initChart()

	// 监听主题变化
	const observer = new MutationObserver(() => {
		handleThemeChange()
	})
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['class'],
	})

	onUnmounted(() => {
		observer.disconnect()
		if (myChartInstance) {
			myChartInstance.dispose()
		}
	})
})

onMounted(() => {
	// 获取当前主题的颜色值
	const isDark = document.documentElement.classList.contains('dark')
	const getComputedColor = (cssVar: string) => {
		return getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim()
	}

	const textColor = getComputedColor('--c-text') || '#333'
	const textSecondaryColor = getComputedColor('--c-text-2') || '#666'
	const borderColor = getComputedColor('--c-border') || '#e0e0e0'
	const primaryColor = getComputedColor('--c-primary') || '#4caf50'
	const bgColor = getComputedColor('--c-bg') || '#fff'

	const options = AboutCardSkillTimeline.map((item) => {
		return {
			series: [
				{
					type: 'bar',
					label: {
						show: true,
						position: 'top',
						fontSize: 10,
						fontWeight: 'bold',
						distance: 4,
						color: textSecondaryColor,
					},
					barWidth: '30%',
					barMinHeight: 2,
					itemStyle: {
						color: (param: { name: string }) => {
							return AboutCardSkillColorMap[param.name]
						},
					},
					data: item.data,
				},
			],
		}
	})

	const option: echarts.EChartsOption = {
		baseOption: {
			color: [
				primaryColor,
			],
			tooltip: {
				trigger: 'axis',
				padding: [6, 10],
				backgroundColor: bgColor,
				borderColor,
				borderWidth: 1,
				textStyle: {
					color: textColor,
					fontSize: 12,
				},
				axisPointer: {
					type: 'shadow',
					z: 111,
					shadowStyle: {
						color: primaryColor,
						opacity: 0.2,
					},
				},
				formatter: (param) => {
					if (Array.isArray(param)) {
						const find = param[0]
						if (!find)
							return '' // 添加安全检查
						const data = find.data as { tooltip: string }
						return data?.tooltip
					}
					return ''
				},
			},
			timeline: {
				top: '80%',
				left: 'center',
				right: 'auto',
				width: '90%',
				axisType: 'category',
				autoPlay: true,
				playInterval: 3000,
				data: [
					'2024',
					'2025',
				],
				symbol: 'circle',
				symbolSize: 10,
				label: {
					position: 'bottom',
					interval: 0,
					fontSize: 11,
					color: textSecondaryColor,
					distance: 8,
				},
				lineStyle: {
					color: borderColor,
					width: 1,
				},
				itemStyle: {
					color: textSecondaryColor,
				},
				checkpointStyle: {
					symbolSize: 12,
					color: primaryColor,
					borderColor: bgColor,
					borderWidth: 2,
				},
				controlStyle: {
					itemSize: 14,
					itemGap: 20,
					showPrevBtn: false,
					showNextBtn: false,
					color: primaryColor,
					borderColor: primaryColor,
				},
				progress: {
					lineStyle: {
						color: primaryColor,
					},
					itemStyle: {
						color: primaryColor,
					},
					label: {
						color: textColor,
					},
				},
				emphasis: {
					itemStyle: {
						color: primaryColor,
					},
					controlStyle: {
						color: textSecondaryColor,
						borderColor: textSecondaryColor,
					},
				},
			},
			xAxis: {
				type: 'category',
				data: [
					'Vue',
					'React',
					'TypeScript',
					'NextJs',
					'Astro',
					'HTML',
					'CSS',
					'JS',
				],
				axisLine: {
					show: true,
					lineStyle: {
						width: 1,
						color: borderColor,
					},
				},
				axisTick: {
					show: true,
					length: 3,
					lineStyle: {
						color: borderColor,
						width: 1,
					},
				},
				axisLabel: {
					interval: 0,
					fontSize: 10,
					color: textSecondaryColor,
					margin: 8,
					rotate: 0,
					formatter: (value: string, index: number) => {
						// 偶数标签正常位置，奇数标签向下偏移
						if (index % 2 === 1) {
							return `\n${value}`
						}
						return value
					},
					lineHeight: 14,
				},
			},
			yAxis: {
				type: 'value',
				splitNumber: 4,
				axisLabel: {
					show: false,
				},
				max: 100,
				splitLine: {
					show: true,
					lineStyle: {
						color: borderColor,
						width: 0.5,
						type: 'dashed',
					},
				},
			},
			grid: {
				top: '8%',
				left: 0,
				right: 0,
				bottom: '30%',
				containLabel: true,
			},
		},
		options: options as echarts.EChartsOption['options'],
	}

	const el = chartRef.value
	if (!el)
		return

	requestAnimationFrame(() => {
		const myChart = echarts.init(el, isDark ? 'dark' : null)
		myChart.setOption(option)
		installChartResize(el, myChart)
	})
})
</script>

<template>
<div class="about-skill">
	<!-- 左侧技能卡片 -->
	<div class="skill-card skill-card-left">
		<div class="skill-header">
			<div class="skill-subtitle">
				技能
			</div>
			<div class="skill-title">
				开启创造力
			</div>
		</div>

		<div class="skill-content">
			<div class="gradient-left" />
			<div class="gradient-right" />
			<div class="skills-container">
				<div class="skills-swiper">
					<Swiper v-bind="swiperOptions" class="skills-swiper-container">
						<SwiperSlide v-for="skill in [...skills, ...skills]" :key="skill.text" class="skill-slide">
							<div
								class="skill-item"
								:style="{ backgroundColor: skill.color }"
							>
								<Icon :name="skill.icon" :size="70" />
							</div>
						</SwiperSlide>
					</Swiper>
				</div>
				<div class="tools-swiper">
					<Swiper v-bind="swiperOptions" class="tools-swiper-container">
						<SwiperSlide v-for="tool in [...skillsTools, ...skillsTools]" :key="tool.text" class="tool-slide">
							<div
								class="tool-item"
								:style="{ backgroundColor: tool.color }"
							>
								<Icon :name="tool.icon" :size="70" />
							</div>
						</SwiperSlide>
					</Swiper>
				</div>
			</div>
		</div>
	</div>

	<!-- 右侧技能曲线卡片 -->
	<div class="skill-card skill-card-right">
		<div class="skill-header">
			<div class="skill-subtitle">
				技能曲线
			</div>
			<div class="skill-title">
				无限进步
			</div>
		</div>
		<div class="chart-container">
			<div ref="chartRef" class="chart" />
			<div class="gradient-left" />
			<div class="gradient-right" />
		</div>
	</div>
</div>
</template>

<style lang="scss" scoped>
.about-skill {
	display: flex;
	gap: 16px;
	margin-top: 16px;

	@media (max-width: 768px) {
		flex-direction: column;
	}

	@media (max-width: 480px) {
		gap: 8px;
		margin-top: 8px;
	}
}

.skill-card {
	flex: 1 1 0%;
	padding: 8px;
	min-height: 180px;
	border-radius: 1rem;
	border: 1px solid #e3e8f7;
	background: #fff;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
	overflow: hidden;

	@media (min-width: 768px) {
		padding: 20px;
		min-height: 200px;
	}

	@media (max-width: 480px) {
		padding: 4px;
		min-height: 140px;
		border-radius: 0.5rem;
	}

	&.skill-card-left {
		@media (max-width: 768px) {
			margin-bottom: 16px;
		}

		@media (max-width: 480px) {
			margin-bottom: 8px;
		}
	}

	&.skill-card-right {
		@media (max-width: 768px) {
			margin-top: 16px;
		}

		@media (max-width: 480px) {
			margin-top: 8px;
		}
	}

	.dark & {
		border-color: #3d3d3f;
		background: #1a1a1a;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.31);
	}
}

.skill-header {
	padding: 0 8px;

	@media (min-width: 768px) {
		padding: 0 40px;
	}

	@media (max-width: 480px) {
		padding: 0 2px;
	}
}

.skill-subtitle {
	font-size: 14px;
	color: #888;
}

.skill-title {
	font-size: 24px;
	font-weight: 700;
	color: var(--c-text);
}

.skill-content {
	position: relative;
	margin-top: 10px;
}

.gradient-left {
	position: absolute;
	top: 0;
	left: 0;
	width: 10%;
	height: 100%;
	z-index: 10;
	background: linear-gradient(90deg, var(--background), rgba(0, 0, 0, 0));

	.dark & {
		display: none;
	}
}

.gradient-right {
	position: absolute;
	top: 0;
	right: 0;
	width: 10%;
	height: 100%;
	z-index: 10;
	background: linear-gradient(-90deg, var(--background), rgba(0, 0, 0, 0));

	.dark & {
		display: none;
	}
}

.skills-container {
	position: relative;
}

.skills-swiper,
.tools-swiper {
	width: 100%;
	overflow: hidden;
}

.skills-swiper-container,
.tools-swiper-container {
	display: flex;
}

.skill-slide,
.tool-slide {
	width: 100px;
}

.skill-item,
.tool-item {
	width: 100px;
	height: 100px;
	border-radius: 1.5rem;
	display: flex;
	justify-content: center;
	align-items: center;

	@media (min-width: 768px) {
		width: 120px;
		height: 120px;
	}

	@media (max-width: 480px) {
		width: 80px;
		height: 80px;
	}
}

.tools-swiper {
	margin-top: 10px;
}

.chart-container {
	position: relative;
	padding: 0 8px;
	width: 100%;
	height: 240px;

	@media (min-width: 768px) {
		padding: 0 40px;
		height: 280px;
	}

	@media (max-width: 480px) {
		padding: 0 2px;
		height: 180px;
	}

	.gradient-left,
	.gradient-right {
		pointer-events: none;
	}
}

.chart {
	width: 100%;
	height: 100%;
}
</style>
