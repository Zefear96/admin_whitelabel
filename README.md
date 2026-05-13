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

### Docker Build

# Создайте .env файл в корне проекта:
# VITE_APP_NAME=your-app-name
# VITE_KEYCLOAK_URL=https://keycloak.example.com
# VITE_BASE_URL=https://api.example.com
# VITE_KEYCLOAK_REALM=your-realm
# VITE_KEYCLOAK_CLIENT=your-client-id

# Сборка образа с переменными окружения (через build args)
docker build -t backoffice-react-app:latest \
  --build-arg VITE_APP_NAME="your-app-name" \
  --build-arg VITE_KEYCLOAK_URL="https://keycloak.example.com" \
  --build-arg VITE_BASE_URL="https://api.example.com" \
  --build-arg VITE_KEYCLOAK_REALM="your-realm" \
  --build-arg VITE_KEYCLOAK_CLIENT="your-client-id" \
  .

# Запуск контейнера (порт 3000 внутри контейнера)
docker run -p 8080:3000 backoffice-react-app:latest

# Или используя docker-compose с .env файлом
docker-compose build
docker-compose up

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


---

## Дополнительная информация (для аудита и сопровождения)

_Эта секция автоматически синхронизируется с актуальным состоянием платформы. Источник истины: `mbp/knowledge/` и Jira-проект MBP._

### Архитектура и связи с другими сервисами

React + Ant Design SPA для администраторов банка. Обращается к `admin-backend` за всеми данными, аутентификация через Keycloak (SSO).

**Этот сервис ходит к:**
- `admin-backend`
- `Keycloak`

### Безопасность и контроль доступа

- **Хранение токенов:** httpOnly + Secure + SameSite=Strict cookies; in-memory access-token; silent refresh через `/api/auth/whoami`.
- **CSP:** строгая Content-Security-Policy, исключающая `unsafe-inline`/`unsafe-eval`.
- **SSO:** Keycloak через Authorization Code + PKCE.

### Аудит-замечания и связанные задачи Jira

- MBP-542 — §5.1 закоммичены сертификаты в certs/*.pem
- MBP-548 — §5.3 JWT в localStorage (kc_user) + отсутствие CSP

### Локальный запуск — краткая шпаргалка

- Stack: **React** (TypeScript).
- Установка: `npm install` (или `pnpm install`).
- Запуск: `npm run dev` (Vite) или `npm start` (CRA).
- **WebStorm / IntelliJ Ultimate**: Run Configuration **npm** → script `dev`.

### Перекрёстные ссылки

- Архитектура межсервисной коммуникации: `mbp/knowledge/EIB-Service-Communication-Architecture.pdf`
- Аудит безопасности (issues): `mbp/knowledge/EIB-Audit-Findings.pdf`
- Рекомендуемые решения по 17 категориям: `mbp/knowledge/EIB-Audit-Solutions.pdf`
- Pen-test моб-приложения: `mbp/knowledge/Ecoislamic_mob_report.docx`
- Security guide / playbook: `mbp/knowledge/SECURITY-GUIDE-RU 2.md`, `OPERATIONS-PLAYBOOK-RU 2.md`
- CI/CD-шаблоны: `devops/ci-templates` (общий `.gitlab-ci.yml` через `include:`)
- Jira-проект: [MBP](https://jira.eib.kg/projects/MBP)

