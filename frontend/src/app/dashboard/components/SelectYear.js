/**
 * Defines the year selection list component.
 *
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

'use client'

import styles from '../page.module.css'

export default function SelectYear({ value, onChange }) {
  const years = [2018, 2019, 2020, 2021, 2022, 2023]

  return (
    <div className={styles.dropdown}>
      <label>Year</label>
      <select value={value} onChange={(event) => onChange(parseInt(event.target.value))}>
        {years.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
