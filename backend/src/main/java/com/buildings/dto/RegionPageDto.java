package com.buildings.dto;

import com.buildings.domain.Region;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@Builder
public class RegionPageDto {
  private List<Region> items;
  private final int totalCount;
  private final int limit;
  private final int offset;
  private final boolean hasNextPage;
}
