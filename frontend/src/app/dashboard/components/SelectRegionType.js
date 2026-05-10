/**
 * Defines the region type selection list component.
 *
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

'use client'

import styles from '../page.module.css'

export default function SelectRegionType({ value, onChange }) {
  const regionTypes = [
    { id: 1, name: 'Hela landet' }, 
    { id: 2, name: 'Län' }, 
    { id: 3, name: 'Kommuner' }]

  return (
    <div className={styles.dropdown}>
      <label>Region Type</label>
      <select value={value} onChange={(event) => onChange(parseInt(event.target.value))}>
        {regionTypes.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  )
}
