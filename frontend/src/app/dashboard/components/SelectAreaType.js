/**
 * Defines the area type selection list component.
 *
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

'use client'

import styles from '../page.module.css'

export default function SelectAreaType({ value, onChange }) {
  const areaTypes = [
    { id: 1, name: 'totalt' }, 
    { id: 2, name: 'inom tätort' }, 
    { id: 3, name: 'inom formellt skyddad natur' }]

  return (
    <div className={styles.dropdown}>
      <label>Area Type</label>
      <select value={value} onChange={(event) => onChange(parseInt(event.target.value))}>
        {areaTypes.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  )
}
