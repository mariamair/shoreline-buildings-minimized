package com.buildings.repository;

import com.buildings.domain.AreaType;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class AreaTypeRepository {
  private final JdbcClient jdbcClient;

  public AreaTypeRepository(final JdbcClient jdbcClient) {
    this.jdbcClient = jdbcClient;
  }

  public List<Integer> findAreaTypeIds() {
    return jdbcClient.sql("SELECT id FROM area_type")
      .query((rs, _) -> rs.getInt("id"))
      .list();
  }

  public Map<Long, AreaType> findAreaTypesByBuildingCountIds(final List<Long> buildingCountIds) {
    return jdbcClient.sql("""
      SELECT b.id AS building_count_id, at.id, at.name
      FROM area_type at
      JOIN building_count b ON b.area_type_id = at.id
      WHERE b.id IN (:ids)
      """)
      .param("ids", buildingCountIds)
      .query((rs, _) -> Map.entry(
        rs.getLong("building_count_id"),
        new AreaType(
          rs.getInt("id"),
          rs.getString("name"))
      ))
      .list()
      .stream()
      .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
  }
}
