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

- **Angular** (v17) – Main framework (migrated from v15)
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

# 🚀 Migration Guide: Angular v15 ➜ Angular v17 (Standalone)

This project was successfully migrated from an NgModule-based Angular v15 setup to a fully **standalone Angular v17** application.

### 🧭 Migration Strategy (Phase-by-Phase)

1. **Bootstrap conversion** → `AppModule` removed, replaced with `bootstrapApplication(AppComponent, appConfig)` in `main.ts`.
2. **Routing update** → `app-routing.module.ts` replaced with `app.routes.ts` using `provideRouter(routes)`.
3. **Global providers** → moved into `app.config.ts` using `provideHttpClient`, `provideAnimations`, and `importProvidersFrom()`.
4. **Layouts** → `MainLayout` & `AuthLayout` converted to standalone components.
5. **Feature pages** → each component imports its own dependencies (`CommonModule`, `ReactiveFormsModule`, PrimeNG modules).
6. **Core/Shared cleanup** → removed `BrowserModule`, used `CommonModule`, and migrated services to `providedIn:'root'`.
7. **Added functional interceptors** → new `HttpInterceptorFn` approach with `withInterceptors()`.

---

### ⚙️ Key Changes

#### ✅ Root Bootstrap
```ts
// main.ts
bootstrapApplication(AppComponent, appConfig);
```

#### ✅ Global Providers
```ts
// app.config.ts
provideRouter(routes);
provideHttpClient(withFetch(), withInterceptors([authInterceptor]));
provideAnimations();
```

#### ✅ Routing
```ts
// app.routes.ts
{ path: 'about-me', loadComponent: () => import('./features/about-me/about-me.component').then(m => m.AboutMeComponent) }
```

#### ✅ Layouts (Standalone)
```ts
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {}
```

#### ✅ Interceptor (Functional Style)
```ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken?.();
  const cloned = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;
  return next(cloned);
};
```

---

### 🧠 Common Errors & Fixes

| Error | Cause | Fix |
|-------|--------|-----|
| `'p-card' is not a known element` | PrimeNG module not imported in standalone component | Add `CardModule` to `imports` |
| `No pipe found with name 'slice'` | Missing `CommonModule` | Import `CommonModule` |
| `Can't bind to 'formGroup'` | Missing `ReactiveFormsModule` | Import `ReactiveFormsModule` |
| **NG05100** | `BrowserModule` still imported somewhere | Replace with `CommonModule` |
| `routerLink` not working | `RouterLink` not imported | Add `RouterLink` to `imports` |
| `app-profile-menu not a known element` | Child not imported in parent standalone component | Add `ProfileMenuComponent` to parent’s `imports` |

---

### 🔍 Debugging Tips

- **Template errors (NG8001/NG8002)** → Missing imports in that component.  
- **Runtime NG05100** → Remove all `BrowserModule` imports (use `CommonModule` instead).  
- **Routing issues** → Verify path and import `RouterLink`.  
- **HTTP not working** → Ensure `provideHttpClient(withFetch())` is registered.  
- **Duplicate providers** → Remove `HttpClientModule` or `BrowserAnimationsModule` from old modules.

---

### ✅ Final Cleanup

After all features are standalone:
- Delete `AppModule`, `AppRoutingModule`, `CoreModule`, and `SharedModule`.
- Remove `importProvidersFrom(CoreModule, SharedModule)` from `app.config.ts`.
- Verify no usage of `BrowserModule` or `BrowserAnimationsModule`.
- Run `ng serve` → should compile cleanly with only standalone components.

---

### 💡 New Angular v17 Features (for future use)
- **Signals** → Lightweight reactivity system.
- **@if, @for** → New structural directives.
- **@defer** → Lazy rendering for performance.
- **SSR/SSG** → Add `@angular/ssr` for SEO-friendly pre-rendering.

---

### ✅ Sanity Checklist

- [x] App builds with `bootstrapApplication()`  
- [x] Routing works via `app.routes.ts`  
- [x] Layouts and features compile with correct imports  
- [x] PrimeNG + Forms + Pipes working  
- [x] Interceptors registered using `withInterceptors()`  
- [x] No `BrowserModule` or duplicate providers  

---

### 📘 Summary
This migration moved **PortfolioSite** from a module-based v15 architecture to a clean **standalone Angular v17** structure — improving performance, clarity, and maintainability while unlocking Angular’s newest features.
