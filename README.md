# mini-project-bisa-basi

Learning repository for a better understanding in clean architecture pattern and third party services.

## Iteration 1

### Setup project

#### 📌 Tech Stack

- Framework: NestJS
- Architecture: Clean Architecture
- ORM: Drizzle ORM
- Database: PostgreSQL (Dockerized for development)
- Authentication: JWT
- Validation: class-validator & class-transformer
- Testing: Jest (Unit Tests)
- Documentation: Swagger (OpenAPI)
- Containerization: Docker & Docker Compose

#### ⚙️ Features

🔐 Authentication

- Register
- Login
- Logout
- JWT-based authentication
- Route protection using Guards

🎯 Campaign

- List campaigns
- Get campaign details

💰 Donation

- Make a donation
- Get donation history (authenticated user)
