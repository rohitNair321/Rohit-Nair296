# Rohit Angular Boilerplate

Angular 19 standalone frontend with SSR, runtime theming, auth flows, admin/profile management, notifications, and AI chat session support.

## Overview

This repository is not just a basic portfolio app anymore. The current codebase is a reusable Angular application shell with:

- standalone Angular architecture
- Express-backed SSR
- runtime theme switching via CSS variables
- public and auth layouts
- admin-oriented settings and profile editing
- AI chat session UI
- analytics and monitoring components

The current implementation mixes portfolio content and boilerplate/platform features. If this is intended for production use, the product direction should be made explicit.

## Current Stack

### Frontend

- Angular `19.2.x`
- TypeScript `5.8.x`
- RxJS `7.8.x`
- PrimeNG `19.1.x`
- Angular CDK
- `ngx-markdown`
- Highcharts + `highcharts-angular`
- Bootstrap `5.3.x`
- Font Awesome

### Runtime

- Angular SSR via `@angular/ssr`
- Express server
- Node.js

### Integration libraries

- `@google/generative-ai`
- `@supabase/supabase-js`

## Scripts

- `npm run dev` - starts Angular dev server
- `npm run build` - creates production build
- `npm run start` - runs SSR output from `dist/portfolio-site/server/server.mjs`

## Project Structure

### Top level

```text
Frontend/
|-- src/
|   |-- app/
|   |-- assets/
|   |-- environments/
|   |-- public/
|   |-- styles/
|   |-- favicon.ico
|   |-- index.html
|   |-- main.server.ts
|   |-- main.ts
|   `-- server.ts
|-- angular.json
|-- package.json
|-- package-lock.json
|-- proxy.conf.json
|-- server.ts
|-- tsconfig.json
|-- tsconfig.app.json
|-- tsconfig.spec.json
|-- README.md
`-- application.md
```

### App folder

```text
src/app/
|-- auth/
|   |-- forgot-password/
|   |-- login/
|   |-- models/
|   |-- register/
|   |-- reset-password/
|   |-- services/
|   `-- auth.routes.ts
|-- core/
|   |-- app-gards/
|   |-- config/
|   |-- interceptors/
|   |-- services/
|   `-- theme/
|-- features/
|   |-- home/
|   |-- notification/
|   `-- settings/
|-- layouts/
|   |-- auth-layout/
|   |-- main-layout/
|   `-- page-not-found/
|-- shared/
|   |-- components/
|   |-- directives/
|   |-- pipes/
|   `-- services/
|-- app.component.css
|-- app.component.html
|-- app.component.spec.ts
|-- app.component.ts
|-- app.config.server.ts
|-- app.config.ts
`-- app.routes.ts
```

### Shared components

```text
src/app/shared/components/
|-- about-me-editor/
|-- ai-usage-dashboard/
|-- app-analytics/
|-- chat-bot/
|-- dialogs/
|-- footer/
|-- my-learning-post/
|-- navigation/
|-- profile-menu/
|-- sidebar/
`-- ui/
    |-- alert-dialog/
    `-- spinner-overlay/
```

### Folder responsibilities

- `src/app/auth` - authentication screens, route definitions, auth service, auth models
- `src/app/core` - guards, app config, menu config, interceptor, global services, theme engine
- `src/app/features` - route-level pages such as home, notifications, and settings
- `src/app/layouts` - page shells for main app, auth, and not-found state
- `src/app/shared` - reusable UI building blocks, directives, pipes, and browser helpers
- `src/assets` - static files, resume PDF, and `src/assets/data/profile.json`
- `src/environments` - environment flags; currently minimal and not fully wired for API endpoints
- `src/public` - public metadata, including Chrome DevTools app-specific manifest
- `src/styles` - global SCSS, mixins, token files, and theme generators

### Important structure details

- `src/app/features/settings` is effectively the admin CMS/profile editor
- `src/app/shared/components/chat-bot` contains the AI chat UI
- `src/app/core/theme` contains the runtime CSS-token theme system
- root `server.ts` is the SSR Express entry used for production runtime
- `src/server.ts` also exists and should be reviewed to avoid duplicate-server confusion

## Architecture

### Application model

The app uses:

- `bootstrapApplication(...)`
- standalone components
- `ApplicationConfig` providers in `src/app/app.config.ts`
- functional HTTP interceptors
- Angular signals for reactive state
- hash-based routing
- hydration and SSR support

### Core shell

`MainLayoutComponent` is the main app shell. It handles:

- navbar/sidebar layout mode
- theme switching
- responsive mobile behavior
- role-based visibility of notifications, profile UI, and chat

### Shared base class

Many components extend `CommonApp` from `src/app/core/services/common.ts`, which exposes shared services and common UI helpers.

## Routing

Defined in `src/app/app.routes.ts`.

### Public

- `/` -> `MainLayoutComponent`
  - default child route loads `HomeComponent`

### Auth

- `/auth/login`
- `/auth/register`
- `/auth/forgot-password`
- `/auth/reset-password`

### Admin

- `/admin` is protected by `tokenGuard`
- current admin child routes are not yet registered

### Fallback

- wildcard route -> `PageNotFoundComponent`

## Major Features

### Runtime theming

The theme system is implemented in `src/app/core/theme/theme.service.ts` and supports:

- theme registry
- light/dark token sets
- CSS variable application to `:root`
- local storage persistence
- API-provided theme registration

### Authentication

Implemented under `src/app/auth`.

Flows present in code:

- login
- register
- forgot password
- reset password
- logout
- app/session initialization

### Profile and settings

`src/app/features/settings/settings.component.ts` includes:

- profile editing
- avatar upload
- resume upload
- skills editing
- work experience and project editing
- theme creation/edit/delete
- password update
- analytics widgets
- AI usage dashboard
- unsaved changes protection

### Notifications

`src/app/features/notification/notification.component.ts` supports:

- notification display
- unread count handling
- mark-as-read
- delete

### AI chat

`src/app/shared/components/chat-bot/chat-bot.component.ts` provides:

- floating chat UI
- session history
- session selection/deletion
- server-backed message persistence
- markdown-rendered bot responses

## Data Sources

### Static content

`src/assets/data/profile.json` still contains Rohit Nair portfolio/resume content.

### API-driven features

The service layer is structured for backend integration, but several base URLs are still empty in the current repository. That means:

- the architecture is ready for API wiring
- the environment configuration is not yet complete

Affected services include:

- `src/app/core/services/app.service.ts`
- `src/app/core/services/chat-api.service.ts`
- `src/app/auth/services/auth.service.ts`

## SSR

`server.ts` provides:

- Express SSR hosting
- static asset serving
- host allowlist checks
- render timeout handling
- simple CORS support for allowed origins

## Development Notes

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open `http://localhost:4200/`.

### Production build

```bash
npm run build
```

### Run SSR build

```bash
npm run start
```

## Current Gaps

Important issues in the current repo:

- `README.md` was outdated before this update
- `application.md` had been empty
- admin routes are guarded but not fully exposed
- service endpoint base URLs are still empty
- `src/app/auth/auth.routes.ts` appears stale and inconsistent
- the app identity is split between portfolio, boilerplate, and admin CMS

## Recommended Next Steps

1. Decide the actual product identity.
2. Move API endpoints into environment configuration.
3. Register real admin child routes.
4. Remove stale routing/config code.
5. Normalize naming across profile/theme payloads.
6. Clean unused imports and dead code.
7. Add a short backend integration section once API URLs are defined.

## References

- `application.md:1`
- `src/app/app.routes.ts:1`
- `src/app/app.config.ts:1`
- `src/app/core/theme/theme.service.ts:1`
- `src/app/features/settings/settings.component.ts:1`
- `src/app/shared/components/chat-bot/chat-bot.component.ts:1`
- `server.ts:1`
