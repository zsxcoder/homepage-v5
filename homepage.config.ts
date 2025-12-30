// 存储 nuxt.config 和 app.config 共用的配置

import type { NitroConfig } from 'nitropack'

const author = {
	name: '钟神秀',
	avatar: 'https://wsrv.nl/?url=github.com/zsxcoder.png',
	email: '3149261770@qq.com',
	homepage: 'https://home.zsxcoder.top/',
}

const homepageConfig = {
	title: '钟神秀 (@ZSXCoder)',
	subtitle: '造化钟神秀，阴阳割昏晓。',
	description: '钟神秀（也称作克喵爱吃卤面、克喵、ZSX）是一名开源爱好者、博客写作者，这是钟神秀的个人主页。他有博客「ZSXの小站」，记录了他在生活和技术学习中的点滴经历，充满启发与思考。他的个人主页和博客界面简洁美观，内容丰富实用，人气互动活跃，涵盖了编程、生活、学习等多个领域，为读者提供了卓越的阅读体验。',
	author,
	language: 'zh-CN',
	timezone: 'Asia/Shanghai',
	favicon: '/icon.png',
	url: 'https://home.zsxcoder.top/',
	blogAtom: 'https://blog.zsxcoder.top/atom.xml',
	// 外链跳转配置
	safego: {
		enable: true,
		enableBase64Encode: true,
		countdowntime: 4,
		enableDarkMode: 'auto' as 'auto' | boolean,
		// 域名白名单（包含这些域名的链接不会跳转）
		domainWhitelist: [
			'zsxcoder.top',
			'github.com',
			'home.zsxcoder.top',
			'blog.zsxcoder.top',
		],
		// 忽略处理的链接属性
		ignoreAttrs: ['data-fancybox', 'data-nolink'],
	},
	// Mastodon 配置
	mastodon: {
		instance: 'ech0.zhzsx.cn',
		userId: '115732018075313174', // 请填写你的 Mastodon 用户 ID
		token: '', // 可选：如果需要访问私有内容，请填写访问令牌
		tag: '', // 可选：筛选特定标签
		shownMax: 30, // 最多显示多少条
	},
}

// https://nitro.build/config#routerules
export const routeRules: NitroConfig['routeRules'] = {
	'/api/avatar.png': { redirect: author.avatar },
	'/api/icon.png': { redirect: homepageConfig.favicon },
	'/favicon.ico': { redirect: homepageConfig.favicon },
}

export default homepageConfig

// <a href="https://example.com" data-nolink>不被处理的链接</a>
