package com.buildings.service;

import com.buildings.domain.AreaType;
import com.buildings.repository.AreaTypeRepository;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class AreaTypeService {
  private final AreaTypeRepository areaTypeRepository;

  public AreaTypeService(final AreaTypeRepository areaTypeRepository) {
    this.areaTypeRepository = areaTypeRepository;
  }

  public List<Integer> getAreaTypeIds() {
    List<Integer> areaTypeIds = areaTypeRepository.findAreaTypeIds();
    return areaTypeIds;
  }

  public Map<Long, AreaType> getAreaTypesByBuildingCountIds(final List<Long> buildingCountIds) {
    return areaTypeRepository.findAreaTypesByBuildingCountIds(buildingCountIds);
  }
}
