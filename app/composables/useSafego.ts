/**
 * 外链安全跳转 Composable
 * 参考：https://github.com/willow-god/hexo-safego
 */

import type { SafegoOptions } from '~/utils/safego'
import { transformExternalLink, isExternalLink, processExternalLinks, shouldIgnoreLink, getSafeGoPageUrl } from '~/utils/safego'

export function useSafego() {
	const appConfig = useAppConfig()

	// 获取外链跳转配置
	const config = computed(() => {
		const safegoConfig = (appConfig as any).safego || {}
		return {
			enable: safegoConfig.enable !== false,
			enableBase64Encode: safegoConfig.enableBase64Encode !== false,
			countdowntime: safegoConfig.countdowntime ?? 4,
			enableDarkMode: safegoConfig.enableDarkMode ?? 'auto',
			domainWhitelist: safegoConfig.domainWhitelist || [],
			ignoreAttrs: safegoConfig.ignoreAttrs || ['data-fancybox', 'data-nolink'],
		}
	})

	/**
	 * 转换外链为安全跳转链接
	 */
	const transformLink = (url: string, options?: Partial<SafegoOptions>) => {
		const mergedOptions = { ...config.value, ...options }
		return transformExternalLink(url, mergedOptions)
	}

	/**
	 * 判断链接是否为外部链接
	 */
	const isExternal = (url: string, domainWhitelist?: string[]) => {
		return isExternalLink(url, domainWhitelist || config.value.domainWhitelist)
	}

	/**
	 * 处理页面中的所有外链
	 */
	const processLinks = (options?: Partial<SafegoOptions>) => {
		processExternalLinks({ ...config.value, ...options })
	}

	// 导出所有工具函数
	return {
		config,
		transformLink,
		isExternal,
		processLinks,
		transformExternalLink,
		isExternalLink,
		processExternalLinks,
		shouldIgnoreLink,
		getSafeGoPageUrl,
	}
}
