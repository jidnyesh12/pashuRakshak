# Database Schema for PashuRakshak Backend

This document outlines the database schema derived from the Spring Data JPA entities in the `com.example.pashuRakshak.entity` package. The tables are automatically created and updated by Hibernate based on the entity definitions, due to the `spring.jpa.hibernate.ddl-auto=update` setting in `application.properties`.

## Table: `users` (Entity: `User.java`)

Stores user information and authentication details.

| Column Name   | Data Type         | Constraints                                   |
|---------------|-------------------|-----------------------------------------------|
| `id`          | `BIGINT`          | Primary Key, Auto-increment                   |
| `username`    | `VARCHAR(20)`     | Unique, Not Null, Min 3, Max 20 characters    |
| `email`       | `VARCHAR`         | Unique, Not Null, Valid Email Format          |
| `password`    | `VARCHAR`         | Not Null, Min 6 characters                    |
| `full_name`   | `VARCHAR`         | Not Null                                      |
| `phone`       | `VARCHAR`         | Nullable                                      |
| `enabled`     | `BOOLEAN`         | Not Null, Default true                        |
| `created_at`  | `TIMESTAMP`       | Not Null, Default current timestamp           |
| `updated_at`  | `TIMESTAMP`       | Nullable, Default current timestamp           |

## Table: `user_roles` (Embedded in `User.java`)

Stores the roles assigned to each user. This is a join table for the `roles` `ElementCollection` in the `User` entity.

| Column Name | Data Type | Constraints             |
|-------------|-----------|-------------------------|
| `user_id`   | `BIGINT`  | Foreign Key to `users.id` |
| `role`      | `VARCHAR` | Not Null, Enum (USER, NGO, ADMIN) |

## Table: `animal_reports` (Entity: `AnimalReport.java`)

Stores details about animal rescue reports.

| Column Name       | Data Type         | Constraints                                   |
|-------------------|-------------------|-----------------------------------------------|
| `id`              | `BIGINT`          | Primary Key, Auto-increment                   |
| `tracking_id`     | `VARCHAR`         | Unique, Not Null                              |
| `animal_type`     | `VARCHAR`         | Not Null                                      |
| `condition`       | `VARCHAR`         | Not Null                                      |
| `injury_description`| `VARCHAR(1000)`   | Not Null                                      |
| `additional_notes`| `VARCHAR(1000)`   | Nullable                                      |
| `latitude`        | `DOUBLE PRECISION`| Not Null                                      |
| `longitude`       | `DOUBLE PRECISION`| Not Null                                      |
| `status`          | `VARCHAR`         | Not Null, Enum (SUBMITTED, SEARCHING_FOR_HELP, HELP_ON_THE_WAY, TEAM_DISPATCHED, ANIMAL_RESCUED, CASE_RESOLVED), Default 'SUBMITTED' |
| `reporter_name`   | `VARCHAR`         | Nullable                                      |
| `reporter_phone`  | `VARCHAR`         | Nullable                                      |
| `reporter_email`  | `VARCHAR`         | Nullable                                      |
| `created_at`      | `TIMESTAMP`       | Not Null, Default current timestamp           |
| `updated_at`      | `TIMESTAMP`       | Nullable, Default current timestamp           |
| `assigned_ngo_id` | `BIGINT`          | Nullable, Foreign Key to `ngos.id`            |
| `assigned_ngo_name`| `VARCHAR`         | Nullable                                      |

## Table: `report_images` (Embedded in `AnimalReport.java`)

Stores image URLs associated with animal reports. This is a join table for the `imageUrls` `ElementCollection` in the `AnimalReport` entity.

| Column Name | Data Type | Constraints             |
|-------------|-----------|-------------------------|
| `report_id`   | `BIGINT`  | Foreign Key to `animal_reports.id` |
| `image_url`   | `VARCHAR` | Nullable                |

## Table: `ngos` (Entity: `Ngo.java`)

Stores information about Non-Governmental Organizations.

| Column Name   | Data Type         | Constraints                                   |
|---------------|-------------------|-----------------------------------------------|
| `id`          | `BIGINT`          | Primary Key, Auto-increment                   |
| `name`        | `VARCHAR`         | Not Null                                      |
| `email`       | `VARCHAR`         | Unique, Not Null, Valid Email Format          |
| `phone`       | `VARCHAR`         | Not Null                                      |
| `address`     | `VARCHAR`         | Not Null                                      |
| `latitude`    | `DOUBLE PRECISION`| Not Null                                      |
| `longitude`   | `DOUBLE PRECISION`| Not Null                                      |
| `description` | `VARCHAR(500)`    | Nullable                                      |
| `is_active`   | `BOOLEAN`         | Not Null, Default true                        |
| `created_at`  | `TIMESTAMP`       | Not Null, Default current timestamp           |
| `updated_at`  | `TIMESTAMP`       | Nullable, Default current timestamp           |
