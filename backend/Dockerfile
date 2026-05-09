FROM maven:3.9.13-eclipse-temurin-25-alpine AS builder

WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:25-jre-alpine

WORKDIR /app
COPY --from=builder /build/target/shoreline-buildings-api-1.0.0.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]