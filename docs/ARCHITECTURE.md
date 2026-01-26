# Architecture (Smart Irrigation Dashboard)

## Folder responsibilities

- **`components/`**: All shared components that are used across the entire application.
- **`composables/`**: All shared composables.
- **`config/`**: Application configuration files.
- **`features/`**: Contains all the application features. We want to keep most of the application code inside here.
- **`layouts/`**: Different layouts for the pages.
- **`lib/`**: Configurations for different third-party libraries that are used in our application.
- **`pages/`**: The pages of our application.
- **`services/`**: Shared application services and providers.
- **`stores/`**: Global state stores.
- **`test/`**: Test-related mocks, helpers, utilities, and configurations.
- **`types/`**: Shared TypeScript type definitions.
- **`utils/`**: Shared utility functions.

## High-level overview

This repository is a **Next.js App Router** frontend that renders a dashboard UI for an irrigation system (zones → plants → sensors). The UI consumes data from a backend API Gateway (and, for local UI development, uses deterministic mocks).

## Routing & layouts

- **App Router**: all routes live in `app/` (e.g. `app/page.tsx`, `app/zones/*`).
- **Layouts**: reusable page shells live in `layouts/`. The dashboard “chrome” (sidebar + header + main) is implemented in `layouts/dashboard/` and reused across pages.
- **`pages/` folder**: in this repo, routes are implemented in `app/`. The top-level `pages/` directory is intentionally kept free of Next.js routes to avoid mixing routing systems.

## Feature modules

Domain code is grouped by feature under `features/`:

- **`features/overview`**: overview widgets/cards used on the dashboard home
- **`features/zones`**: zone and plant UI components
- **`features/sensors`**: sensor visualizations (charts)
- **`features/water`**: water usage / tank UI
- **`features/weather`**: weather widgets and forecast UI

Each feature is expected to own its:

- view-level components
- feature logic (formatting, transforms)
- (future) feature state, API calls, and services

## Shared UI & design system

- **Reusable UI** lives in `components/`.
- **shadcn/ui primitives** live in `components/ui/`.
- Global styles are in `app/globals.css` (and `styles/globals.css` where applicable).

## Composables (shared hooks)

Shared hooks and reusable reactive logic live in `composables/` (e.g. `use-toast`, `use-mobile`).

Important SSR note:

- Anything used by both server and client bundles must be **deterministic** on initial render to avoid hydration mismatches.

## Data, mocks, and determinism

- **Mocks** live in `test/mocks/` and are used by pages/components for local development.
- Mock generation is kept **deterministic** (seeded + fixed base time) so SSR and hydration render identical HTML.

## Types & utilities

- **Domain types** live in `types/` and are re-exported via `@/lib/types` for compatibility.
- **Shared utilities** live in `utils/` (e.g. `cn`), also re-exported via `@/lib/utils`.

## Services & stores (infrastructure)

These folders are scaffolded for the next iteration:

- **`services/`**: API clients, auth, synchronization, external SDK integration
- **`stores/`**: global/shared state (selected zone, cached readings, etc.)
- **`config/`**: environment config, endpoints, constants

## Testing

- Tests live in `test/` and run with **Vitest** (`npm run test` / `pnpm test`).
- `test/mocks/` contains deterministic fixtures used by tests and UI development.

Based on: https://fadamakis.com/a-front-end-application-folder-structure-that-makes-sense-ecc0b690968b