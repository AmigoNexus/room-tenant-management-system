# Room & Tenant Management System (RTMS) - Backend

A production-level backend for managing rooms, wings, flats, tenants, and payments.

## Tech Stack
- Java 21
- Spring Boot 3.2.5
- Spring Security (JWT)
- Spring Data JPA
- MySQL
- Hibernate
- MapStruct
- Lombok
- Swagger/OpenAPI

## Project Structure
```
src/main/java/com/project/
 ├── config/       # Configuration beans (Security, AppConfig)
 ├── security/     # JWT and Auth Filters
 ├── auth/         # Authentication & User module
 ├── property/     # Property, Wing, and Flat management
 ├── tenant/       # Tenant details and Flat mapping
 ├── payment/      # Payment tracking
 ├── report/       # Analytical reports
 ├── common/       # Base entities and shared DTOs
 ├── exception/    # Global exception handling
 ├── util/         # Helper services (File, Seed data)
```

## Setup Instructions

### 1. Database Setup
Use Docker to start MySQL:
```bash
docker-compose up -d
```

### 2. Run Application
```bash
mvn spring-boot:run
```

### 3. API Documentation
Swagger UI is available at:
`http://localhost:8080/swagger-ui.html`

## Features
- **Auth**: JWT-based login with role-based access (OWNER/TENANT).
- **Property**: Manage properties, wings, and flats.
- **Tenant**: Track tenant profiles and document uploads.
- **Mapping**: Assign tenants to flats with status tracking.
- **Payment**: Monthly payment creation, status updates, and screenshot uploads.
- **Reports**: Revenue and occupancy analytics.

## Default Credentials
- **Admin**: admin@rtms.com / admin123
- **Tenant**: john@tenant.com / tenant123
