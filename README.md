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
