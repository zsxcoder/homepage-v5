/**
 * 外链安全跳转插件
 * 参考：https://github.com/willow-god/hexo-safego
 */

export default defineNuxtPlugin(() => {
	const appConfig = useAppConfig()

	// 从配置中获取外链跳转设置
	const safegoConfig = computed(() => {
		const config = (appConfig as any).safego || {}
		return {
			enable: config.enable !== false,
			enableBase64Encode: config.enableBase64Encode !== false,
			countdowntime: config.countdowntime ?? 4,
			enableDarkMode: config.enableDarkMode ?? 'auto',
			domainWhitelist: config.domainWhitelist || [],
			ignoreAttrs: config.ignoreAttrs || ['data-fancybox', 'data-nolink'],
		}
	})

	// 页面加载完成后处理外链
	onMounted(() => {
		if (!safegoConfig.value.enable) {
			return
		}

		// 使用 nextTick 确保在 DOM 更新后处理
		nextTick(() => {
			const { processExternalLinks } = useSafego()
			processExternalLinks(safegoConfig.value)
		})

		// 监听路由变化，在页面切换后重新处理链接
		const route = useRoute()
		watch(() => route.path, () => {
			nextTick(() => {
				const { processExternalLinks } = useSafego()
				processExternalLinks(safegoConfig.value)
			})
		})
	})

	return {
		provide: {
			safego: safegoConfig,
		},
	}
})
