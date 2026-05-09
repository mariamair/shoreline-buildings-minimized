package com.buildings.service;

import com.buildings.domain.RegionType;
import com.buildings.repository.RegionTypeRepository;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;

@Service
public class RegionTypeService {
  private final RegionTypeRepository regionTypeRepository;

  public RegionTypeService(final RegionTypeRepository regionTypeRepository) {
    this.regionTypeRepository = regionTypeRepository;
  }

  public List<Integer> getRegionTypeIds() {
    List<Integer> regionTypeIds = regionTypeRepository.findRegionTypeIds();
    return regionTypeIds;
  }

  public Map<String, RegionType> getRegionTypesByRegionCodes(final List<String> regionCodes) {
    return regionTypeRepository.findRegionTypesByRegionCodes(regionCodes);
  }
}
