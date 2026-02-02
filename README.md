# SAE POS - CMS Dashboard

Admin dashboard for SAE POS built with Next.js and clean iOS-style design.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Recharts
- **Icons**: Lucide React

## Features

- 🎨 Clean iOS-inspired design system
- 📊 Real-time analytics dashboard
- 💳 Subscription management
- 🏪 Multi-store management
- 📦 Product catalog CRUD
- 💰 Transaction monitoring
- 📈 Reports & exports
- 🌓 Dark mode support

## Project Structure

```
sae-cms/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── subscriptions/
│   │   ├── stores/
│   │   ├── products/
│   │   ├── transactions/
│   │   ├── analytics/
│   │   └── settings/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                    # Reusable UI components
│   ├── charts/                # Chart components
│   └── layout/                # Layout components
├── lib/
│   ├── api/                   # API client
│   ├── stores/                # Zustand stores
│   └── utils.ts               # Utilities
└── styles/
    └── globals.css
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Build

```bash
# Build for production
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

## Environment Variables

Create `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# Authentication
NEXT_PUBLIC_JWT_SECRET=your-secret-key

# App Configuration
NEXT_PUBLIC_APP_NAME="SAE POS"
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## Design System

The CMS follows clean iOS design principles:

- **Typography**: SF Pro-inspired font stack
- **Colors**: Minimal, professional palette
- **Spacing**: Consistent 4px grid
- **Components**: Subtle shadows, smooth transitions
- **Layout**: Clean, uncluttered interfaces

## Pages

### Dashboard

- Sales overview and metrics
- Revenue charts
- Active subscriptions
- Recent transactions

### Subscriptions

- List all subscribers
- Manage subscription plans
- Billing history
- Renewal management

### Stores

- Store profiles and settings
- Staff management
- Device management
- Store configuration

### Products

- Product catalog
- Categories & tags
- Bulk import/export
- Inventory tracking

### Transactions

- Transaction history
- Payment breakdown
- Refund management
- Real-time monitoring

### Analytics

- Custom date ranges
- Export reports (PDF/Excel)
- Product performance
- Payment analytics

## License

Proprietary
