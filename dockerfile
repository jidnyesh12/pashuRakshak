# Stage 1: Build Frontend
FROM node:20-alpine AS frontend
WORKDIR /app/frontend

# Copy package.json and package-lock.json
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code-
COPY frontend/ ./

# Build the frontend application
RUN npm run build

# Stage 2: Build Backend
FROM maven:3.9-eclipse-temurin-17-alpine AS backend
WORKDIR /app/backend

# Copy pom.xml and source code
COPY backend/pom.xml .
COPY backend/src ./src

# Copy built frontend assets to Spring Boot static resources directory
# This allows Spring Boot to serve the React app
COPY --from=frontend /app/frontend/dist ./src/main/resources/static

# Build the application
# Skip tests to speed up the build
RUN mvn clean package -DskipTests

# Stage 3: Production Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create a volume for H2 database persistence (optional but recommended)
VOLUME /app/data

# Copy the built artifact from the backend stage
COPY --from=backend /app/backend/target/pashuRakshak-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the application runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]