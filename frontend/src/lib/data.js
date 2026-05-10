/**
 * Fetches the data from the API.
 *
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

import { BUILDING_COUNT_QUERY, REGION_NAME_QUERY, REGIONS_QUERY } from './queries'

const queryUrl = process.env.QUERY_URL
console.log('QueryUrl is: ' + queryUrl)

async function graphql(query, variables = {}) {
  try {
    const response = await fetch(queryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
      cache: 'force-cache'
    })

    const { data } = await response.json()

    if (!response.ok) {
      throw new Error(response)
    }

    return data

  } catch (error) {
    console.error(error)
  }
}

export async function getBuildingCountEntities(filter) {
  const variables = { 
    regionTypeId: filter.regionTypeId, 
    areaTypeId: filter.areaTypeId,
    year: filter.year,
    limit: filter.limit,
    offset: filter.offset
  }

  if (filter.parentRegionCode) {
    variables.parentRegionCode = filter.parentRegionCode
  }
  
  return await graphql(BUILDING_COUNT_QUERY, variables)
}

export async function getRegionName(regionCode) {
  return await graphql(REGION_NAME_QUERY, { regionCode })
}

export async function getRegions(filter) {
  const variables = { 
    regionTypeId: filter.regionTypeId, 
    parentRegionCode: filter.parentRegionCode,
    limit: filter.limit,
    offset: filter.offset
  }
  return await graphql(REGIONS_QUERY, variables)
} 
