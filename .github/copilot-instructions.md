# La Plume Virtuelle - AI Coding Agent Instructions

## Project Overview
**La Plume Virtuelle** is a digital library application serving books, audiobooks, and podcasts. The project is **mid-refactor**: transitioning from legacy Angular frontend to modern React, while maintaining a Java Spring Boot backend.

**Key Architecture Decision**: Monorepo structure with clear separation:
- `Backend/` - Spring Boot 3.2.3 REST API (Java 17)
- `FrontEnd/` - React 19 + Vite (modern, in-progress replacement)
- `front_legacy/` - Legacy Angular 17 (local only, not versioned)

---

## Critical Build & Workflow Commands

### Frontend (React/Vite)
```bash
cd FrontEnd
npm install           # Install dependencies
npm run dev          # Dev server at http://localhost:5173 (HMR enabled)
npm run build        # Prod build to dist/
npm run lint         # ESLint validation
```

### Backend (Spring Boot/Maven)
```bash
cd Backend
mvn clean install              # Full build with tests
mvn spring-boot:run           # Run dev server at http://localhost:8080
mvn clean spring-boot:run     # Fresh run (clears H2 cache)
```

**Environment**: Frontend and Backend run on **separate ports** (5173 & 8080) with CORS enabled on both `http://localhost:4200` (legacy) and `http://localhost:5173` (React).

---

## Architecture Patterns

### Frontend Structure
```
FrontEnd/src/app/
├── api/           # Axios-based API clients (authApi.js, livresApi.js, etc.)
├── router/        # Centralized routing (AppRouter.jsx)
├── features/      # Feature modules (auth, library, dashboard)
├── components/    # Reusable UI components + layouts
├── guards/        # Route guards (RequireAuth, RequireRegistration)
└── models/        # TypeScript interfaces & constants
```

**API Pattern**: Each endpoint domain has a dedicated file in `api/`:
- `authApi.js` - Login/register, uses `VITE_API_BASE_URL` env var
- `livresApi.js`, `audiobooksApi.js`, `podcastsApi.js` - Content endpoints
- Centralized `API_BASE` from `import.meta.env.VITE_API_BASE_URL` (fallback: `http://localhost:8080`)

**Routing**: Three-route structure in `AppRouter.jsx`:
1. **PublicLayout** - Home, login, register, public listings (no auth)
2. **MainLayout** (RequireAuth guard) - Dashboard, onboarding, library
3. **LibraryLayout** (nested) - Digital books, audiobooks, podcasts

### Backend Structure
```
Backend/src/main/java/com/example/laplumevirtuel/
├── controller/     # REST endpoints (AuthController, PreferenceController)
├── service/        # Business logic (AuthService, AuthServiceImpl)
├── repository/     # JPA/Hibernate data access
├── entities/       # JPA @Entity classes (Utilisateur, Livre, etc.)
├── dto/           # Data Transfer Objects (UserDTO)
├── config/        # Spring config (SecurityConfig, OpenApiConfig, DataInitializer)
├── security/      # JWT filters & utilities (JwtAuthenticationFilter, JwtUtil)
└── web/           # Exception handlers, interceptors
```

**Key Convention**: DTO mapping for responses - exclude sensitive fields (e.g., password) using mappers in controllers. Example: `AuthController.mapToDTO()` transforms `Utilisateur` entity to `UserDTO`.

### Data Flow: Auth Example
1. **Frontend**: `authApi.js:login()` sends email + password to `/auth/login`
2. **Backend**: `AuthController.login()` calls `AuthService.login()`
3. **AuthService**: Validates credentials, generates JWT token
4. **Response**: `{ user: UserDTO, token: "jwt..." }` (password excluded)
5. **Frontend**: Stores token in context/state, uses for subsequent requests

---

## Tech Stack & Dependencies

### Frontend (FrontEnd/)
- **React 19.2** - UI framework
- **Vite 7** - Build tool (rolldown-vite fork) with HMR
- **React Router 7.10** - Client-side routing
- **Tailwind CSS 3.4** - Styling (custom theme with `paper`, `ink`, `accent` colors)
- **Axios 1.13** - HTTP client
- **ESLint 9** - Linting (strict rules on unused vars, React hooks plugin)

### Backend (Backend/)
- **Spring Boot 3.2.3** - Web framework
- **Java 17** - Language version
- **Spring Security** - Authentication (JWT-based)
- **Spring Data JPA** - ORM layer
- **JWT (jjwt 0.11.5)** - Token generation & validation
- **H2 Database** - In-memory DB for dev (create-drop on restart)
- **Lombok** - Reduce boilerplate
- **SpringDoc OpenAPI 2.3** - Swagger/OpenAPI docs at `/swagger-ui.html`
- **Maven 3.8+** - Build tool

---

## Project-Specific Conventions

### JWT Authentication Flow
- **Storage**: JWT secret in `application.properties` (default: `laPlumevirtuelle2024SecretKeyForJWTTokenGenerationAndValidationMustBeLongerThan256bits!`)
- **Production**: Use `JWT_SECRET` and `JWT_EXPIRATION` environment variables
- **Filter**: `JwtAuthenticationFilter` intercepts all requests, validates tokens on protected endpoints
- **Frontend**: Must include `Authorization: Bearer <token>` header for authenticated routes

### API Response Pattern
```java
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:5173"})
public class AuthController { ... }
```
- CORS explicitly allows localhost:4200 (legacy) & 5173 (React)
- Endpoints return JSON; errors returned as `ResponseEntity.badRequest()`

### Frontend API Client Pattern
```javascript
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
export async function register(payload) {
  const res = await fetch(`${API_BASE}/auth/register`, { ... });
  if (!res.ok) throw new Error(...)
  return res.json();
}
```
- Uses Fetch API (not Axios)
- Error handling: re-throw with message for UI consumption
- Base URL from env var, fallback to localhost:8080

### Tailwind Theme Integration
Custom color palette in `tailwind.config.js`:
- **paper**: `#F8F6F2` (background)
- **ink**: `#1E1E1E` (primary text)
- **accent**: `#2F5D50` (CTA buttons)
- **gold**: `#C9A24D` (highlights)
- Use `bg-paper`, `text-ink`, `bg-accent` throughout components

### Layout Composition
```jsx
// PublicLayout.jsx - No auth required
<>
  <PublicNav />
  <Outlet />
</>

// MainLayout.jsx - Protected, shows dashboard nav
<RequireAuth>
  <Authenticated>
    <Nav /> <Outlet /> <Footer />
  </Authenticated>
</RequireAuth>
```

---

## Common Development Tasks

### Adding a New API Endpoint
1. **Backend**: Create controller method in `controller/`, add `@PostMapping` + `@RequestBody`
2. **Frontend**: Create client function in `api/newResourceApi.js`
3. **Test Auth**: Ensure `JwtAuthenticationFilter` runs (check `SecurityConfig` bean config)
4. **Test CORS**: Verify endpoint origin is in `@CrossOrigin` or global config

### Adding a New Protected Route
1. **Frontend**: Add route in `AppRouter.jsx` inside `<RequireAuth><MainLayout>` block
2. **Wrap component**: Ensure outer route uses `RequireAuth` guard
3. **Create guard file** in `guards/` if custom logic needed

### Running Tests
- **Frontend**: No explicit test setup visible; add Jest/Vitest if needed
- **Backend**: `mvn test` (Spring Boot Test + JUnit 5 by default)

### Database Changes (H2 Dev)
- Edit entity in `entities/` package
- Set `spring.jpa.hibernate.ddl-auto=create-drop` (auto-creates schema on boot)
- Use `DataInitializer` bean to seed test data on startup

---

## Debugging & Troubleshooting

### Frontend Issues
- **HMR not working**: Clear `.vite` cache, restart dev server
- **CORS errors**: Check backend `@CrossOrigin` includes `http://localhost:5173`
- **API 404**: Verify `VITE_API_BASE_URL` env var, default fallback is `localhost:8080`
- **ESLint errors**: Unused variables pattern: `varsIgnorePattern: '^[A-Z_]'` (constants allowed)

### Backend Issues
- **JWT expired**: Check `JWT_EXPIRATION` (default: 86400000ms = 1 day)
- **H2 db reset**: Remove `mvn spring-boot:run` process, restart (create-drop resets on boot)
- **CORS failures**: Ensure `AuthController` has `@CrossOrigin` with correct origin
- **Swagger not loading**: Ensure `springdoc-openapi` dependency, visit `http://localhost:8080/swagger-ui.html`

---

## File References for Key Patterns
- **Routing**: [FrontEnd/src/app/router/AppRouter.jsx](FrontEnd/src/app/router/AppRouter.jsx)
- **Auth API Client**: [FrontEnd/src/app/api/authApi.js](FrontEnd/src/app/api/authApi.js)
- **Auth Controller**: [Backend/src/main/java/com/example/laplumevirtuel/controller/AuthController.java](Backend/src/main/java/com/example/laplumevirtuel/controller/AuthController.java)
- **JWT Filter**: [Backend/src/main/java/com/example/laplumevirtuel/security/JwtAuthenticationFilter.java](Backend/src/main/java/com/example/laplumevirtuel/security/JwtAuthenticationFilter.java)
- **Tailwind Config**: [FrontEnd/tailwind.config.js](FrontEnd/tailwind.config.js)
- **App Config**: [Backend/src/main/resources/application.properties](Backend/src/main/resources/application.properties)

---

## Important Notes for AI Agents

1. **Legacy Angular exists locally** - Do NOT edit `front_legacy/` unless specifically asked; it's not versioned.
2. **Focus on React frontend** - New features go in `FrontEnd/`, not the legacy version.
3. **Environment-aware**: Use `.env` files for `VITE_API_BASE_URL` in development (not hardcoded).
4. **Security**: Never log tokens, API keys, or JWT secrets. Use environment variables for production.
5. **Monorepo gotcha**: Frontend & Backend are **independent deployments**—keep API contracts stable.
