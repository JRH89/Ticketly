# Ticketly

Ticketly is the independent sample SaaS repository used to exercise ForgeLoop against a realistic Spring Boot and React application. ForgeLoop is never coupled to this repository; it can target any registered repository.

## Run locally

```sh
docker compose up --build
```

Open `http://localhost:5174`. The demo profile uses ephemeral H2 data and header-based development identity only. Production deployments use the default PostgreSQL, Flyway, and OIDC configuration.

## Verification

```sh
docker build -t ticketly-backend:local backend
cd frontend && npm ci && npm run check
```
