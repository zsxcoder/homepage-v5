<script setup lang="ts">
useHead({ title: '项目' })
definePageMeta({ headerText: '参与的开源项目' })

const projects = [
	{
		title: 'blog-v3',
		github: 'zsxcoder/blog-v3',
		description: '基于纸鹿的博客自改',
	},
	{
		title: 'homepage-v5',
		github: 'zsxcoder/homepage-v5',
		description: '基于纸鹿的主页自改',
	},
	{
		title: 'Notion Moments',
		github: 'zsxcoder/notion-moments',
		description: '使用Notion的说说',
	},
	{
		title: 'Hugo Notion Moment',
		github: 'zsxcoder/notion-moment-hugo',
		description: '使用Notion作为数据源的Hugo主题说说',
	},
	{
		title: 'Talking-server',
		github: 'zsxcoder/Talking-server',
		description: '现代化的社交动态管理服务',
	},
	{
		title: 'Ech0',
		github: 'lin-snow/Ech0',
		description: '面向个人的新一代开源、自托管、专注思想流动的轻量级联邦发布平台',
	},
]
</script>

<template>
<section>
	<ZProject v-for="project in projects" :key="project.title" v-bind="project" />
</section>
</template>

<style lang="scss" scoped>
section {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(20em, 1fr));
	gap: 1rem;
}
</style>
