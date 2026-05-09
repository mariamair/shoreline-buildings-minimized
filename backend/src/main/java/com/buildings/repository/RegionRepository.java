package com.buildings.repository;

import com.buildings.domain.Region;
import com.buildings.dto.RegionFilter;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class RegionRepository {
  private final JdbcClient jdbcClient;
  private final String baseSql = """
      SELECT
        code,
        name,
        type_id,
        parent_code
      FROM region
      """;


  public RegionRepository(final JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
  }

  public List<String> findRegionCodes() {
    return jdbcClient.sql("SELECT code FROM region")
      .query((rs, _) -> rs.getString("code"))
      .list();
  }

  public Optional<Region> findRegionByCode(final String code) {
  return jdbcClient.sql(baseSql + " WHERE code = :code")
    .param("code", code)
    .query(mapRowsToEntity())
    .optional();
  }

  public List<Region> findRegions(final RegionFilter filter, final int limit, final int offset) {
    FilterQuery filterQuery = buildFilterQuery(filter);
    String sql = baseSql
      + filterQuery.sql()
      + " ORDER BY code ASC LIMIT :limit OFFSET :offset";

    filterQuery.params()
      .addValue("limit", limit)
      .addValue("offset", offset);

    return jdbcClient.sql(sql)
      .paramSource(filterQuery.params())
      .query(mapRowsToEntity())
      .list();
  }

  public int countRegions(final RegionFilter filter) {
    FilterQuery filterQuery = buildFilterQuery(filter);
    String sql = "SELECT COUNT(*) FROM region"
      + filterQuery.sql();

    return jdbcClient.sql(sql)
    .paramSource(filterQuery.params())
    .query(Integer.class)
    .single();
  }

  public Map<Long, Region> findRegionsByBuildingCountIds(final List<Long> buildingCountIds) {
    return jdbcClient.sql("""
      SELECT b.id AS building_count_id, r.code, r.name, r.type_id, r.parent_code
      FROM region r
      JOIN building_count b ON b.region_code = r.code
      WHERE b.id IN (:ids)
      """)
      .param("ids", buildingCountIds)
      .query((rs, _) -> Map.entry(
        rs.getLong("building_count_id"),
        new Region(
          rs.getString("code"),
          rs.getString("name"),
          rs.getInt("type_id"),
          rs.getString("parent_code"))
      ))
      .list()
      .stream()
      .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
  }

  private record FilterQuery(String sql, MapSqlParameterSource params) { }

  private FilterQuery buildFilterQuery(final RegionFilter filter) {
    StringBuilder sql = new StringBuilder(" WHERE 1=1");
    MapSqlParameterSource params = new MapSqlParameterSource();

    if (filter != null && filter.regionTypeId() != null) {
      sql.append(" AND region.type_id = :regionTypeId");
      params.addValue("regionTypeId", filter.regionTypeId());
    }

    if (filter != null && filter.parentRegionCode() != null) {
      sql.append(" AND region.parent_code = :parentRegionCode");
      params.addValue("parentRegionCode", filter.parentRegionCode());
    }

    return new FilterQuery(sql.toString(), params);
  }

  private RowMapper<Region> mapRowsToEntity() {
    return (rs, _) -> new Region(
      rs.getString("code"),
      rs.getString("name"),
      rs.getInt("type_id"),
      rs.getString("parent_code"));
  }
}
