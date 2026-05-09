package com.buildings.domain;

public class Region {
  private final String code;
  private final String name;
  private final int regionTypeId;
  private final String parentCode;

  public Region(final String code, final String name, final int regionTypeId, final String parentCode) {
    this.code = code;
    this.name = name;
    this.regionTypeId = regionTypeId;
    this.parentCode = parentCode;
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

  public String getParentCode() {
    return parentCode;
  }
}
