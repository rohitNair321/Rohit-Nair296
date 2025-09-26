# PortfolioSite

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.11.

---

## About This Project

**PortfolioSite** is a modern, modular Angular portfolio template designed for developers and professionals. It features a clean architecture, dynamic content loading via JSON, and an integrated AI-powered chat assistant. The project is structured for scalability and maintainability, making it a great starting point for any new Angular-based portfolio or personal site.

---

## Project Structure

The project is organized into several key directories and files:

- `src/app`: Contains the core application code, including components, services, and modules.
- `src/assets`: Holds static assets such as images, fonts, and icons.
- `src/environments`: Contains environment-specific configuration files.
- `src/index.html`: The main HTML file that is served when the application is loaded.
- `src/main.ts`: The entry point of the application, bootstrapping the Angular module.
- `angular.json`: Configuration file for Angular CLI, defining project structure and build options.
- `package.json`: Contains project metadata and dependencies.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

---

## Key Packages Used

- **Angular** (v15+) – Main framework
- **@angular/forms** – Template-driven and reactive forms
- **@angular/router** – Routing and navigation
- **rxjs** – Reactive programming
- **@angular/animations** – Animations support
- **Bootstrap** (via CDN) – Optional, for quick styling
- **FontAwesome & Material Icons** – Iconography

---

## AI Agent Integration

- **AI Chat-Bot**:  
  The project includes a reusable `ChatBotComponent` that connects to an AI backend (e.g., Google Gemini via Supabase Edge Functions).
- **How it works**:  
  - User messages are sent to the backend using `OpenAIService` (see `core/services/open-ai.service.ts`).
  - The backend (Supabase Edge Function) handles CORS and proxies requests to the AI API.
  - The chat-bot supports loading indicators, error handling, and theming via SCSS variables.

---

## Dynamic Content

- All portfolio and about-me content is stored in `assets/data/profile.json`.
- Components fetch and render this data dynamically using Angular's `HttpClient`.
- This allows easy updates to content without code changes.

---

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
