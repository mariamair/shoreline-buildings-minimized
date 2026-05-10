/**
 * Defines the region selection list component.
 *
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

'use client'

import { useState, useEffect } from 'react'
import styles from '../page.module.css'
import { fetchRegions } from '../actions'

export default function SelectRegion({ value, onChange }) {
  const [regions, setRegions] = useState([])
  const regionTypeId = 2

  useEffect(() => {
    const loadData = async () => {
      try {
        const filter = { regionTypeId }
        const result = await fetchRegions(filter)
        // Sort regions by name
        const sorted = result.sort((a, b) => a.name.localeCompare(b.name))
        setRegions(sorted)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    loadData()
  }, [regionTypeId])

  return (
    <div className={styles.dropdown}>
      <label>Region</label>
      <select value={value} onChange={onChange}>
        {regions.map((option) => (
          <option key={option.code} value={option.code}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  )
}
