/**
 * Contains the GraphQL queries.
 *
 * @author Maria Mair <mm225mz@student.lnu.se>
 */

export const BUILDING_COUNT_QUERY = `
query BuildingCountEntitiesWithFilters (
  $regionCode: String,
  $parentRegionCode: String,
  $regionTypeId: Int,
  $year: Int,
  $areaTypeId: Int,
  $limit: Int,
  $offset: Int) {
  buildingCountEntities (
    filter: {
    regionCode: $regionCode,
    parentRegionCode: $parentRegionCode,
    regionTypeId: $regionTypeId, 
    year: $year, 
    areaTypeId: $areaTypeId
    }
    limit: $limit
    offset: $offset
  ) {
    totalCount
    limit
    offset
    hasNextPage
    items {
      id
      region {
        code
        name
        regionType {
          id
          name
        }
      }
      areaType {
        id
        name
      }
      year
      buildingCount
      createdAt
      updatedAt
    }
  }
}
`

export const REGION_NAME_QUERY = `
query RegionName ($regionCode: String!) { 
  region (code: $regionCode) {
    name
  }
}
`

export const REGIONS_QUERY = `
query Regions (
  $regionTypeId: Int, 
  $parentRegionCode: String,
  $limit: Int,
  $offset: Int) {
  regions (
    filter: {
    regionTypeId: $regionTypeId, 
    parentRegionCode: $parentRegionCode,
    }
    limit: $limit
    offset: $offset
  ) {
    items {
      code
      name
    }
  }
}
`
