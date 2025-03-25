# Tanstack Router / Golang / Zitadel Auth Demo

This project demonstrates how to implement authentication with [Zitadel](https://zitadel.com/) in a full-stack application using:

- **Frontend**: React with [TanStack Router](https://tanstack.com/router/v1) and [Bun](https://bun.sh/)
- **Backend**: Golang with [Echo](https://echo.labstack.github.io/docs/)

## Project Structure

```
├── frontend/               # React application with TanStack Router
│   ├── src/
│   │   ├── context/        # Authentication context and provider
│   │   ├── routes/         # Application routes and pages
│   │   ├── components/     # Reusable UI components
│   │   ├── services/       # API client and services
│   │   └── main.tsx        # Application entry point
│   └── .env                # Frontend environment variables
├── backend/                # Golang Echo server
│   ├── middleware/         # Authentication middleware
│   ├── main.go             # Server entry point
│   └── .env                # Backend environment variables
```

## Prerequisites

1. [Bun](https://bun.sh/) for the frontend
2. [Go](https://golang.org/) 1.18+ for the backend
3. A [Zitadel](https://zitadel.com/) account and project setup

## Zitadel Setup

1. Create a Zitadel account at [https://zitadel.com/](https://zitadel.com/)
2. Create a new project in Zitadel
3. Set up an application:
   - Type: Web
   - Redirect URIs: `http://localhost:5173/callback`
   - Allowed Origins: `http://localhost:5173`
   - Grant Types: Authorization Code with PKCE
4. Create an API resource (for the backend authorization)
5. Note your Client ID and API Audience values

## Environment Setup

### Frontend (.env)

```
VITE_ZITADEL_DOMAIN=http://localhost:8080
VITE_ZITADEL_CLIENT_ID=your_client_id
VITE_API_URL=http://localhost:8000/api
VITE_API_AUDIENCE=your_api_audience
```

### Backend (.env)

```
ZITADEL_DOMAIN=http://localhost:8080
JWT_AUDIENCE=your_api_audience
JWT_ISSUER=http://localhost:8080
PORT=8000
```

## Running the Application

### Backend

1. Navigate to the backend directory:

   ```
   cd backend
   ```

2. Install dependencies:

   ```
   go mod download
   ```

3. Run the server:

   ```
   go run main.go
   ```

   The backend will start on port 8000 by default.

### Frontend

1. Navigate to the frontend directory:

   ```
   cd frontend
   ```

2. Install dependencies:

   ```
   bun install
   ```

3. Start the development server:

   ```
   bun dev
   ```

   The frontend will start on port 5173 by default.

## Authentication Flow

1. The user visits the application and clicks "Login"
2. The frontend redirects to Zitadel's authorization endpoint with:
   - PKCE code challenge for security
   - Client ID, redirect URI, and requested scopes
3. User authenticates with Zitadel
4. Zitadel redirects back to `/callback` with an authorization code
5. The frontend exchanges the code for access and ID tokens
6. Tokens are stored in local storage
7. Protected routes use the AuthProvider context to check authentication status
8. API calls to the backend include the access token in the Authorization header
9. The backend validates the JWT token using Zitadel's JWKS endpoint

## Protected Resources

- Frontend: Routes with the `_authenticated` prefix are protected and require a valid session
- Backend: Endpoints under the `/api` path (except `/api/health`) require valid JWT authentication

## Key Components

### Frontend

- **AuthProvider**: Manages authentication state, token storage and renewal
- **Protected Routes**: Routes that require authentication
- **API Client**: Makes authenticated requests to the backend

### Backend

- **JWT Middleware**: Validates tokens and extracts user information
- **Protected API Endpoints**: Only accessible with valid authentication

## Development

To modify the application:

1. Frontend routes are defined in the `src/routes` directory
2. Backend endpoints are defined in `main.go`
3. Authentication logic is in `frontend/src/context/AuthProvider.tsx` and `backend/middleware/middleware.go`

## Troubleshooting

- Check browser console for frontend errors
- Verify backend logs for authentication issues
- Ensure Zitadel configuration matches your .env files
- Confirm that redirect URIs match exactly between code and Zitadel configuration

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.
