# Quickstart: State Architecture + Mock API

**Feature**: 003-state-mock-api | **Date**: 2026-04-15

## Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npx expo`)
- iOS Simulator or Android Emulator (or Expo Go)

## Setup

```bash
# Install dependencies (already done for existing phases)
npm install

# Start the development server
npm start
```

## Key Files to Understand

| File                       | Purpose                                                                                   |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| `src/api/mock-db.ts`       | Persistent in-memory mock database. The single source of truth for all server-state data. |
| `src/api/mock-server.ts`   | API contract functions that wrap mock-db with latency, validation, and error injection.   |
| `src/api/types.ts`         | Request/response types for all API operations.                                            |
| `src/stores/cart-store.ts` | Zustand store for cart (client-state, persisted to AsyncStorage).                         |
| `src/hooks/use-*.ts`       | React Query hooks — the ONLY way UI components access data.                               |

## Data Flow

```
UI Component
    ↓ (calls hook)
React Query Hook (use-kitchens, use-orders, etc.)
    ↓ (calls API function)
Mock Server (mock-server.ts) — adds latency, validates, injects errors
    ↓ (reads/writes)
Mock DB (mock-db.ts) — in-memory state persisted to AsyncStorage
    ↓ (on write)
React Query Invalidation → UI re-renders with fresh data
```

## Adding a New API Endpoint

1. Define request/response types in `src/api/types.ts`
2. Add the function to `src/api/mock-server.ts` (read/write mock-db, validate, return typed response)
3. Create a React Query hook in `src/hooks/` (use `useQuery` for reads, `useMutation` + `invalidateQueries` for writes)
4. Add seed data in `src/api/seeds/` if needed

## Adding a New Seed Entity

1. Create `src/api/seeds/<entity>.ts` with fixed-ID seed records
2. Import and merge into the seed data initializer in `src/api/mock-db.ts`
3. Add the entity type to `src/types/<entity>.ts`

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npx jest __tests__/cart-store.test.ts

# Run with coverage
npx jest --coverage
```

### Critical Test Cases

- **Cart calculations**: Add items, change quantities, verify totals
- **Order pipeline**: Create order → advance statuses → verify transitions
- **Persistence**: Write data → reload DB → verify data intact
- **Cross-role consistency**: Customer places order → chef sees it

## Mock DB Reset

From the app's developer settings screen, trigger the reset-to-seeds action. This clears all runtime data and re-initializes from seed files. Programmatically:

```typescript
import { resetToSeeds } from '../api/mock-db';
await resetToSeeds();
```

## Error Injection

Toggle error injection from developer settings (default OFF). When enabled, mock API calls randomly return error responses. Useful for testing loading/error states.

```typescript
import { useSettingsStore } from '../stores/settings-store';
useSettingsStore.getState().setDevErrorInjection(true);
```
