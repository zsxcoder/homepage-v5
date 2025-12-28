<script setup lang="ts">
const mbtiBanner = '/about/advocate.svg'
const userImg = '/about/me.jpg'
const meBanner = '/about/banner.webp'
</script>

<template>
<div class="about-personality">
	<!-- 左侧 MBTI 性格卡片 -->
	<div class="personality-card personality-left">
		<div class="personality-banner">
			<div class="personality-overlay">
				<div class="personality-subtitle">
					性格
				</div>
				<div class="personality-title">
					提倡者
				</div>
				<div class="personality-type">
					INFJ-T
				</div>
				<div class="personality-link">
					<a href="https://www.16personalities.com/infj-personality" target="_blank">
						了解,测试一下
					</a>
				</div>
			</div>
			<div class="personality-image">
				<img :src="mbtiBanner" alt="MBTI" />
			</div>
		</div>
	</div>

	<!-- 右侧用户照片卡片 -->
	<div class="personality-card personality-right">
		<img class="me-image" :src="meBanner" alt="Me" />
		<div class="user-avatar">
			<img :src="userImg" alt="User" />
		</div>
		<div class="dark-overlay" />
	</div>
</div>
</template>

<style lang="scss" scoped>
.about-personality {
	display: block;
	gap: 26px;
	margin-top: 16px;

	@media (min-width: 768px) {
		display: flex;
		margin-top: 26px;
	}

	@media (max-width: 480px) {
		gap: 8px;
		margin-top: 8px;
	}
}

.personality-card {
	position: relative;
	border-radius: 1rem;
	border: 1px solid #e3e8f7;
	background: rgba(224, 214, 228, 0.1);
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
	overflow: hidden;

	.dark & {
		border-color: #3d3d3f;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.31);
	}
}

.personality-left {
	width: 100%;

	@media (min-width: 768px) {
		width: 60%;
	}
}

.personality-right {
	flex: 1;
	margin-top: 16px;
	height: 150px;

	@media (min-width: 768px) {
		margin-top: 0;
		height: 180px;
	}

	@media (max-width: 480px) {
		margin-top: 12px;
		height: 120px;
	}
}

.personality-banner {
	position: relative;
	height: 180px;
}

.personality-overlay {
	position: absolute;
	left: 0;
	top: 0;
	z-index: 2;
	width: 100%;
	height: 100%;
	padding: 8px;
	border-radius: 1rem;
	display: flex;
	flex-direction: column;
	background: linear-gradient(90deg, rgba(255, 255, 255, 0.5), rgba(0, 0, 0, 0));

	@media (min-width: 768px) {
		padding: 40px;
	}

	@media (max-width: 480px) {
		padding: 4px;
		border-radius: 0.5rem;
	}

	.dark & {
		background: linear-gradient(90deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
	}
}

.personality-subtitle {
	font-size: 14px;
	color: #888;
}

.personality-title {
	font-size: 24px;
	font-weight: 700;
	color: var(--c-text);
}

.personality-type {
	font-size: 24px;
	font-weight: 700;
	color: #88619a;
}

.personality-link {
	margin-top: auto;
	a {
		font-size: 12px;
		color: var(--c-text);
		opacity: 0.75;

		&:hover {
			opacity: 1;
		}
	}
}

.personality-image {
	position: absolute;
	bottom: 0;
	right: 0;
	z-index: 1;
	height: 100%;
	overflow: hidden;

	img {
		height: 100%;
	}
}

.me-image {
	width: 100%;
	height: 100%;
	border-radius: 1rem;
	border: 1px solid #e3e8f7;
	object-fit: cover;

	.dark & {
		border-color: #3d3d3f;
	}
}

.user-avatar {
	position: absolute;
	right: 10px;
	bottom: 10px;
	width: 42px;
	height: 42px;
	border-radius: 50%;
	overflow: hidden;
	border: 1px solid #e3e8f7;

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
}

.dark-overlay {
	position: absolute;
	inset: 0;

	.dark & {
		background: rgba(0, 0, 0, 0.3);
	}
}
</style>
