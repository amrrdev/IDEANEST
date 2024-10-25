Here’s a modified version of your API documentation that includes instructions for running the API using Docker:

---

# API Documentation

## Overview

This API provides functionalities for user authentication, organization management, and user invitations within organizations. The application allows users to sign up, sign in, refresh tokens, create and manage organizations, and invite users to organizations.

## Technologies Used

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** MongoDB
- **ODM:** Mongoose
- **Deployment:** MongoDB Atlas for database hosting

## Deployment

The API is deployed on Railway and can be accessed at the following URL:

- [IDEANEST API](https://ideanest-production.up.railway.app/)

## Authentication

All endpoints, except for the signup and signin endpoints, require a Bearer token for authorization.

## Installation

To run this API using Docker, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the project directory:**

   ```bash
   cd <project-directory>
   ```

3. **Build and run the Docker containers:**

   ```bash
   docker-compose up --build
   ```

4. **Access the API:**

   The API will be running at `http://localhost:3000`.

5. **Use the following commands to stop the containers:**

   ```bash
   docker-compose down
   ```

---

## Endpoints

### 1. Signup

- **Request:** `POST /signup`
- **Request Body:**

  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```

- **Response:**
  ```json
  {
    "message": "string"
  }
  ```

### 2. Signin

- **Request:** `POST /signin`
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "message": "string",
    "access_token": "string",
    "refresh_token": "string"
  }
  ```

### 3. Refresh Token

- **Request:** `POST /refresh-token`
- **Request Body:**
  ```json
  {
    "refresh_token": "string"
  }
  ```
- **Response:**
  ```json
  {
    "message": "string",
    "access_token": "string",
    "refresh_token": "string"
  }
  ```

### 4. Create Organization

- **Request:** `POST /organization`
- **Authorization:** Bearer [Token]
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string"
  }
  ```
- **Response:**
  ```json
  {
    "organization_id": "string"
  }
  ```

### 5. Read Organization

- **Request:** `GET /organization/{organization_id}`
- **Authorization:** Bearer [Token]
- **Response:**
  ```json
  {
    "organization_id": "string",
    "name": "string",
    "description": "string",
    "organization_members": [
      {
        "name": "string",
        "email": "string",
        "access_level": "string"
      },
      ...
    ]
  }
  ```

### 6. Read All Organizations

- **Request:** `GET /organization`
- **Authorization:** Bearer [Token]
- **Response:**
  ```json
  [
    {
      "organization_id": "string",
      "name": "string",
      "description": "string",
      "organization_members": [
        {
          "name": "string",
          "email": "string",
          "access_level": "string"
        },
        ...
      ]
    },
    ...
  ]
  ```

### 7. Update Organization

- **Request:** `PUT /organization/{organization_id}`
- **Authorization:** Bearer [Token]
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string"
  }
  ```
- **Response:**
  ```json
  {
    "organization_id": "string",
    "name": "string",
    "description": "string"
  }
  ```

### 8. Delete Organization

- **Request:** `DELETE /organization/{organization_id}`
- **Authorization:** Bearer [Token]
- **Response:**
  ```json
  {
    "message": "string"
  }
  ```

### 9. Invite User to Organization

- **Request:** `POST /organization/{organization_id}/invite`
- **Authorization:** Bearer [Token]
- **Request Body:**
  ```json
  {
    "user_email": "string"
  }
  ```
- **Response:**
  ```json
  {
    "message": "string"
  }
  ```

## Author

Amr Mubarak

---
