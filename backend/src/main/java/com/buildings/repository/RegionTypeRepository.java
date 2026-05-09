package com.buildings.repository;

import com.buildings.domain.RegionType;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class RegionTypeRepository {
    private final JdbcClient jdbcClient;

  public RegionTypeRepository(final JdbcClient jdbcClient) {
    this.jdbcClient = jdbcClient;
  }

  public List<Integer> findRegionTypeIds() {
    return jdbcClient.sql("SELECT id FROM region_type")
        .query((rs, _) -> rs.getInt("id"))
        .list();
  }

  public Map<String, RegionType> findRegionTypesByRegionCodes(final List<String> regionCodes) {
    return jdbcClient.sql("""
      SELECT r.code, rt.id, rt.name
      FROM region_type rt
      JOIN region r ON r.type_id = rt.id
      WHERE r.code IN (:codes)
      """)
        .param("codes", regionCodes)
        .query((rs, _) -> Map.entry(
            rs.getString("code"),
            new RegionType(
              rs.getInt("id"),
              rs.getString("name"))
        ))
        .list()
        .stream()
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
  }
}
