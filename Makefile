# HIS - Hospital Information System
# Usage: make <target>

.PHONY: help build up down restart logs shell migrate seed clean test lint format

# Docker compose
DC = docker-compose

# Default target
help:
	@echo "HIS - Available Commands"
	@echo "========================"
	@echo ""
	@echo "Docker Commands:"
	@echo "  make build         - Build all Docker images"
	@echo "  make up            - Start all services"
	@echo "  make down          - Stop all services"
	@echo "  make restart       - Restart all services"
	@echo "  make logs          - View logs (all services)"
	@echo "  make logs-app      - View app logs only"
	@echo "  make shell         - Open shell in app container"
	@echo ""
	@echo "Database Commands:"
	@echo "  make migrate       - Run database migrations"
	@echo "  make migrate-new   - Create new migration (NAME=migration_name)"
	@echo "  make migrate-down  - Rollback last migration"
	@echo "  make migrate-history - View migration history"
	@echo "  make seed          - Run database seeders"
	@echo "  make db-shell      - Open PostgreSQL shell"
	@echo ""
	@echo "Development Commands:"
	@echo "  make dev           - Run locally without Docker"
	@echo "  make test          - Run tests"
	@echo "  make lint          - Run linter"
	@echo "  make format        - Format code"
	@echo "  make clean         - Clean up containers and volumes"
	@echo ""
	@echo "Setup Commands:"
	@echo "  make setup         - First-time setup (build, migrate, seed)"

# =============================================================================
# Docker Commands
# =============================================================================

build:
	$(DC) build

up:
	$(DC) up -d

down:
	$(DC) down

restart:
	$(DC) restart

logs:
	$(DC) logs -f

logs-app:
	$(DC) logs -f app

shell:
	$(DC) exec app /bin/bash

# =============================================================================
# Database Commands
# =============================================================================

migrate:
	$(DC) exec app alembic upgrade head

migrate-new:
	@if [ -z "$(NAME)" ]; then \
		echo "Please provide a migration name: make migrate-new NAME=your_migration_name"; \
		exit 1; \
	fi
	$(DC) exec app alembic revision --autogenerate -m "$(NAME)"

migrate-down:
	$(DC) exec app alembic downgrade -1

migrate-history:
	$(DC) exec app alembic history

seed:
	$(DC) exec app python -m backend.scripts.seed

db-shell:

	$(DC) exec postgres psql -U postgres -d his_db
db-reset:
	@echo "🔄 Resetting database (WARNING: This will drop all data)..."
	@read -p "Are you sure? Type 'yes' to continue: " confirm; \
	if [ "$$confirm" = "yes" ]; then \
		docker compose -f docker-compose.yml down -v; \
		docker volume rm postgres_data || true; \
		docker volume create postgres_data; \
		docker compose -f docker-compose.yml up -d postgres; \
		sleep 10; \
		make db-migrate; \
	else \
		echo "❌ Database reset cancelled"; \
	fi
# =============================================================================
# Development Commands (Local - without Docker)
# =============================================================================

dev:
	@echo "Starting local development server..."
	cd be && source .venv/bin/activate && uvicorn backend.api.server.app:app --reload --host 0.0.0.0 --port 8000

test:
	$(DC) exec app pytest -v

lint:
	$(DC) exec app ruff check backend

format:
	$(DC) exec app ruff format backend

clean:
	$(DC) down -v --remove-orphans
	docker system prune -f

# =============================================================================
# First-time setup
# =============================================================================

setup:
	@echo "Setting up HIS..."
	@if [ ! -f .env ]; then cp .env.example .env; echo "✓ Created .env file"; fi
	@make build
	@make up
	@echo "Waiting for services to be ready..."
	@sleep 15
	@make migrate
	@make seed
	@echo ""
	@echo "✓ Setup complete!"
	@echo ""
	@echo "Access points:"
	@echo "  - API:          http://localhost:8000"
	@echo "  - API Docs:     http://localhost:8000/api/docs"
	@echo "  - MinIO:        http://localhost:9001"
	@echo "  - Dozzle:       http://localhost:8080 (if --profile with-monitoring)"
