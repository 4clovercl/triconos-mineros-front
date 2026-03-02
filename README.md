# TriconosMineros — Mining Operations Platform

Enterprise-grade SaaS frontend for real-time mining machinery monitoring and operations management.

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **UI**: Tailwind CSS v4 + dark mode
- **Charts**: Apache ECharts via `echarts-for-react`
- **State**: Zustand (persisted)
- **i18n**: next-intl (EN / ES / PT)
- **Animations**: Framer Motion
- **Docker**: Multi-stage build

## Features

| Feature | Description |
|---|---|
| 🔐 Login | Mock auth with 3 roles: Admin, Operator, Viewer |
| 🌐 i18n | EN / ES / PT — selected on login screen |
| 🌙 Dark/Light | Toggleable theme, persisted per user |
| 📊 Summary | KPI cards, stopped assets table, alerts timeline |
| ⚡ Real-time | Live machine telemetry cards, auto-updates every 5s |
| 🔬 Machine Detail | 8 telemetry cards, ECharts historical charts (1h/24h/7d/30d) |
| 🔧 Tickets | Maintenance ticket management with auto-generated ticket badges |
| 👥 Users (Admin) | Full user management with granular permissions panel |
| ⚙️ Config (Admin) | Per-machine sensor threshold configuration + auto-ticket toggles |
| 📱 Responsive | Mobile-first, collapsible sidebar, drawer on mobile |

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@triconos.com` | `admin123` |
| Operator | `operator@triconos.com` | `op123` |
| Viewer | `viewer@triconos.com` | `view123` |

## Development

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

## Docker (Production)

```bash
# From the project root
docker compose up --build
```

App runs at http://localhost:3000

## Project Structure

```
frontend/
  src/
    app/[locale]/
      login/            # Login page (all users)
      (dashboard)/
        summary/        # Operational summary
        realtime/       # Live dashboard
        machine/[id]/   # Machine detail
        tickets/        # Maintenance tickets
      (admin)/
        users/          # User management
        configurations/ # Threshold config
    components/
      layout/           # Sidebar, Header
      ui/               # Reusable components
      charts/           # ECharts wrappers
    lib/
      mock/             # All mock data
      stores/           # Zustand state
      hooks/            # useRealTimeData
      utils/            # Permissions, formatters
    messages/           # EN/ES/PT translations
```
