package com.buildings.repository;

import com.buildings.domain.BuildingCountEntity;
import com.buildings.dto.BuildingCountFilter;

import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class BuildingCountRepository {
  private final JdbcClient jdbcClient;
  private final String baseSql = """
      SELECT
        id,
        year,
        count,
        created_at,
        updated_at
      FROM building_count
      """;
  private final String joinRegionSql = " JOIN region ON building_count.region_code = region.code";

  public BuildingCountRepository(final JdbcClient jdbcClient) {
    this.jdbcClient = jdbcClient;
  }

  public List<Integer> getYears() {
    return jdbcClient.sql("SELECT DISTINCT year FROM building_count")
        .query((rs, _) -> rs.getInt("year"))
        .list();
  }

  public Optional<BuildingCountEntity> findBuildingCountEntityById(final Long id) {
    return jdbcClient.sql(baseSql + " WHERE id = :id")
        .param("id", id)
        .query(mapRowsToEntity())
        .optional();
  }

  public List<BuildingCountEntity> findBuildingCountEntities(final BuildingCountFilter filter, final int limit,
      final int offset) {
    FilterQuery filterQuery = buildFilterQuery(filter);

    String sql = baseSql
        + (addJoinStatement(filter) ? joinRegionSql : "")
        + filterQuery.sql()
        + " ORDER BY id ASC LIMIT :limit OFFSET :offset";

    filterQuery.params()
        .addValue("limit", limit)
        .addValue("offset", offset);

    return jdbcClient.sql(sql)
        .paramSource(filterQuery.params())
        .query(mapRowsToEntity())
        .list();
  }

  public int countBuildingCountEntities(final BuildingCountFilter filter) {
    FilterQuery filterQuery = buildFilterQuery(filter);

    String sql = "SELECT COUNT(*) FROM building_count"
        + (addJoinStatement(filter) ? joinRegionSql : "")
        + filterQuery.sql();

    return jdbcClient.sql(sql)
        .paramSource(filterQuery.params())
        .query(Integer.class)
        .single();
  }

  private record FilterQuery(String sql, MapSqlParameterSource params) {
  }

  private FilterQuery buildFilterQuery(final BuildingCountFilter filter) {
    StringBuilder sql = new StringBuilder(" WHERE 1=1");
    MapSqlParameterSource params = new MapSqlParameterSource();

    if (filter != null && filter.regionCode() != null) {
      sql.append(" AND region_code = :regionCode");
      params.addValue("regionCode", filter.regionCode());
    }

    if (filter != null && filter.regionTypeId() != null) {
      sql.append(" AND region.type_id = :regionTypeId");
      params.addValue("regionTypeId", filter.regionTypeId());
    }

    if (filter != null && filter.parentRegionCode() != null) {
      sql.append(" AND region.parent_code = :parentRegionCode");
      params.addValue("parentRegionCode", filter.parentRegionCode());
    }

    if (filter != null && filter.areaTypeId() != null) {
      sql.append(" AND area_type_id = :areaTypeId");
      params.addValue("areaTypeId", filter.areaTypeId());
    }

    if (filter != null && filter.year() != null) {
      sql.append(" AND year = :year");
      params.addValue("year", filter.year());
    }
    return new FilterQuery(sql.toString(), params);
  }

  private Boolean addJoinStatement(final BuildingCountFilter filter) {
    Boolean addJoinStatement = false;

    if (filter != null && filter.regionTypeId() != null) {
      addJoinStatement = true;
    }

    if (filter != null && filter.parentRegionCode() != null) {
      addJoinStatement = true;
    }

    return addJoinStatement;
  }

  private RowMapper<BuildingCountEntity> mapRowsToEntity() {
    return (rs, _) -> new BuildingCountEntity(
      rs.getLong("id"),
      rs.getInt("year"),
      rs.getInt("count"),
      rs.getTimestamp("created_at"),
      rs.getTimestamp("updated_at")
    );
  }
}
