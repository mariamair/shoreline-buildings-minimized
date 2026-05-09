package com.buildings.service;

import com.buildings.dto.BuildingCountFilter;
import com.buildings.repository.BuildingCountRepository;
import lombok.extern.slf4j.Slf4j;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ValidationService {
  private final BuildingCountRepository buildingCountRepository;
  private final RegionService regionService;
  private final RegionTypeService regionTypeService;
  private final AreaTypeService areaTypeService;

  public ValidationService(
    final BuildingCountRepository buildingCountRepository,
    final RegionService regionService,
    final RegionTypeService regionTypeService,
    final AreaTypeService areaTypeService) {
      this.buildingCountRepository = buildingCountRepository;
      this.regionService = regionService;
      this.regionTypeService = regionTypeService;
      this.areaTypeService = areaTypeService;
    }

  public List<String> validate(final Validatable record) {
    List<String> errors = new ArrayList<>();

    if (record.regionCode() != null && !regionService.getRegionCodes().contains(record.regionCode())) {
      errors.add(String.format("'%s' is not a valid region code", record.regionCode()));
    }

    if (record instanceof BuildingCountFilter filter) {
      if (filter.regionTypeId() != null && !regionTypeService.getRegionTypeIds().contains(filter.regionTypeId())) {
        errors.add(String.format("'%s' is not a valid region type id", filter.regionTypeId()));
      }

      if (filter.parentRegionCode() != null
        && filter.regionCode() != null
        && !isValidParentRegion(filter.parentRegionCode(), filter.regionCode())) {
        errors.add(String.format("'%s' is not a valid parent code for region '%s'",
          filter.parentRegionCode(), filter.regionCode()));
      }
    }

    if (record.areaTypeId() != null && !areaTypeService.getAreaTypeIds().contains(record.areaTypeId())) {
      errors.add(String.format("'%d' is not a valid area type", record.areaTypeId()));
    }

    if (record.year() != null && record instanceof BuildingCountFilter) {
      validateYearAsSearchFilter(record.year()).ifPresent(errors::add);
    }

    return errors;
  }


  private Optional<String> validateYearAsSearchFilter(final Integer year) {
    List<Integer> yearsInDatabase = buildingCountRepository.getYears();

    if (!yearsInDatabase.isEmpty() && !yearsInDatabase.contains(year)) {
      return Optional.of(String.format("'%d' is not a valid year", year));
    }
    return Optional.empty();
  }

  private boolean isValidParentRegion(final String parent, final String child) {
    if (child.length() > 2) {
      return child.substring(0, 2).equals(parent);
    } else {
      return parent.equals("00");
    }
  }
}
