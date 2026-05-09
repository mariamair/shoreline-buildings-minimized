package com.buildings.dto;

import com.buildings.domain.BuildingCountEntity;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@Builder
public class BuildingCountPageDto {
  private List<BuildingCountEntity> items;
  private final int totalCount;
  private final int limit;
  private final int offset;
  private final boolean hasNextPage;
}
