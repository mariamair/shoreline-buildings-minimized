package com.buildings.domain;

public class AreaType {
  private final int id;
  private final String name;

  public AreaType(final int id, final String name) {
    this.id = id;
    this.name = name;
  }

  public int getId() {
    return id;
  }

  public String getName() {
    return name;
  }
}
