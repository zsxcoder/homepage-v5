<script setup lang="ts">
import { Autoplay, Scrollbar } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import AnimatedTooltip from './AnimatedTooltip.vue'
import 'swiper/css'
import 'swiper/css/scrollbar'

// 游戏图片配置
const gameImages = {
	// 饥荒
	jh: {
		banner: '/game/jiuang/jihuang.jpg',
		people: [
			{ id: 1, name: '大力士', image: '/game/jiuang/dalishi.webp' },
			{ id: 2, name: '女武神', image: '/game/jiuang/nvwushen.webp' },
			{ id: 3, name: '威尔逊', image: '/game/jiuang/weierxun.webp' },
		],
		weapons: [
			{ id: 1, name: '火腿棒', image: '/game/jiuang/huotuibang.webp' },
			{ id: 2, name: '影刀', image: '/game/jiuang/yingdao.webp' },
			{ id: 3, name: '铥矿棒', image: '/game/jiuang/diukuangbang.webp' },
		],
	},
	// Terraria
	ter: {
		bannerImages: ['/game/Terraria/terraria.png'], // 添加Terraria背景图片路径数组，例如: ['/game/cod/cod-1.jpg', '/game/cod/cod-2.jpg']
		games: [
			{ id: 1, name: '原版', designation: '原版', image: '/game/Terraria/yuanban.webp' },
			{ id: 2, name: '灾厄', designation: 'Mod', image: '/game/Terraria/zaie.webp' },
			{ id: 3, name: '法狗', designation: 'Mod', image: '/game/Terraria/fagou.webp' },
		],
	},
	// Minecraft
	mc: {
		bannerImages: ['/game/minecraft/banner1.jpg', '/game/minecraft/banner2.jpg', '/game/minecraft/banner3.png'], // 添加Minecraft背景图片路径数组，例如: ['/game/mc/mc-1.jpg', '/game/mc/mc-2.jpg']
		heroes: [
			{ id: 1, name: '钻石', designation: '矿', image: '/game/minecraft/zuanshi.png' },
			{ id: 2, name: '钻石镐', designation: '工具', image: '/game/minecraft/zuanshigao.webp' },
			{ id: 3, name: '钻石剑', designation: '武器', image: '/game/minecraft/zuanshijian.png' },
			// { id: 4, name: '弓箭女皇', designation: '远程英雄', image: '' },
			// { id: 5, name: '野蛮人之王', designation: '近战英雄', image: '' },
		],
	},
	// 英雄联盟
	lol: {
		bannerImages: ['/game/lol/banner1.jpg', '/game/lol/banner2.jpg', '/game/lol/banner3.jpg'],
		generals: [
			{ id: 1, name: '剑魔', designation: 'DRX冠军皮肤', image: '/game/lol/jianmo.jpg' },
			{ id: 2, name: '吸血鬼', designation: '咖啡管家', image: '/game/lol/xixuegui.jpg' },
			{ id: 3, name: '铁男', designation: '源计划', image: '/game/lol/tienan.jpg' },
		],
	},
}

// 从配置中提取数据
const jhBanner = gameImages.jh.banner
const terBannerImages = gameImages.ter.bannerImages
const mcBannerImages = gameImages.mc.bannerImages
const lolBannerImages = gameImages.lol.bannerImages

const jhPeople = gameImages.jh.people
const jhWeapons = gameImages.jh.weapons
const terGames = gameImages.ter.games
const mcHeroes = gameImages.mc.heroes
const lolGenerals = gameImages.lol.generals

// 占位符图片生成器（当没有实际图片时使用）
function getPlaceholderColor(index: number) {
	const colors = [
		'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
		'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
		'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
		'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
		'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
		'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
		'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
		'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
	]
	return colors[index % colors.length]
}

const swiperOptions = {
	modules: [Autoplay, Scrollbar],
	scrollbar: {
		hide: false,
	},
	autoplay: {
		delay: 6000,
		disableOnInteraction: false,
	},
}
</script>

<template>
<div class="about-games">
	<!-- 第一行：饥荒 和 Terraria -->
	<div class="games-row">
		<!-- 饥荒 -->
		<div class="game-card game-card-jh">
			<img
				v-if="jhBanner"
				:src="jhBanner"
				alt="饥荒"
				class="game-banner-image"
			/>
			<div v-else class="game-banner" :style="{ background: getPlaceholderColor(0) }" />
			<div class="game-overlay">
				<div class="game-subtitle">
					爱好游戏
				</div>
				<div class="game-title">
					饥荒
				</div>
				<div class="game-tooltips">
					<AnimatedTooltip :items="jhPeople" />
					<div class="mr-4">
						<AnimatedTooltip :items="jhWeapons" />
					</div>
				</div>
			</div>
		</div>

		<!-- Terraria -->
		<div class="game-card game-card-ter">
			<Swiper v-if="terBannerImages && terBannerImages.length > 0" v-bind="swiperOptions" class="game-swiper">
				<SwiperSlide v-for="(img, index) in terBannerImages" :key="index">
					<img :src="img" alt="Terraria" class="game-banner-image" />
				</SwiperSlide>
			</Swiper>
			<Swiper v-else v-bind="swiperOptions" class="game-swiper">
				<SwiperSlide>
					<div class="game-banner" :style="{ background: getPlaceholderColor(1) }" />
				</SwiperSlide>
			</Swiper>
			<div class="game-overlay">
				<div class="game-subtitle">
					爱好游戏
				</div>
				<div class="game-title">
					Terraria
				</div>
				<div class="game-tooltips">
					<AnimatedTooltip :items="terGames" />
				</div>
			</div>
		</div>
	</div>

	<!-- 第二行：Minecraft 和 英雄联盟 -->
	<div class="games-row">
		<!-- Minecraft -->
		<div class="game-card game-card-mc">
			<Swiper v-if="mcBannerImages && mcBannerImages.length > 0" v-bind="swiperOptions" class="game-swiper">
				<SwiperSlide v-for="(img, index) in mcBannerImages" :key="index">
					<img :src="img" alt="Minecraft" class="game-banner-image" />
				</SwiperSlide>
			</Swiper>
			<Swiper v-else v-bind="swiperOptions" class="game-swiper">
				<SwiperSlide>
					<div class="game-banner" :style="{ background: getPlaceholderColor(2) }" />
				</SwiperSlide>
			</Swiper>
			<div class="game-overlay">
				<div class="game-subtitle">
					爱好游戏
				</div>
				<div class="game-title">
					Minecraft
				</div>
				<div class="game-tooltips">
					<AnimatedTooltip :items="mcHeroes" />
				</div>
			</div>
		</div>

		<!-- 英雄联盟 -->
		<div class="game-card game-card-lol">
			<Swiper v-if="lolBannerImages && lolBannerImages.length > 0" v-bind="swiperOptions" class="game-swiper">
				<SwiperSlide v-for="(img, index) in lolBannerImages" :key="index">
					<img :src="img" alt="英雄联盟" class="game-banner-image" />
				</SwiperSlide>
			</Swiper>
			<Swiper v-else v-bind="swiperOptions" class="game-swiper">
				<SwiperSlide>
					<div class="game-banner" :style="{ background: getPlaceholderColor(3) }" />
				</SwiperSlide>
			</Swiper>
			<div class="game-overlay">
				<div class="game-subtitle">
					曾经爱好游戏
				</div>
				<div class="game-title">
					英雄联盟
				</div>
				<div class="game-tooltips">
					<AnimatedTooltip :items="lolGenerals" />
				</div>
			</div>
		</div>
	</div>
</div>
</template>

<style lang="scss" scoped>
.about-games {
	display: flex;
	flex-direction: column;
}

.games-row {
	display: block;
	gap: 26px;
	margin-top: 26px;

	@media (min-width: 768px) {
		display: flex;
	}

	@media (max-width: 480px) {
		gap: 16px;
		margin-top: 16px;
	}
}

.game-card {
	flex: 1;
	position: relative;
	height: 350px;
	border-radius: 1rem;
	border: 1px solid #e3e8f7;
	background: #fff;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
	overflow: hidden;

	@media (min-width: 768px) {
		height: 350px;
	}

	@media (max-width: 480px) {
		height: 280px;
		border-radius: 0.75rem;
	}

	.dark & {
		border-color: #3d3d3f;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.31);
	}
}

.game-banner,
.game-banner-image,
.game-swiper {
	position: absolute;
	inset: 0;
	z-index: 1;
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 1rem;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	::v-deep(.swiper-slide) {
		height: 100%;
	}

	@media (max-width: 480px) {
		border-radius: 0.75rem;
	}
}

.game-overlay {
	position: absolute;
	inset: 0;
	z-index: 2;
	padding: 20px;
	display: flex;
	flex-direction: column;
	height: 100%;

	@media (min-width: 768px) {
		padding: 40px;
	}

	@media (max-width: 480px) {
		padding: 12px;
	}

	.dark & {
		background: rgba(0, 0, 0, 0.5);
	}
}

.game-subtitle {
	font-size: 14px;
	color: #fff;
	height: 21px;

	@media (min-width: 768px) {
		font-size: 14px;
	}
}

.game-title {
	font-size: 24px;
	font-weight: 700;
	color: #fff;
	margin-bottom: 20px;
	height: 36px;

	@media (max-width: 480px) {
		font-size: 18px;
		margin-bottom: 12px;
		height: 28px;
	}
}

.game-tooltips {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: auto;

	@media (max-width: 480px) {
		flex-direction: column;
		gap: 12px;
	}
}

.mr-4 {
	margin-right: 16px;

	@media (max-width: 480px) {
		margin-right: 0;
	}
}
</style>
