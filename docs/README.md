# Backend API

This is the NestJS backend API for the application.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Yarn package manager
- PostgreSQL database

### Installation

```bash
# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the `apps/backend` directory with the following variables:

```env
# Server Configuration
PORT=8080

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Security Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
CORS_ALLOWED_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS
CORS_CREDENTIALS=true
HELMET_ENABLED=true
```

### Running the Application

```bash
# Development mode
yarn dev

# Production mode
yarn build
yarn start
```

## Security Configuration

This backend implements comprehensive security measures to protect against common web vulnerabilities.

### CORS (Cross-Origin Resource Sharing)

CORS is configured to allow requests from specific origins:

- **Allowed Origins**: `http://localhost:3000`, `http://localhost:5173` (development)
- **Allowed Methods**: `GET`, `HEAD`, `PUT`, `PATCH`, `POST`, `DELETE`, `OPTIONS`
- **Credentials**: Enabled for authenticated requests
- **Configuration**: Located in `src/main.ts` using `@fastify/cors`

### Helmet Security Headers

Helmet is enabled globally to set various HTTP security headers:

- **Content Security Policy (CSP)**: Prevents XSS attacks
- **Strict Transport Security (HSTS)**: Enforces HTTPS connections
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **Referrer Policy**: Controls referrer information
- **Cross-Origin Policies**: Manages cross-origin resource sharing

Example security headers applied:

```
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
```

### Rate Limiting

Rate limiting is implemented using `@nestjs/throttler` with multiple tiers:

- **Short-term**: 3 requests per second
- **Medium-term**: 20 requests per 10 seconds
- **Long-term**: 100 requests per 15 minutes

Rate limiting is applied globally to all endpoints and helps prevent:

- DDoS attacks
- Brute force attacks
- API abuse

### Testing Security Configuration

You can verify the security configuration using curl:

```bash
# Test security headers
curl -I http://localhost:8080/api/health

# Test CORS from allowed origin
curl -H "Origin: http://localhost:3000" -I http://localhost:8080/api/health

# Test rate limiting (make multiple rapid requests)
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:8080/api/health
```

## API Endpoints

### Health Check

- **GET** `/api/health` - Returns application health status
- **Response**: `{ "status": "ok", "timestamp": "2025-01-20T10:57:08.000Z" }`

## Development

### Project Structure

```
src/
├── main.ts              # Application entry point with security config
├── app.module.ts        # Root module with throttling setup
├── config/              # Configuration files
├── health/              # Health check module
├── users/               # Users module
└── prisma/              # Database module
```

### Security Best Practices

1. **Environment Variables**: Never commit sensitive data to version control
2. **CORS Configuration**: Only allow trusted origins in production
3. **Rate Limiting**: Monitor and adjust limits based on usage patterns
4. **Security Headers**: Regularly audit and update security policies
5. **Database Security**: Use parameterized queries and proper validation

## Monitoring

The application includes:

- Health check endpoint for monitoring
- Request logging via Pino
- Rate limiting metrics
- Security header validation
