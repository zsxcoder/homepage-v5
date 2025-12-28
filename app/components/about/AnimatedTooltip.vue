<script setup lang="ts">
import type { TooltipItem } from '~/types/tooltip'
import { computed, ref } from 'vue'

interface Props {
	items: TooltipItem[]
}

const { items } = defineProps<Props>()

const hoveredIndex = ref<number | null>(null)

// 获取鼠标在元素内的相对位置
const mouseX = ref(0)

function handleMouseMove(event: MouseEvent) {
	const target = event.currentTarget as HTMLElement
	const rect = target.getBoundingClientRect()
	const halfWidth = rect.width / 2
	mouseX.value = event.clientX - rect.left - halfWidth
}

// 计算旋转角度和平移量
const rotate = computed(() => {
	const range = 50
	const maxRotate = 45
	const normalizedX = Math.max(-range, Math.min(range, mouseX.value))
	return (normalizedX / range) * maxRotate
})

const translateX = computed(() => {
	const range = 50
	const maxTranslate = 50
	const normalizedX = Math.max(-range, Math.min(range, mouseX.value))
	return (normalizedX / range) * maxTranslate
})

function setHovered(id: number | null) {
	hoveredIndex.value = id
}
</script>

<template>
<div class="animated-tooltip">
	<div v-if="!items || items.length === 0" class="no-items">
		暂无数据
	</div>
	<div
		v-for="item in items"
		:key="item.id"
		class="tooltip-item"
		@mouseenter="setHovered(item.id)"
		@mouseleave="setHovered(null)"
	>
		<Transition
			mode="out-in"
			enter-active-class="transition-all duration-300 ease-out"
			enter-from-class="opacity-0 translate-y-5 scale-60"
			enter-to-class="opacity-100 translate-y-0 scale-100"
			leave-active-class="transition-all duration-200 ease-in"
			leave-from-class="opacity-100 translate-y-0 scale-100"
			leave-to-class="opacity-0 translate-y-5 scale-60"
		>
			<div
				v-if="hoveredIndex === item.id"
				class="tooltip-content"
				:style="{
					transform: `translateX(-50%) translateX(${translateX}px) rotate(${rotate}deg)`,
				}"
			>
				<div class="tooltip-line tooltip-line-1" />
				<div class="tooltip-line tooltip-line-2" />
				<div class="tooltip-name">
					{{ item.name }}
				</div>
				<div v-if="item.designation" class="tooltip-designation">
					{{ item.designation }}
				</div>
			</div>
		</Transition>

		<img
			v-if="item.image"
			:src="item.image"
			:alt="item.name"
			width="100"
			height="100"
			class="tooltip-image"
			@mousemove="handleMouseMove"
		>
		<div v-else class="tooltip-placeholder">
			{{ item.name?.[0] || '?' }}
		</div>
	</div>
</div>
</template>

<style lang="scss" scoped>
.animated-tooltip {
	display: flex;
}

.no-items {
	font-size: 12px;
	color: rgba(255, 255, 255, 0.7);
}

.tooltip-item {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 56px;
	height: 56px;
	border-radius: 50%;
	cursor: pointer;
	margin-right: -16px;
	overflow: visible;

	@media (max-width: 480px) {
		width: 48px;
		height: 48px;
		margin-right: -12px;
	}
}

.tooltip-item:last-child {
	margin-right: 0;
}

.tooltip-image {
	width: 56px;
	height: 56px;
	border-radius: 50%;
	border: 2px solid #fff;
	object-fit: cover;
	object-position: top;
	transition: transform 0.5s ease, border-color 0.3s ease, z-index 0.3s ease;
	position: relative;
	z-index: 10;
	display: block;
	margin: 0;
	padding: 0;

	@media (max-width: 480px) {
		width: 48px;
		height: 48px;
	}

	&:hover {
		transform: scale(1.05);
		z-index: 30;
	}
}

.tooltip-placeholder {
	width: 56px;
	height: 56px;
	border-radius: 50%;
	border: 2px solid #fff;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
	font-size: 24px;
	font-weight: 700;

	@media (max-width: 480px) {
		width: 48px;
		height: 48px;
		font-size: 20px;
	}
}

.tooltip-content {
	position: absolute;
	top: -64px;
	left: 50%;
	z-index: 50;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 8px 16px;
	background: #000;
	border-radius: 6px;
	box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
	white-space: nowrap;
}

.tooltip-line {
	position: absolute;
	z-index: 30;
	height: 1px;
	bottom: -1px;
}

.tooltip-line-1 {
	left: 40px;
	width: 20%;
	background: linear-gradient(90deg, transparent, #10b981, transparent);
}

.tooltip-line-2 {
	left: 40px;
	width: 40%;
	background: linear-gradient(90deg, transparent, #0ea5e9, transparent);
}

.tooltip-name {
	position: relative;
	z-index: 30;
	font-size: 16px;
	font-weight: 700;
	color: #fff;
}

.tooltip-designation {
	font-size: 12px;
	color: #fff;
}
</style>
