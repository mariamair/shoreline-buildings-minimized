/**
 * Defines the region component.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

'use client'

import { useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FilterContext } from '../context/FilterContext'
import { fetchData, fetchRegionName } from '../actions.js'
import SelectAreaType from '../components/SelectAreaType.js'
import SelectRegion from '../components/SelectRegion.js'
import SelectYear from '../components/SelectYear'
import RegionMap from '../components/maps/RegionMap.js'
import styles from '../page.module.css'

export default function RegionPage() {
  const router = useRouter()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [regionName, setRegionName] = useState('')

  // Get filter values from context
  const { filterValues, setFilterValues } = useContext(FilterContext)

  // Set region type and parent region
  const regionTypeMunicipality = 3
  filterValues.parentRegionCode = filterValues.parentRegionCode || '01'
  
  useEffect(() => {
    const result = fetchRegionName(filterValues.parentRegionCode)
    setRegionName(result)
  }, [filterValues.parentRegionCode])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        filterValues.regionTypeId = regionTypeMunicipality
        const result = await fetchData(filterValues)
        setData(result)
        router.refresh
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [filterValues, router.refresh])

  // Display the selected region
  const handleRegionChange = (event) => setFilterValues({ ...filterValues, parentRegionCode: event.target.value })
  

  return (
    <main className={styles.main}>
      <h1>Dashboard</h1>
      <h3>Shoreline Buildings in {regionName}</h3>
      <p className={styles.informationText}>
        Number of buildings within 100 metres from a shoreline.
      </p>
      <div className={styles.filter}>
        <SelectRegion 
          value={filterValues.parentRegionCode} 
          onChange={handleRegionChange} />
        <SelectYear 
          value={filterValues.year} 
          onChange={(year) => setFilterValues({ ...filterValues, year })} />
        <SelectAreaType 
          value={filterValues.areaTypeId} 
          onChange={(areaTypeId) => setFilterValues({ ...filterValues, areaTypeId })} />
      </div>
      {loading && <p className={styles.loading}>Loading data...</p>}
      {data && (
        <RegionMap
          data={data.buildingCountEntities.items}
          regionCode={filterValues.parentRegionCode}
          regionName={regionName}
        />
      )}
      <p className={styles.sourceInfo}>Data from <a href="https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__MI__MI0812__MI0812S/MI0812T01/">SCB (Statistics Sweden)</a></p>
      <p className={styles.sourceInfo}>Map from <a href="https://github.com/okfse/sweden-geojson">https://github.com/okfse/sweden-geojson</a></p>
    </main>
  )
}
