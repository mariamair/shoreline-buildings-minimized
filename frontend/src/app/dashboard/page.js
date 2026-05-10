/**
 * Defines the dashboard component.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

'use client'

import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FilterContext } from './context/FilterContext'
import { fetchData } from './actions.js'
import SelectAreaType from './components/SelectAreaType.js'
import SelectYear from './components/SelectYear'
import SwedenMap from './components/maps/SwedenMap.js'
import styles from './page.module.css'

export default function Dashboard() {
  const router = useRouter()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Get filter values from context
  const { filterValues, setFilterValues } = useContext(FilterContext)

  const handleRegionClick = (regionCode) => {
    filterValues.parentRegionCode = regionCode
    router.push('/dashboard/regionMap')
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {

        // Reset filter values on site navigation
        filterValues.regionTypeId = 2
        delete filterValues.parentRegionCode

        const result = await fetchData(filterValues)
        setData(result)
        router.refresh
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [filterValues, router.refresh])


  return (
    <main className={styles.main}>
      <h1>Dashboard</h1>
      <h3>Shoreline Buildings per Region</h3>
      <p className={styles.informationText}>
        Number of buildings within 100 metres from a shoreline.
      </p>
      <div className={styles.filter}>
        <SelectYear 
          value={filterValues.year} 
          onChange={(year) => setFilterValues({ ...filterValues, year })} />
        <SelectAreaType 
          value={filterValues.areaTypeId} 
          onChange={(areaTypeId) => setFilterValues({ ...filterValues, areaTypeId })} />
      </div>
      {loading && <p className={styles.loading}>Loading data...</p>}
      {data && <SwedenMap 
        data={data.buildingCountEntities.items}filterValues={filterValues}
        onRegionClick={handleRegionClick} />}
      <p className={styles.sourceInfo}>Data from <a href="https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__MI__MI0812__MI0812S/MI0812T01/">SCB (Statistics Sweden)</a></p>
      <p className={styles.sourceInfo}>Map from <a href="https://github.com/okfse/sweden-geojson">https://github.com/okfse/sweden-geojson</a></p>
    </main>
  )
}
