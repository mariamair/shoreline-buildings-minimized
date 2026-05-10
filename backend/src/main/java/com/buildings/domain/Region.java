package com.buildings.domain;

public class Region {
  private final String code;
  private final String name;
  private final int regionTypeId;
  private final String parentRegionCode;

  public Region(final String code, final String name, final int regionTypeId, final String parentRegionCode) {
    this.code = code;
    this.name = name;
    this.regionTypeId = regionTypeId;
    this.parentRegionCode = parentRegionCode;
  }

  public String getCode() {
    return code;
  }

  public String getName() {
    return name;
  }

  public int getRegionTypeId() {
    return regionTypeId;
  }

  public String getparentRegionCode() {
    return parentRegionCode;
  }
}
