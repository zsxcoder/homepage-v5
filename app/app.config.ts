import type { Nav } from '~/types/nav'
import { h } from 'vue'
import homepageConfig from '~~/homepage.config'

// 图标查询：https://yesicon.app/ph
// 图标插件：https://marketplace.visualstudio.com/items?itemName=antfu.iconify

export default defineAppConfig({
	...homepageConfig,

	// 外链跳转配置
	safego: homepageConfig.safego || {
		enable: true,
		enableBase64Encode: true,
		countdowntime: 4,
		enableDarkMode: 'auto',
		domainWhitelist: [
			'zsxcoder.top',
			'github.com',
			'home.zsxcoder.top',
			'blog.zsxcoder.top',
		],
		ignoreAttrs: ['data-fancybox', 'data-nolink'],
	},

	footer: [
		`© ${new Date().getFullYear()} 钟神秀`,
		// h('a', { href: 'https://beian.miit.gov.cn/', target: '_blank', rel: 'noopener nofollow' }, '陕ICP备2025082251号'),
	],

	// 用于在主页展示下游引用
	fork: [
		{
			img: 'https://image.m-c.top/?/images/2024/07/21/iyt3mhQCDe/b_a3f6e95501bcc4ce64c19c63a1211bcd.png',
			link: 'https://oio.mckfs.com/',
			text: 'Oiolosse MC服',
		},
		{
			img: 'https://api-space.tnxg.top/avatar?s=qq',
			link: 'https://tnxg.top/',
			text: '天翔TNXG',
		},
		{
			img: 'https://ykc.im/icon.png',
			link: 'https://ykc.im/',
			text: 'York Chou',
		},
		// {
		// 	img: 'https://www.xxfer.cn/icon.png',
		// 	link: 'https://www.xxfer.cn/',
		// 	text: '小李同学',
		// },
		{
			img: 'https://q1.qlogo.cn/g?b=qq&nk=1043865083&s=2',
			link: 'https://www.xlenco.top/',
			text: 'Xlenco',
		},
		{
			img: 'https://www.mugzx.top/icon.png',
			link: 'https://www.mugzx.top/',
			text: 'Mugzx',
		},
		{
			img: 'https://cn.cravatar.com/avatar/1F6C8947D35A8186A1647009BA8BC5F2?size=256',
			link: 'https://www.kemiao.online/',
			text: '克喵爱吃卤面',
		},
		{
			img: 'https://q1.qlogo.cn/g?b=qq&nk=3310149631&s=2',
			link: 'https://gr114.com/',
			text: 'GreenRoc',
		},
		{
			img: 'https://wsrv.nl/?url=github.com/scfcn.png%3fsize=92',
			link: 'https://www.qxzhan.cn/',
			text: '筱序二十',
		},
		{
			img: 'https://file.furrys.im/img/logo.webp',
			link: 'https://www.furrys.im/',
			text: 'lpcay',
		},
	],

	nav: [
		{
			title: '',
			items: [
				{ icon: 'ri:id-card-line', text: '简介', url: '/' },
				{ icon: 'ri:quill-pen-line', text: '文章', url: '/article' },
				{ icon: 'ri:code-line', text: '项目', url: '/project' },
				{ icon: 'ri:planet-line', text: '站点', url: '/site' },
				{ icon: 'ri:history-line', text: '日志', url: '/log' },
				{ icon: 'ri:chat-3-line', text: 'Mastodon', url: '/talk' },
				{ icon: 'ri:wechat-line', text: '说说', url: '/essays' },
				{ icon: 'ri:links-line', text: '友链', url: '/link' },
				{ icon: 'ri:group-line', text: '友链圈', url: '/fcircle' },
				{ icon: 'ri:heart-line', text: '赞助', url: '/sponsor' },
			],
		},
		{
			title: '社交',
			items: [
				{ icon: 'mdi:telegram', text: '克喵', url: 'https://t.me/KemiaoJun' },
				{ icon: 'material-symbols:group', text: 'TG频道', url: 'https://t.me/kemiaofx_me' },
				{ icon: 'ri:mail-line', text: '3149261770@qq.com', url: '3149261770@qq.com' },
				{ icon: 'ri:github-line', text: 'Github', url: 'https://github.com/zsxcoder' },
				{ icon: 'ri:qq-line', text: 'QQ', url: 'https://qm.qq.com/q/eLZhXoSonY' },
				{ icon: 'mdi:mastodon', text: 'Mastodon', url: 'https://mastodon.social/@zsxcoder' },
			],
		},
	] satisfies Nav,

	themes: {
		light: {
			icon: 'ri:sun-line',
			tip: '浅色模式',
		},
		system: {
			icon: 'ri:tv-2-line',
			tip: '跟随系统',
		},
		dark: {
			icon: 'ri:moon-line',
			tip: '深色模式',
		},
	},
})
