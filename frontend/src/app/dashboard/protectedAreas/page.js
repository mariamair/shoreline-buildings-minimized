/**
 * Defines the bar chart component.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

'use client'

import { useContext, useEffect, useState } from 'react'
import { FilterContext } from '../context/FilterContext'
import { fetchData } from '../actions.js'
import SelectRegion from '../components/SelectRegion'
import SelectRegionType from '../components/SelectRegionType'
import SelectYear from '../components/SelectYear'
import BarChart from '../components/BarChart'
import styles from '../page.module.css'

export default function Numbers() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Get filter values from context
  const { filterValues, setFilterValues } = useContext(FilterContext)

  // Set "inom formellt skyddad natur" (areaTypeId: 3) as area type
  const areaTypeProtected = 3
  filterValues.areaTypeId = areaTypeProtected
  
  // Fetch data for the selected region
  const handleRegionChange = (event) => {
    const selectedRegionCode = event.target.value
    setFilterValues({ ...filterValues, parentRegionCode: selectedRegionCode })
  }

  // Display region selection only when "Kommuner" (regionTypeId: 3) is selected and preselect "01" (Stockholms län) if no parent region code is selected yet
  let displayRegionSelection = false
  if (filterValues.regionTypeId === 3) {
    displayRegionSelection = true
    filterValues.parentRegionCode = filterValues.parentRegionCode || '01'
  } else {
    displayRegionSelection = false
    delete filterValues.parentRegionCode
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const result = await fetchData(filterValues)
        setData(result)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [filterValues])

  return (
    <main className={styles.main}>
      <h1>Dashboard</h1>
      <h3>Buildings in a protected area</h3>
      <p className={styles.informationText}>
        Number of buildings within 100 metres from a shoreline in national parks, nature reserves, 
        nature conservation areas, forest biotope protection areas, and other biotope protection areas.
      </p>
      <div className={styles.filter}>
        <SelectRegionType 
          value={filterValues.regionTypeId} 
          onChange={(regionTypeId) => setFilterValues({ ...filterValues, regionTypeId })} />
        {displayRegionSelection && (
          <SelectRegion 
            value={filterValues.parentRegionCode || '01'} 
            onChange={handleRegionChange} />
        )}
        <SelectYear 
          value={filterValues.year} 
          onChange={(year) => setFilterValues({ ...filterValues, year })} />
      </div>
      {loading && <p className={styles.loading}>Loading data...</p>}
      {data && <BarChart data={data.buildingCountEntities.items} filterValues={filterValues} />}
      <p className={styles.sourceInfo}>Data from <a href="https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__MI__MI0812__MI0812S/MI0812T01/">SCB (Statistics Sweden)</a></p>
    </main>
  )
}
