import type * as echarts from 'echarts'

const INIT_MAP = new WeakMap<echarts.ECharts, boolean>()

interface MyChartType extends echarts.ECharts {
	__resizeTimer?: ReturnType<typeof setTimeout>
}

export function installChartResize(el: HTMLDivElement, myChart: MyChartType, resizeFn?: Function) {
	INIT_MAP.set(myChart, false)
	const resizeObserver = new ResizeObserver(() => {
		clearTimeout(myChart.__resizeTimer)
		myChart.__resizeTimer = setTimeout(() => {
			if (INIT_MAP.get(myChart)) {
				myChart.resize({
					animation: { duration: 300 },
				})
				if (resizeFn) {
					resizeFn()
				}
			}
			INIT_MAP.set(myChart, true)
		}, 200)
	})
	resizeObserver.observe(el)

	const originalDispose = myChart.dispose
	myChart.dispose = () => {
		resizeObserver.disconnect()
		originalDispose.call(myChart)
	}
}
