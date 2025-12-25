# EIB Admin Application Documentation

## Project Overview
React-based admin dashboard for EIB with:
- Role-based access control
- Theming system (light/dark modes)
- Dynamic menu system
- Authentication flow
- Built with Vite, TypeScript, and Ant Design

## Setup Instructions

### Prerequisites
- Node.js v18+
- npm v9+

### Installation
```bash
git clone <repository-url>
cd eib-admin-app
npm install
```

### Development
```bash
npm run dev

```

### Production Build
```bash
npm run build
```

# сборка образа
docker build -t backoffice-react-app:latest .

# запуск контейнера с runtime переменными
docker run -p 8080:80 \
  -e VITE_APP_NAME="variable" \
  -e VITE_KEYCLOAK_URL="variable" \
  -e VITE_BASE_URL="variable" \
  -e VITE_KEYCLOAK_REALM="variable" \
  -e VITE_KEYCLOAK_CLIENT="variable" \
  backoffice-react-app:latest

## Architecture

### Core Technologies
- React 19
- TypeScript
- Vite
- React Router
- React Query
- Ant Design

### File Structure
```
src/
├── components/    # Reusable components
├── features/      # Feature modules
├── hooks/         # Custom hooks
├── pages/         # Page components
├── routes/        # Routing configuration
├── services/      # API services
├── store/         # State management
├── theme/         # Theming system
├── types/         # Type definitions
└── utils/         # Utility functions
```

## Core Systems

### Authentication
- JWT-based authentication
- Role-based access control
- Token refresh handling
- Protected routes

### Theming
- Light/dark mode toggle
- Theme persistence
- CSS variable integration

### Menu System
- Dynamic menu generation
- Role-based visibility
- Nested menu support
- Mock data structure

## API Reference

### Auth Service
- `login(username, password)`: Authenticate user
- `logout()`: Clear session
- `useAuth()`: Access auth context

### Theme Service
- `toggleTheme()`: Switch between light/dark
- `useTheme()`: Access theme context

### Menu Service
- `fetchMenuSections()`: Get role-based menu
- `mapSectionsToMenuItems()`: Convert to AntD format

## Usage Examples

### Using Auth
```typescript
const { login, logout, user } = useAuth();

// Login
await login('admin', 'password');

// Logout
logout();
```

### Using Theme
```typescript
const { themeMode, toggleTheme } = useTheme();

// Toggle theme
<Button onClick={toggleTheme}>
  Switch to {themeMode === 'light' ? 'dark' : 'light'} mode
</Button>
```

### Customizing Menu
Edit `src/config/sections.ts` to modify menu structure and permissions.
