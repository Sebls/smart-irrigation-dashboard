# Smart Irrigation Dashboard

The Smart Irrigation Dashboard is a web-based application designed to monitor and visualize a smart irrigation system in real time. It acts as the frontend interface for an IoT-based infrastructure composed of multiple irrigation zones, plants, and sensors, orchestrated by a central edge controller.

The dashboard consumes data from a backend API Gateway that aggregates sensor measurements, irrigation events, camera feeds, and external weather information. Its main goal is to provide a centralized platform for monitoring system status, analyzing historical data, and supporting data-driven irrigation decisions.

The system follows a hierarchical data model:

* The system is composed of multiple irrigation zones.
* Each irrigation zone contains multiple plants.
* Each plant can have one or more soil humidity sensors, in addition to zone-level environmental sensors.

The dashboard enables users to navigate this hierarchy, moving from a global system overview to zone-level and plant-level monitoring, and down to individual sensor analysis.

This frontend dashboard, which consumes the API and provides visualization and interaction.

The dashboard does not directly communicate with hardware devices; all interactions occur through the backend services.

## Project structure

This project uses **Next.js App Router** (`app/`) and a modular architecture for shared UI, feature modules, and infrastructure concerns.

```text
app/                  # Next.js routes (App Router) — the “pages” of the application in this repo
components/           # All shared components that are used across the entire application
  ui/                 # shadcn/ui primitives
composables/          # All shared composables
config/               # Application configuration files
features/             # Contains all the application features (most application code lives here)
layouts/              # Different layouts for the pages
lib/                  # Configurations for different third-party libraries used by the application
pages/                # The pages of the application (concept); routes are implemented in `app/` (App Router)
services/             # Shared application services and providers
stores/               # Global state stores
test/                # Test-related mocks, helpers, utilities, and configurations
types/                # Shared TypeScript type definitions
utils/                # Shared utility functions
```

Notes:

- **Legacy import paths**: `@/lib/types`, `@/lib/utils`, `@/lib/mock-data`, and `@/hooks/*` are kept as thin re-exports for compatibility.
- **Architecture overview**: see `docs/ARCHITECTURE.md`.

## Commands

### Install dependencies

Using npm:

```bash
npm install
```

Using pnpm (recommended for this repo because `pnpm-lock.yaml` is present):

```bash
pnpm install
```

### Run the app (development)

Using npm:

```bash
npm run dev
```

Using pnpm:

```bash
pnpm dev
```

Then open `http://localhost:3000`.

### Build for production

Using npm:

```bash
npm run build
```

Using pnpm:

```bash
pnpm build
```

### Run production build

Using npm:

```bash
npm run start
```

Using pnpm:

```bash
pnpm start
```

### Lint

Using npm:

```bash
npm run lint
```

Using pnpm:

```bash
pnpm lint
```

### Tests

Using npm:

```bash
npm run test
```

Using pnpm:

```bash
pnpm test
```
