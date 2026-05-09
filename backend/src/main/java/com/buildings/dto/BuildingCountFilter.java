package com.buildings.dto;

import com.buildings.service.Validatable;

public record BuildingCountFilter(
  String regionCode,
  String parentRegionCode,
  Integer regionTypeId,
  Integer areaTypeId,
  Integer year,
  Integer buildingCount) implements Validatable {
}
