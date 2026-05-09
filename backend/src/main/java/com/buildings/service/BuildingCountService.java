package com.buildings.service;

import com.buildings.domain.BuildingCountEntity;
import com.buildings.dto.BuildingCountFilter;
import com.buildings.repository.BuildingCountRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class BuildingCountService {
  private final BuildingCountRepository buildingCountRepository;
  private final ValidationService validationService;

  public BuildingCountService(
    final BuildingCountRepository buildingCountRepository, final ValidationService validationService) {
        this.buildingCountRepository = buildingCountRepository;
        this.validationService = validationService;
    }

  public BuildingCountEntity getBuildingCountEntityById(final Long id) {
    return buildingCountRepository.findBuildingCountEntityById(id)
      .orElseThrow(() -> new EntityNotFoundException(String.format("Found no building count entity with id '%d'", id)));
  }

  public List<BuildingCountEntity> getBuildingCountEntities(
      final BuildingCountFilter filter,
      final Integer limit,
      final Integer offset) {

    List<String> errors = new ArrayList<>();

    if (filter != null) {
      errors = validationService.validate(filter);
    }

    if (!errors.isEmpty()) {
      throw new IllegalArgumentException("Invalid filter value(s): " +  String.join("; ", errors));
    }
    return buildingCountRepository.findBuildingCountEntities(filter, limit, offset);
  }

  public int getTotalCount(final BuildingCountFilter filter) {
    return buildingCountRepository.countBuildingCountEntities(filter);
  }
}
