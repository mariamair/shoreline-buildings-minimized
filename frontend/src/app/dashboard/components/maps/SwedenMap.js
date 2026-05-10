/**
 * Defines the map component.
 *
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { useRouter } from 'next/navigation'

export default function SwedenMap({ data, onRegionClick }) {

  const mapData = data.map(item => ({ 
    name: item.region.name,
    code: item.region.code,
    value: item.buildingCount
  }))

  // Get the resolved value of a CSS variable
  const getCssVar = (variable) =>
    getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim()

  const chartRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const chart = echarts.init(chartRef.current)

    // Load GeoJSON and register it with ECharts
    fetch('/geodata/swedish_regions.geojson')
      .then(res => res.json())
      .then(geoJson => {
        echarts.registerMap('sweden', geoJson)

        chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: (params) => `
              <div>
              <strong>${params.name}</strong><br/>
              ${(params.value ?? 0).toLocaleString()} buildings
              </div>
            `
          },
          visualMap: {
            min: 0,
            max: Math.max(...mapData.map(d => d.value)),
            left: 'left',
            top: 'bottom',
            text: ['High', 'Low'],
            textStyle: {
              color: getCssVar('--text-primary')
            },
            calculable: true,
            inRange: {
              color: [
                getCssVar('--map-range-low'), 
                getCssVar('--map-range-high')
              ]
            }
          },
          series: [{
            type: 'map',
            map: 'sweden',
            roam: true,          // Enable zoom and pan
            label: {
              show: true,
              formatter: function(params) {
                return params.value.toLocaleString()
              },
              fontSize: 10,
              color: getCssVar('--text-dark')
            },
            emphasis: {
              label: { 
                show: true,
                color: getCssVar('--text-primary')
              },
              itemStyle: { areaColor: getCssVar('--map-highlight') }  // Highlight region on hover
            },
            data: mapData
          }]
        })

        // Click region to drill down
        chart.on('click', (params) => {
          if (params.name) {
            onRegionClick(params.data.code)
          }
        })
      })

    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
    }
  }, [mapData, router, onRegionClick])

  return <div ref={chartRef} style={{ width: '100%', height: '600px' }} />
}
