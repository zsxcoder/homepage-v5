import type { Sponsor } from '~/types/sponsor'

// 赞助者数据
// 请按照以下格式添加新的赞助者：
// - name: 赞助者名称
// - avatar: 头像地址（可选）
// - date: 赞助日期
// - amount: 赞助金额

export const sponsors: Sponsor[] = [
	{
		name: '示例赞助者',
		avatar: 'https://wsrv.nl/?url=github.com/zsxcoder.png',
		date: '2024-01-01',
		amount: '¥10.00',
	},
]
