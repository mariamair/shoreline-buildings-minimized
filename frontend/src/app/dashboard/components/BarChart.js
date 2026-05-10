/**
 * Defines the bar chart component.
 *
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { useRouter } from 'next/navigation'

export default function BarChart({ data }) {

  const regionNames = data.map(item => item.region.name)
  const values = data.map(item => item.buildingCount)

  // Get the resolved value of a CSS variable
  const getCssVar = (variable) =>
    getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim()

  const chartRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const chart = echarts.init(chartRef.current)

    chart.setOption({
      backgroundColor: getCssVar('--color-secondary-white'), 
      tooltip: {
        trigger: 'item',
        formatter: (params) =>
          `${params.seriesName}<br/>${params.marker}${params.name}: ${params.value.toLocaleString()}`
      },
      xAxis: {
        data: regionNames,
        axisLabel: {
          rotate: 45,
          interval: 0,
          margin: 12
        }
      },
      yAxis: {},
      series: [{
        name: 'Buildings',
        type: 'bar',
        color: getCssVar('--map-range-high'),
        data: values,
        label: {
          show: true,
          formatter: (params) => params.value.toLocaleString(),
          fontSize: 10,
          color: getCssVar('--text-dark')
        },
        emphasis: {
          label: { 
            show: true,
            color: getCssVar('--text-primary')
          },
          itemStyle: { color: getCssVar('--map-highlight') }  // Highlight on hover
        }
      }],
      media: [{
        query: {
          maxWidth: 750
        },
        option: {
          xAxis: { 
            type: 'value',
            axisLabel: {
              formatter: (value) => value.toLocaleString(),
              rotate: 45,
              interval: 0,
              margin: 12
            }, 
          },
          yAxis: { 
            data: regionNames, 
            type: 'category'
          }
        }
      }, {
        query: {
          minWidth: 751
        },
        option: {
          xAxis: { 
            data: regionNames, 
            type: 'category',
            axisLabel: {
              rotate: 45,
              interval: 0,
              margin: 12
            }
          },
          yAxis: { 
            type: 'value',
            axisLabel: {
              formatter: (value) => value.toLocaleString()
            }
          }
        }
      }]
    })

    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
    }
  }, [regionNames, values, router])

  return <div ref={chartRef} style={{ 
    width: '100%', 
    height: '600px', 
    borderRadius: '0.3rem', 
    overflow: 'hidden' 
  }} />
}
