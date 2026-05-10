/**
 * Defines the dashboard actions.
 * 
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

'use server'

import { getBuildingCountEntities, getRegionName, getRegions } from '@/lib/data'

export async function fetchData(filter) { 
  const data = await getBuildingCountEntities(filter)
  return data
}

export async function fetchRegionName(regionCode) {
  const { region: { name } }  = await getRegionName(regionCode)
  return name
}

export async function fetchRegions(filter) {
  const { regions: { items } }  = await getRegions(filter)
  return items
}
