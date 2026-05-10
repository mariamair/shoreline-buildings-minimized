package com.buildings.config;

import io.github.cdimascio.dotenv.Dotenv;
import lombok.extern.slf4j.Slf4j;

import java.nio.file.Files;
import java.nio.file.Paths;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class EnvConfig {
  static {
    // Try to find .env file by going up directory levels
    String envPath = findEnvFile();

    if (envPath != null) {
      Dotenv dotenv = Dotenv.configure()
        .directory(envPath)
        .ignoreIfMissing()
        .load();

        dotenv.entries().forEach(
          entry -> System.setProperty(entry.getKey(), entry.getValue()));
    }
  }

  private static String findEnvFile() {
    // Start from current directory and go up
    java.nio.file.Path current = Paths.get("").toAbsolutePath();
    final int levels = 5;
    final String envFileName = ".env";

    for (int i = 0; i < levels; i++) {
      java.nio.file.Path envFile = current.resolve(envFileName);
      if (Files.exists(envFile)) {
        return envFile.getParent().toString();
      }
      current = current.getParent();
      if (current == null) {
        break;
      }
    }

    log.error("Warning: .env file not found");
    return null;
    }
}
