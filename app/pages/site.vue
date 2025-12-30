<script setup lang="ts">
import type { CardProps } from '~/components/partial/Card.vue'
import { ZLink } from '#components'

useHead({ title: '站点' })
definePageMeta({ headerText: '一些网站' })

const toolSites: Array<CardProps> = [
	{
		name: 'NotionNext 导航',
		nameAlt: 'notionnext-nav',
		buttons: [
			{ icon: 'ph:planet-duotone', text: '访问', to: 'https://nav.zsxcoder.top' },
			{ icon: 'ph:github-logo-duotone', text: 'GitHub', to: 'https://github.com/zsxcoder/notionnext' },
		],
		desc: '基于Notion的Nav导航。',
	},
	{
		name: 'Ech0',
		nameAlt: 'Ech0',
		buttons: [
			{ icon: 'ph:planet-duotone', text: '访问', to: 'https://ech0.050815.xyz' },
			{ icon: 'ph:github-logo-duotone', text: 'GitHub', to: 'https://github.com/lin-snow/Ech0' },
		],
		desc: '面向个人的新一代开源、自托管、专注思想流动的轻量级联邦发布平台。',
	},
	{
		name: 'Phanpy',
		nameAlt: 'Phanpy',
		buttons: [
			{ icon: 'ph:planet-duotone', text: '访问', to: 'https://mastodon.mcyzsx.top' },
			{ icon: 'ph:github-logo-duotone', text: 'GitHub', to: 'https://github.com/zsxcoder/Phanpy' },
		],
		desc: 'A minimalistic opinionated Mastodon web client',
	},
	{
		name: 'ZSX-Music',
		nameAlt: 'ZSX-Music',
		buttons: [
			{ icon: 'ph:planet-duotone', text: '访问', to: 'https://music.zsx815.top/' },
			{ icon: 'ph:github-logo-duotone', text: 'GitHub', to: 'https://github.com/mcyzsx/ZSX-Music' },
		],
		desc: '基于张洪的音乐播放器自用。',
	},
	{
		name: 'Notion-Photo',
		nameAlt: 'Notion-Photo',
		buttons: [
			{ icon: 'ph:planet-duotone', text: '访问', to: 'https://plog.zsxcoder.top' },
			{ icon: 'ph:github-logo-duotone', text: 'GitHub', to: 'https://github.com/zsxcoder/notionnext' },
		],
		desc: '基于Notion的相册。',
	},
	{
		name: '友链朋友圈',
		nameAlt: '友链朋友圈',
		buttons: [
			{ icon: 'ph:planet-duotone', text: '访问', to: 'https://fc.mcyzsx.top' },
			{ icon: 'ph:github-logo-duotone', text: 'GitHub', to: 'https://github.com/zsxcoder/Friend-Circle-Lite' },
		],
		desc: '一个精简版，无后端，且仅利用github action运行的精简版友链朋友圈程序。',
	},
	{
		name: '友链申请',
		nameAlt: '友链申请',
		buttons: [
			{ icon: 'ph:planet-duotone', text: '访问', to: 'https://link.314926.xyz/' },
			{ icon: 'ph:github-logo-duotone', text: 'GitHub', to: 'https://github.com/zsxcoder/links-app-workers' },
		],
		desc: '基于 Cloudflare Workers 和 KV 存储的友链申请系统。',
	},
	{
		name: '友链检测',
		nameAlt: '友链检测',
		buttons: [
			{ icon: 'ph:planet-duotone', text: '访问', to: 'https://check-flink.mcyzsx.top/' },
			{ icon: 'ph:github-logo-duotone', text: 'GitHub', to: 'https://github.com/zsxcoder/check-flink' },
		],
		desc: '⚙️检查友链链接是否可连，可以大幅度减少检查工作量。',
	},
	{
		name: 'memos-cloudflare',
		nameAlt: 'memos-cloudflare',
		buttons: [
			{ icon: 'ph:planet-duotone', text: '访问', to: 'https://memos.mcyzsx.top' },
			{ icon: 'ph:github-logo-duotone', text: 'GitHub', to: 'https://github.com/mcyzsx/memos-cloudflare' },
		],
		desc: () => h('div', [
			'运行在cloudflare平台上的memos复刻程序',
		]),
	},
	{
		name: 'moments-cloudflare',
		nameAlt: 'moments-cloudflare',
		buttons: [
			{ icon: 'ph:planet-duotone', text: '访问', to: 'https://moment.mcyzsx.top' },
			{ icon: 'ph:github-logo-duotone', text: 'GitHub', to: 'https://github.com/mcyzsx/moments-cloudflare' },
		],
		desc: () => h('div', [
			'moments项目cloudflare版本',
		]),
	},
]

const orgSites: Array<CardProps> = [
	{
		name: 'blog-v3',
		nameAlt: 'blog-v3',
		buttons: [
			{ icon: 'ph:planet-duotone', text: '访问', to: 'https://blog.zsxcoder.top' },
			{ icon: 'ph:github-logo-duotone', text: 'GitHub', to: 'https://github.com/zsxcoder/nuxt-blog-v3' },
		],
		desc: '基于纸鹿的博客的魔改',
	},
	{
		name: 'homepage-v5',
		nameAlt: 'homepage-v5',
		buttons: [
			{ icon: 'ph:planet-duotone', text: '访问', to: 'https://home.zsxcoder.top' },
			{ icon: 'ph:github-logo-duotone', text: 'GitHub', to: 'https://github.com/zsxcoder/homepage-v5' },
		],
		desc: () => h('div', [
			'基于纸鹿的主页的魔改。',
		]),
	},
	{
		name: 'ethereal-blog',
		nameAlt: 'ethereal-blog',
		buttons: [
			{ icon: 'ph:planet-duotone', text: '访问', to: 'https://myblog.zsxcoder.top' },
			{ icon: 'ph:github-logo-duotone', text: 'GitHub', to: 'https://github.com/zsxcoder/ethereal' },
		],
		desc: () => h('div', [
			'A GitHub Issue blog theme based on Vue 2',
		]),
	},
	{
		name: 'BroadcastChannel',
		nameAlt: 'BroadcastChannel',
		buttons: [
			{ icon: 'ph:planet-duotone', text: '访问', to: 'https://tg.mcyzsx.top' },
			{ icon: 'ph:github-logo-duotone', text: 'GitHub', to: 'https://github.com/zsxcoder/BroadcastChannel' },
		],
		desc: () => h('div', [
			'Turn your Telegram Channel into a MicroBlog.',
		]),
	},
	{
		name: 'vercel-mastondon',
		nameAlt: 'vercel-mastondon',
		buttons: [
			{ icon: 'ph:planet-duotone', text: '访问', to: 'https://m.mcyzsx.top' },
			{ icon: 'ph:github-logo-duotone', text: 'GitHub', to: 'https://github.com/zsxcoder/vercel-mastondon' },
		],
		desc: () => h('div', [
			'部署在Vercel的个人说说页面, 基于 Mastodon / Pleroma / Gotosocial API',
		]),
	},
	{
		name: 'vercel-mastondon',
		nameAlt: 'vercel-mastondon',
		buttons: [
			{ icon: 'ph:planet-duotone', text: '访问', to: 'https://memos.mcyzsx.top' },
			{ icon: 'ph:github-logo-duotone', text: 'GitHub', to: 'https://github.com/mcyzsx/memos-cloudflare' },
		],
		desc: () => h('div', [
			'运行在cloudflare平台上的memos复刻程序',
		]),
	},
	{
		name: 'gwitter',
		nameAlt: 'gwitter',
		buttons: [
			{ icon: 'ph:planet-duotone', text: '访问', to: 'https://gwitter.zsxcoder.top' },
			{ icon: 'ph:github-logo-duotone', text: 'GitHub', to: 'https://github.com/mcyzsx/gwitter' },
		],
		desc: () => h('div', [
			'Turn GitHub Issues into your personal microblog platform',
		]),
	},
	{
		name: 'notion-moment-hugo',
		nameAlt: 'notion-moment-hugo',
		buttons: [
			{ icon: 'ph:planet-duotone', text: '访问', to: 'https://talk.zsxcoder.top' },
			{ icon: 'ph:github-logo-duotone', text: 'GitHub', to: 'https://github.com/mcyzsx/notion-moment-hugo' },
		],
		desc: () => h('div', [
			'基于Hugo的Notion说说',
		]),
	},
]
</script>

<template>
<ZTitle>工具类站点</ZTitle>
<ZCardList :data-list="toolSites" />
<ZTitle>博客&主页</ZTitle>
<ZCardList :data-list="orgSites" />
</template>

<style lang="scss" scoped>
</style>
