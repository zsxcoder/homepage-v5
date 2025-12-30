// 友链状态类型
export interface LinkStatus {
	link: string
	latency: number
}

export interface FlinkStatusData {
	link_status: LinkStatus[]
}

const CACHE_KEY = 'statusTagsData'
const CACHE_EXPIRATION_TIME = 30 * 60 * 1000 // 半小时
const JSON_URL = 'https://check-flink.mcyzsx.top/result.json'

export function useFlinkStatus() {
	const statusData = ref<FlinkStatusData | null>(null)
	const isLoading = ref(false)
	const error = ref<string | null>(null)

	// 从缓存获取数据
	function getFromCache(): FlinkStatusData | null {
		try {
			const cached = localStorage.getItem(CACHE_KEY)
			if (cached) {
				const { data, timestamp } = JSON.parse(cached)
				if (Date.now() - timestamp < CACHE_EXPIRATION_TIME) {
					return data
				}
			}
		}
		catch (err) {
			console.error('Error reading cache:', err)
		}
		return null
	}

	// 保存到缓存
	function saveToCache(data: FlinkStatusData) {
		try {
			const cacheData = {
				data,
				timestamp: Date.now(),
			}
			localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
		}
		catch (err) {
			console.error('Error saving cache:', err)
		}
	}

	// 获取状态
	async function fetchStatusData() {
		if (isLoading.value)
			return

		isLoading.value = true
		error.value = null

		try {
			// 先检查缓存
			const cached = getFromCache()
			if (cached) {
				statusData.value = cached
				return
			}

			// 从 API 获取数据
			const response = await fetch(JSON_URL)
			if (!response.ok)
				throw new Error(`HTTP error! status: ${response.status}`)

			const data = await response.json() as FlinkStatusData
			statusData.value = data
			saveToCache(data)
		}
		catch (err) {
			error.value = err instanceof Error ? err.message : 'Unknown error'
			console.error('Error fetching flink status:', err)
		}
		finally {
			isLoading.value = false
		}
	}

	// 根据链接获取状态
	function getLinkStatus(link: string): LinkStatus | null {
		if (!statusData.value)
			return null

		const normalizedLink = link.replace(/\/$/, '')
		return statusData.value.link_status.find(
			item => item.link.replace(/\/$/, '') === normalizedLink,
		) || null
	}

	// 获取状态样式和文本
	function getStatusInfo(link: string): { text: string, className: string } | null {
		const status = getLinkStatus(link)
		if (!status)
			return null

		if (status.latency === -1)
			return { text: '未知', className: 'status-tag-red' }

		const latencyText = `${status.latency.toFixed(2)} s`
		let className = 'status-tag-red' // 默认红色

		if (status.latency <= 2)
			className = 'status-tag-green'
		else if (status.latency <= 5)
			className = 'status-tag-light-yellow'
		else if (status.latency <= 10)
			className = 'status-tag-dark-yellow'

		return { text: latencyText, className }
	}

	// 初始化
	onMounted(() => {
		fetchStatusData()
	})

	return {
		statusData,
		isLoading,
		error,
		getLinkStatus,
		getStatusInfo,
		fetchStatusData,
	}
}
