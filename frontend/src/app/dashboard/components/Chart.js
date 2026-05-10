/**
 * Defines the chart component.
 * 
 * Note: ECharts is client-side only and manipulates the DOM directly. 
 * Prerequisites: mark any component using ECharts with "use client" 
 * and make sure it only renders in the browser.
 *
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

export default function Chart({ option, style }) {
  const chartRef = useRef(null)

  useEffect(() => {
    const chart = echarts.init(chartRef.current)
    chart.setOption(option)

    // handle resize
    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
    }
  }, [option])

  return <div ref={chartRef} style={{ width: '100%', height: '400px', ...style }} />
}
