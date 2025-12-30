<script setup lang="ts">
const canvasRef = ref<HTMLCanvasElement | null>(null)
const { $colorMode } = useNuxtApp()
const isDark = ref($colorMode.value === 'dark')

// 监听暗黑模式变化
watch($colorMode, (newMode) => {
	isDark.value = newMode === 'dark'
})

// Genshin Style Colors - Unified Starry/Magical Feel
const getColors = (dark: boolean) => {
	// Dark Mode: Gold, White, Deep Blue
	if (dark) return [
		'rgba(211, 188, 142, 0.6)', // Gold (Primogem-like)
		'rgba(255, 255, 255, 0.5)', // White
		'rgba(66, 133, 244, 0.4)',  // Blue
		'rgba(252, 211, 77, 0.4)',  // Amber
	]
	// Light Mode: Darker Gold, Blue, Slate (Visible on white)
	return [
		'rgba(180, 83, 9, 0.3)',    // Dark Amber/Gold
		'rgba(59, 130, 246, 0.3)',  // Blue
		'rgba(148, 163, 184, 0.4)'  // Slate
	]
}

let ctx: CanvasRenderingContext2D | null = null
let particles: Particle[] = []
let colors = getColors(isDark.value)
let animationFrameId: number | null = null
const particleCount = 35

interface Particle {
	x: number
	y: number
	size: number
	color: string
	speedY: number
	speedX: number
	opacity: number
	fadeSpeed: number
	type: 'circle' | 'star'
	rotation: number
	rotationSpeed: number
	update: () => void
	reset: (initial?: boolean) => void
}

class ParticleImpl implements Particle {
	x!: number
	y!: number
	size!: number
	color!: string
	speedY!: number
	speedX!: number
	opacity!: number
	fadeSpeed!: number
	type!: 'circle' | 'star'
	rotation!: number
	rotationSpeed!: number

	constructor() {
		this.reset(true)
	}

	reset(initial = false) {
		const canvas = canvasRef.value
		if (!canvas) return
		this.x = Math.random() * canvas.width
		this.y = initial ? Math.random() * canvas.height : canvas.height + 20
		this.size = Math.random() * 5 + 3
		this.color = colors[Math.floor(Math.random() * colors.length)]
		this.speedY = Math.random() * -0.5 - 0.1
		this.speedX = (Math.random() - 0.5) * 0.2
		this.opacity = 0
		this.fadeSpeed = Math.random() * 0.01 + 0.005
		this.type = Math.random() > 0.7 ? 'star' : 'circle'
		this.rotation = Math.random() * Math.PI * 2
		this.rotationSpeed = (Math.random() - 0.5) * 0.02
	}

	draw() {
		if (!ctx) return
		ctx.save()
		ctx.translate(this.x, this.y)
		ctx.globalAlpha = this.opacity
		ctx.fillStyle = this.color

		if (this.type === 'star') {
			ctx.rotate(this.rotation)
			ctx.beginPath()
			const r = this.size * 2
			ctx.moveTo(0, -r)
			ctx.quadraticCurveTo(0.5, -0.5, r, 0)
			ctx.quadraticCurveTo(0.5, 0.5, 0, r)
			ctx.quadraticCurveTo(-0.5, 0.5, -r, 0)
			ctx.quadraticCurveTo(-0.5, -0.5, 0, -r)
			ctx.fill()
		}
		else {
			ctx.beginPath()
			ctx.arc(0, 0, this.size, 0, Math.PI * 2)
			ctx.fill()
		}

		ctx.restore()
	}

	update() {
		const canvas = canvasRef.value
		if (!canvas) return

		this.y += this.speedY
		this.x += this.speedX
		this.rotation += this.rotationSpeed

		if (this.y < canvas.height * 0.2) {
			this.opacity -= this.fadeSpeed
		}
		else if (this.opacity < 1) {
			this.opacity += this.fadeSpeed
		}

		if (this.y < -20 || this.opacity <= 0) {
			this.reset()
		}

		this.draw()
	}
}

const resizeCanvas = () => {
	const canvas = canvasRef.value
	if (!canvas) return
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
}

const init = () => {
	particles = []
	for (let i = 0; i < particleCount; i++) {
		particles.push(new ParticleImpl())
	}
}

const animate = () => {
	if (!ctx || !canvasRef.value) return
	ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
	particles.forEach(p => p.update())
	animationFrameId = requestAnimationFrame(animate)
}

// 更新颜色
watch(isDark, (newDark) => {
	colors = getColors(newDark)
	particles.forEach(p => {
		p.color = colors[Math.floor(Math.random() * colors.length)]
	})
})

onMounted(() => {
	const canvas = canvasRef.value
	if (!canvas) return
	ctx = canvas.getContext('2d')
	if (!ctx) return

	window.addEventListener('resize', resizeCanvas)
	resizeCanvas()
	init()
	animate()
})

onUnmounted(() => {
	window.removeEventListener('resize', resizeCanvas)
	if (animationFrameId) {
		cancelAnimationFrame(animationFrameId)
	}
})
</script>

<template>
<canvas
	ref="canvasRef"
	class="particles-canvas"
/>
</template>

<style scoped>
.particles-canvas {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 0;
}
</style>
