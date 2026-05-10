package com.buildings.service;

import com.buildings.domain.Region;
import com.buildings.dto.RegionFilter;
import com.buildings.repository.RegionRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class RegionService {
  private final RegionRepository regionRepository;

  public RegionService(final RegionRepository regionRepository) {
    this.regionRepository = regionRepository;
  }

  public List<String> getRegionCodes() {
    List<String> regionCodes = regionRepository.findRegionCodes();
    if (regionCodes.isEmpty()) {
      log.warn("No region codes available");
      throw new EntityNotFoundException("Found no region codes");
    }
    return regionCodes;
  }

  public Region getRegionByCode(final String code) {
    return regionRepository.findRegionByCode(code)
        .orElseThrow(() -> new EntityNotFoundException(String.format("Found no region with code '%s'", code)));
  }

  public List<Region> getRegions(
    final RegionFilter filter,
    final Integer limit,
    final Integer offset) {
    List<Region> regions = regionRepository.findRegions(filter, limit, offset);
    return regions;
  }

  public int getTotalCount(final RegionFilter filter) {
    return regionRepository.countRegions(filter);
  }

  public Map<Long, Region> getRegionsByBuildingCountIds(final List<Long> buildingCountIds) {
    return regionRepository.findRegionsByBuildingCountIds(buildingCountIds);
  }
}
