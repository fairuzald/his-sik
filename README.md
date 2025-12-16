# Hospital Information System (HIS)

## Overview

This project is a Hospital Information System consisting of a FastAPI backend (`be`) and a Next.js frontend (`fe`), containerized using Docker.

## Prerequisites

- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- [Make](https://www.gnu.org/software/make/) (optional, but recommended for running commands)

## ⚠️ Non-Linux Users (Windows / macOS)

### Windows

If you are using Windows, you cannot run `make` commands natively unless you have **WSL2** (Windows Subsystem for Linux) or **MinGW** installed. It is **highly recommended** to use WSL2.

**Option 1: Using WSL2 (Recommended)**

1.  Install WSL2 and a Linux distribution (e.g., Ubuntu).
2.  Open your terminal in WSL mode.
3.  Follow the standard commands (`make setup`, etc.).

**Option 2: Without Make (PowerShell/CMD)**
If you cannot use `make`, you must run the underlying commands manually.

1.  **Copy Environment Variables:**
    ```powershell
    copy .env.example .env
    ```
2.  **Build and Start:**
    ```powershell
    docker-compose up -d --build
    ```
3.  **Run Migrations:**
    ```powershell
    docker-compose exec app alembic upgrade head
    ```
4.  **Seed Database:**
    ```powershell
    docker-compose exec app python -m backend.scripts.seed
    ```

### macOS

macOS users usually have `make` installed. If not, install it via Xcode Command Line Tools (`xcode-select --install`) or Homebrew (`brew install make`). Then follow the standard instructions.

## Quick Start

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd his-sik
    ```

2.  **Run the setup command:**
    This command will copy the `.env` file, build containers, start services, run migrations, and seed the database.

    ```bash
    make setup
    ```

3.  **Access the application:**
    - **Backend API:** [http://localhost:8000](http://localhost:8000)
    - **API Docs (Swagger):** [http://localhost:8000/api/docs](http://localhost:8000/api/docs)
    - **Frontend:** [http://localhost:3000](http://localhost:3000) (if running)
    - **MinIO Console:** [http://localhost:9001](http://localhost:9001)

## Setup & Running via Makefile

The project includes a `Makefile` to simplify common tasks.

### 🚀 Setup Commands

| Command      | Description                                                                                         |
| ------------ | --------------------------------------------------------------------------------------------------- |
| `make setup` | **First-time setup**. Copies `.env`, builds images, starts containers, migrates DB, and seeds data. |

### 🐳 Docker Commands

| Command         | Description                                           |
| --------------- | ----------------------------------------------------- |
| `make build`    | Build all Docker images.                              |
| `make up`       | Start all services in the background.                 |
| `make down`     | Stop and remove all running services.                 |
| `make restart`  | Restart all services.                                 |
| `make logs`     | View real-time logs for all services.                 |
| `make logs-app` | View real-time logs for the **backend** app only.     |
| `make shell`    | Open a bash shell inside the running `app` container. |

### 🗄️ Database Commands

| Command                     | Description                                                                       |
| --------------------------- | --------------------------------------------------------------------------------- |
| `make migrate`              | Run database migrations (Alembic `upgrade head`).                                 |
| `make migrate-new NAME=xxx` | Create a new migration revision. Example: `make migrate-new NAME=add_users_table` |
| `make migrate-down`         | Rollback the last migration (`downgrade -1`).                                     |
| `make migrate-history`      | View the migration history.                                                       |
| `make seed`                 | Seed the database with initial data (Users, Roles, Medicines, etc.).              |
| `make db-shell`             | Open a PostgreSQL CLI shell (`psql`) inside the `postgres` container.             |

### 🛠️ Development & Coding Standards

| Command       | Description                                                          |
| ------------- | -------------------------------------------------------------------- |
| `make test`   | Run tests using `pytest` inside the container.                       |
| `make lint`   | Run linter (`ruff check`) on the backend code.                       |
| `make format` | Format the backend code using `ruff format`.                         |
| `make clean`  | Stop containers and remove volumes (WARNING: Deletes database data). |

## Project Structure

```
.
├── be/                 # Backend (FastAPI, Alembic, SQLAlchemy)
├── fe/                 # Frontend (Next.js, TailwindCSS)
├── docker/             # Docker configuration files (Postgres, Redis, MinIO)
├── docker-compose.yml  # Main Docker Compose file
├── Makefile            # Command shortcuts
└── schema.sql          # Database schema reference
```
