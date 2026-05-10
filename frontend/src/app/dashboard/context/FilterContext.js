/**
 * Defines the context for the filter values.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

'use client'

import { createContext, useState } from 'react'

export const FilterContext = createContext()

export function FilterProvider({ children }) {
  const regionTypeRegion = 2
  const areaTypeTotal = 1
  const [filterValues, setFilterValues] = useState({
    regionTypeId: regionTypeRegion, 
    areaTypeId: areaTypeTotal, 
    year: 2018,
    limit: 50,
    offset: 0
  })

  return (
    <FilterContext.Provider value={{ filterValues, setFilterValues }}>
      {children}
    </FilterContext.Provider>
  )
}
