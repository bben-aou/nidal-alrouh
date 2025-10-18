# Project Name

<!-- Add your project logo or banner here -->

> A modern full-stack application with PostgreSQL database

## 📋 Table of Contents

- [Overview](#overview)
- [Local Database Setup](#local-database-setup)
  - [Prerequisites](#prerequisites)
  - [Quick Start](#quick-start)
  - [Manual Setup](#manual-setup)
  - [Access Information](#access-information)
  - [Common Commands](#common-commands)
  - [Troubleshooting](#troubleshooting)
- [Getting Started](#getting-started)
- [Development](#development)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

Nidal Alrouh is a mental health support platform for Morocco.

This project uses a modern tech stack with:

- **Frontend**: Next.js (React, TypeScript, Tailwind CSS)
- **Backend**: NestJS (Node.js 20) — planned for backend foundation
- **Database**: PostgreSQL 16 with Docker Compose
- **UI Tools**: pgAdmin 4

---

## 🗄️ Local Database Setup

### Prerequisites

**Docker Desktop is required** to run the PostgreSQL database locally.

#### Install Docker Desktop

Choose your operating system:

| OS             | Installation Link                                                                               |
| -------------- | ----------------------------------------------------------------------------------------------- |
| 🍎 **macOS**   | [Download Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)         |
| 🪟 **Windows** | [Download Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/) |
| 🐧 **Linux**   | [Download Docker Desktop for Linux](https://docs.docker.com/desktop/install/linux-install/)     |

**After installation:**

1. Start Docker Desktop application
2. Wait for Docker to be running (green status icon)
3. Verify installation:
   ```bash
   docker --version
   docker compose version
   ```

---

### Quick Start

Get your database running in 3 simple steps:

```bash
# 1. Create your environment file
cp .env.example .env

# 2. Start the database
docker compose up -d

# 3. Verify it's running
docker compose ps
```

**Expected output:**

```
NAME            STATUS          PORTS
nidal-postgres    Up (healthy)    0.0.0.0:5432->5432/tcp
nidal-pgadmin     Up 30 seconds   0.0.0.0:5050->80/tcp
```

**Access pgAdmin:** Open [http://localhost:5050](http://localhost:5050)

---

### Manual Setup

For more control over the setup process:

#### Step 1: Environment Configuration

Create your local environment file:

```bash
cp .env.example .env
```

**Optional:** Edit `.env` to customize your database credentials:

```bash
# Open in your editor
nano .env
# or
code .env
# or
vim .env
```

#### Step 2: Start Docker Containers

```bash
# Start in detached mode (runs in background)
docker compose up -d

# Or start with logs visible
docker compose up
```

#### Step 3: Verify Installation

```bash
# Check container status
docker compose ps

# View logs
docker compose logs -f postgres

# Test database connection
docker compose exec postgres pg_isready
```

---

### Access Information

#### 🌐 pgAdmin Web Interface

Access the database management UI:

- **URL**: [http://localhost:5050](http://localhost:5050)
- **Email**: `admin@example.com` (default, check your `.env` for custom)
- **Password**: See `PGADMIN_PASSWORD` in your `.env` file

**First time setup:**

1. Login with pgAdmin credentials
2. The server "Local PostgreSQL Development" is pre-configured
3. Click on it and enter your PostgreSQL password when prompted
4. Check "Save Password" for convenience

#### 🗄️ PostgreSQL Database

Direct database connection details:

| Setting      | Value              | Location                     |
| ------------ | ------------------ | ---------------------------- |
| **Host**     | `localhost`        | -                            |
| **Port**     | `5432`             | `.env` → `POSTGRES_PORT`     |
| **Database** | Your database name | `.env` → `POSTGRES_DB`       |
| **Username** | Your username      | `.env` → `POSTGRES_USER`     |
| **Password** | Your password      | `.env` → `POSTGRES_PASSWORD` |

#### 🔌 Connection String

Use this in your application:

```bash
# Format
postgresql://[USERNAME]:[PASSWORD]@localhost:5432/[DATABASE]

# From .env file
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/your_db
```

**In your app code:**

```javascript
// Node.js example
const connectionString = process.env.DATABASE_URL;

// Python example
import os
connection_string = os.getenv('DATABASE_URL')
```

---

### Common Commands

#### Starting and Stopping

```bash
# Start database (runs in background)
docker compose up -d

# Stop database (preserves data)
docker compose down

# Stop and remove all data (fresh start)
docker compose down -v
```

#### Monitoring and Debugging

```bash
# View running containers
docker compose ps

# View logs (all services)
docker compose logs

# View logs (PostgreSQL only)
docker compose logs postgres

# Follow logs in real-time
docker compose logs -f

# View last 50 lines
docker compose logs --tail=50
```

#### Database Operations

```bash
# Access PostgreSQL shell
docker compose exec postgres psql -U [your_username] -d [your_database]

# Example with default values
docker compose exec postgres psql -U postgres -d postgres

# Run a SQL command directly
docker compose exec postgres psql -U [your_username] -d [your_database] -c "SELECT version();"

# Backup database
docker compose exec postgres pg_dump -U [your_username] [your_database] > backup.sql

# Restore database
docker compose exec -T postgres psql -U [your_username] -d [your_database] < backup.sql
```

#### Container Management

```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart postgres

# View resource usage
docker stats

# Remove stopped containers
docker compose rm

# Pull latest images
docker compose pull
```

---

### Troubleshooting

#### Docker Not Running

**Problem:** `Cannot connect to the Docker daemon`

**Solution:**

```bash
# Check Docker status
docker info

# If error, start Docker Desktop application
# macOS: Open Docker Desktop from Applications
# Windows: Open Docker Desktop from Start Menu
# Linux: sudo systemctl start docker
```

---

#### Port Already in Use

**Problem:** `port is already allocated` or `address already in use`

**Solution:**

```bash
# Check what's using port 5432
lsof -i :5432
# or on Windows
netstat -ano | findstr :5432

# Stop the conflicting service
# For PostgreSQL installed locally:
brew services stop postgresql  # macOS
sudo systemctl stop postgresql # Linux

# Or change the port in .env
POSTGRES_PORT=5433
```

---

#### Can't Connect to Database

**Problem:** Connection refused or timeout

**Solution:**

```bash
# 1. Check if container is running
docker compose ps

# 2. Check if healthy
docker compose ps | grep healthy

# 3. View logs for errors
docker compose logs postgres

# 4. Wait for startup (first time takes 10-30 seconds)
sleep 15
docker compose exec postgres pg_isready

# 5. Verify credentials match your .env file
cat .env | grep POSTGRES_
```

---

#### pgAdmin Can't Connect to PostgreSQL

**Problem:** "Could not connect to server" in pgAdmin

**Solution:**

1. **Check hostname:** Use `postgres` (Docker service name), not `localhost`
2. **Verify credentials:** Must match your `.env` file
3. **Check network:**
   ```bash
   docker compose exec pgadmin ping postgres
   ```
4. **Re-enter connection details:**
   - Right-click server → Properties
   - Connection tab → Verify all settings
   - Use `postgres` as hostname

---

#### Permission Denied

**Problem:** Permission errors when starting containers

**Solution:**

```bash
# Fix directory permissions
sudo chown -R $(whoami) docker/postgres/data
sudo chown -R $(whoami) docker/pgadmin/data

# Fix script permissions
chmod +x docker/postgres/init/*.sh
```

---

#### Data Corruption or Reset Needed

**Problem:** Database not working, need fresh start

**Solution:**

```bash
# Complete reset (⚠️ deletes all data!)
docker compose down -v
rm -rf docker/postgres/data/*
rm -rf docker/pgadmin/data/*
docker compose up -d
```

---

#### Slow Performance on Mac

**Problem:** Database is slow

**Solution:**

```bash
# In docker-compose.yml, ensure you're using volumes efficiently
# Avoid mounting large directories
# Use named volumes instead of bind mounts for database files
```

---

#### Environment Variables Not Loading

**Problem:** Database starts with wrong credentials

**Solution:**

```bash
# 1. Ensure .env file exists
ls -la .env

# 2. Check .env format (no spaces around =)
cat .env

# Correct:   POSTGRES_USER=myuser
# Incorrect: POSTGRES_USER = myuser

# 3. Recreate containers
docker compose down
docker compose up -d
```

---

### Getting Help

If you're still stuck:

1. **Check logs:** `docker compose logs -f`
2. **Verify setup:** Review this documentation
3. **Search issues:** Check existing GitHub issues
4. **Ask for help:** Open a new issue with:
   - Error message
   - Output of `docker compose logs`
   - Your OS and Docker version
   - Steps to reproduce

**Useful debugging commands:**

```bash
# System info
docker info
docker version
docker compose version

# Container details
docker compose ps
docker compose logs
docker inspect [container-name]

# Network info
docker network ls
docker network inspect mvp-network
```

---

## 🚀 Getting Started

<!-- Add your application setup instructions here -->

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
```

### Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Update with your values
# DATABASE_URL is already set for local development
```

### Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

---

## 💻 Development

<!-- Add development workflow information -->

### Database Migrations

```bash
# Run migrations
npm run migrate

# Create new migration
npm run migrate:create

# Rollback migration
npm run migrate:rollback
```

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

---

## 📁 Project Structure

```
project-root/
├── apps/
│   ├── frontend/          # Frontend application
│   └── backend/           # Backend application
├── docker/
│   ├── postgres/
│   │   ├── data/         # Database files (gitignored)
│   │   └── init/         # Initialization scripts
│   └── pgadmin/
│       ├── data/         # pgAdmin data (gitignored)
│       └── servers.json
├── docker-compose.yml     # Docker services
├── .env.example          # Environment template
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

---

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow existing code patterns
- Write tests for new features
- Update documentation as needed
- Use conventional commits

---

## 📄 License

<!-- Add your license information -->

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- PostgreSQL for the amazing database
- Docker for containerization
- pgAdmin for database management UI

---

## 📞 Support

- **Documentation**: [Link to docs]
- **Issues**: [GitHub Issues](your-repo/issues)
- **Discussions**: [GitHub Discussions](your-repo/discussions)

---

<div align="center">
Made with ❤️ by Bilal Ben Aouad
</div>
