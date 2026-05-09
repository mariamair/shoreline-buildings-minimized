package com.buildings.domain;

import java.util.Date;

public class BuildingCountEntity {
  private final Long id;
  private final int year;
  private final Integer buildingCount;
  private final Date createdAt;
  private final Date updatedAt;

  public BuildingCountEntity(
    final Long id,
    final int year,
    final Integer buildingCount,
    final Date createdAt,
    final Date updatedAt) {
    this.id = id;
    this.year = year;
    this.buildingCount = buildingCount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public Long getId() {
    return id;
  }

  public int getYear() {
    return year;
  }

  public Integer getBuildingCount() {
    return buildingCount;
  }

  public Date getCreatedAt() {
    return createdAt;
  }

  public Date getUpdatedAt() {
    return updatedAt;
  }
}
