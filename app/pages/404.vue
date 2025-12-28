<script setup lang="ts">
useHead({ title: '404 - 页面未找到' })
definePageMeta({
	title: '404',
})
</script>

<template>
<ZhiluAvatar class="avatar" />
<div class="wrapper">
	<ZField>
		<template #label>
			<span style="font-size: 3rem;">🔍</span>
		</template>
		<h1 style="font-size: 3rem;">
			404<br><mark>页面未找到</mark>
		</h1>
		<p class="desc">
			抱歉，您访问的页面不存在
		</p>
		<div>
			<ZButton
				icon="ri:home-line"
				to="/"
				text="返回主页"
				primary
			/>
			<ZButton
				icon="ri:file-list-3-line"
				to="https://blog.zsxcoder.top/"
				text="博客"
			/>
		</div>
	</ZField>
</div>
</template>

<style lang="scss" scoped>
.avatar {
	position: fixed;
	opacity: 0.2;
	top: 0;
	right: 20vw;
	margin-right: -0.4em;
	font-size: min(100vw, 60vh);
	z-index: -1;
}

.desc {
	margin: 1rem 0;
	font-size: 1.5rem;
	color: var(--c-text-2);
}
</style>
