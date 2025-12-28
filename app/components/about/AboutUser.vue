<script setup lang="ts">
defineProps<{
	leftTags?: UserTag[]
	rightTags?: UserTag[]
}>()

const appConfig = useAppConfig()

export interface UserTag {
	text: string
	delay?: number
}
</script>

<template>
<div class="about-user">
	<div class="user-tags-left hidden-mobile">
		<span
			v-for="(tag, index) in leftTags"
			:key="index"
			class="user-tag ani"
			:style="{ animationDelay: `${tag.delay || index * 0.6}s` }"
		>
			{{ tag.text }}
		</span>
	</div>
	<div class="user-avatar">
		<div class="avatar-wrapper ani">
			<img :src="appConfig.author.avatar" :alt="appConfig.author.name" class="avatar-img">
		</div>
		<div class="avatar-buttons ani">
			<ZButton
				icon="ri:file-list-3-line"
				to="https://blog.zsxcoder.top/"
				text="博客"
				primary
			/>
			<ZButton
				icon="ri:github-line"
				to="https://github.com/zsxcoder"
				text="GitHub"
			/>
		</div>
	</div>
	<div class="user-tags-right hidden-mobile">
		<span
			v-for="(tag, index) in rightTags"
			:key="index"
			class="user-tag ani"
			:style="{ animationDelay: `${tag.delay || index * 0.6}s` }"
		>
			{{ tag.text }}
		</span>
	</div>
</div>
</template>

<style lang="scss" scoped>
.about-user {
	display: flex;
	align-items: center;
	justify-content: center;
	margin-bottom: 2rem;
	padding: 2rem 0;
}

.user-tags-left,
.user-tags-right {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.user-tags-left {
	align-items: flex-end;
	margin-right: 1rem;
}

.user-tags-right {
	align-items: flex-start;
	margin-left: 1rem;
}

.user-tag {
	padding: 0.25rem 0.75rem;
	background: var(--c-bg-2);
	border: 1px solid var(--c-border);
	border-radius: 9999px;
	font-size: 0.875rem;
	font-weight: 600;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	transform: translate(0, -4px);
	animation: 6s ease-in-out 0s infinite;
}

.user-tag:first-child,
.user-tag:last-child {
	margin-right: -0.5rem;
}

.avatar-wrapper {
	position: relative;
	width: 180px;
	height: 180px;
	border-radius: 50%;
	overflow: hidden;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	cursor: pointer;
	transition: transform 0.3s, box-shadow 0.3s;
	transform: translate(0, -4px);
	animation: 6s ease-in-out 0s infinite;

	&:hover {
		transform: scale(1.1) rotate(360deg);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
	}
}

.avatar-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 50%;
}

.avatar-buttons {
	display: flex;
	gap: 1rem;
	justify-content: center;
	margin-top: 1rem;
	animation: floating 6s ease-in-out 0s infinite;
}

@keyframes floating {
	0% {
		transform: translate(0, -4px);
	}
	50% {
		transform: translate(0, 4px);
	}
	100% {
		transform: translate(0, -4px);
	}
}

.ani {
	animation: floating 6s ease-in-out 0s infinite;
}

@media (max-width: 768px) {
	.hidden-mobile {
		display: none;
	}

	.about-user {
		flex-direction: column;
		gap: 1rem;
	}

	.avatar-buttons {
		gap: 0.75rem;
		margin-top: 0.75rem;
	}
}

@media (max-width: 480px) {
	.avatar-buttons {
		gap: 0.5rem;
		margin-top: 0.5rem;
	}
}
</style>
