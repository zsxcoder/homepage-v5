/**
 * 外链安全跳转工具
 * 参考：https://github.com/willow-god/hexo-safego
 */

export interface SafegoOptions {
	enable?: boolean
	enableBase64Encode?: boolean
	countdowntime?: number
	enableDarkMode?: 'auto' | boolean
	domainWhitelist?: string[]
	ignoreAttrs?: string[]
}

const defaultOptions: SafegoOptions = {
	enable: true,
	enableBase64Encode: true,
	countdowntime: 4,
	enableDarkMode: 'auto',
	domainWhitelist: [],
	ignoreAttrs: ['data-fancybox', 'data-nolink'],
}

/**
 * Base64 URL 安全编码
 */
function encodeSafeUrlParam(str: string): string {
	const base64 = btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
		String.fromCharCode(Number(`0x${p1}`)),
	))
	// 将 Base64 编码结果中的 "+" 和 "/" 转换为 URL 安全字符
	return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * 检查 URL 是否在白名单中
 */
function isUrlWhitelisted(url: string, whitelist: string[]): boolean {
	try {
		// 相对路径和锚点链接不需要检查
		if (url.startsWith('/') || url.startsWith('#')) {
			return true
		}

		// 非 http/https 协议的链接直接通过
		if (!url.match(/^https?:\/\//)) {
			return true
		}

		const hostname = new URL(url).hostname
		return whitelist.some(domain => hostname.endsWith(domain))
	}
	catch {
		return false
	}
}

/**
 * 转换外链为安全跳转链接
 */
export function transformExternalLink(
	url: string,
	options: Partial<SafegoOptions> = {},
): string {
	const config = { ...defaultOptions, ...options }

	// 未启用或没有 URL
	if (!config.enable || !url) {
		return url
	}

	// 检查白名单
	if (isUrlWhitelisted(url, config.domainWhitelist || [])) {
		return url
	}

	// Base64 编码
	const encodedUrl = config.enableBase64Encode ? encodeSafeUrlParam(url) : url

	return `/go?u=${encodedUrl}`
}

/**
 * 检查元素是否应该被忽略（基于属性）
 */
export function shouldIgnoreLink(element: HTMLElement, ignoreAttrs: string[]): boolean {
	if (!ignoreAttrs || ignoreAttrs.length === 0) {
		return false
	}
	return ignoreAttrs.some(attr => element.hasAttribute(attr))
}

/**
 * 处理页面中的所有外链
 */
export function processExternalLinks(options: Partial<SafegoOptions> = {}): void {
	if (typeof window === 'undefined') {
		return
	}

	const config = { ...defaultOptions, ...options }

	if (!config.enable) {
		return
	}

	const links = document.querySelectorAll('a')
	links.forEach((link) => {
		const href = link.getAttribute('href')
		if (!href) {
			return
		}

		// 检查是否应该忽略
		if (shouldIgnoreLink(link, config.ignoreAttrs || [])) {
			return
		}

		// 转换链接
		const newHref = transformExternalLink(href, config)
		if (newHref !== href) {
			link.setAttribute('href', newHref)
			link.setAttribute('rel', 'external nofollow noopener noreferrer')
			link.setAttribute('target', '_blank')
		}
	})
}

/**
 * 获取安全跳转页面 URL
 */
export function getSafeGoPageUrl(targetUrl: string, options: Partial<SafegoOptions> = {}): string {
	return transformExternalLink(targetUrl, options)
}

/**
 * 判断链接是否为外部链接
 */
export function isExternalLink(url: string, domainWhitelist: string[] = []): boolean {
	if (!url || url.startsWith('/') || url.startsWith('#')) {
		return false
	}

	if (!url.match(/^https?:\/\//)) {
		return false
	}

	try {
		const hostname = new URL(url).hostname
		return !domainWhitelist.some(domain => hostname.endsWith(domain))
	}
	catch {
		return false
	}
}

// 导出类型
export type { SafegoOptions }
