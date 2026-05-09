package com.buildings;

import java.util.Map;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public final class App {
  private App() {
    // Private constructor to prevent instantiation
  }
  public static void main(final String[] args) {
    SpringApplication.run(App.class, args);
  }

  @RestController
  public static class HealthController {
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
      return ResponseEntity.ok(Map.of(
        "status", "UP",
        "service", "Building Count API"
      ));
    }
  }
}
