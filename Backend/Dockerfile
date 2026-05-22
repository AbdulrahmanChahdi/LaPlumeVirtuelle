FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /workspace

COPY . /workspace

RUN mvn -f pom.xml -DskipTests package

FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /workspace/target/*.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
