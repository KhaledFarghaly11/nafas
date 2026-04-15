# Implementation Plan: State Architecture + Mock API

**Branch**: `feature/003-state-mock-api` | **Date**: 2026-04-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-state-mock-api/spec.md`

## Summary

Build the state architecture and mock API layer for Nafas: a persistent local data store initialized from seed data, Zustand stores for client-side state (cart, session, settings), mock server endpoints covering all domain operations (auth, kitchens, orders, menu, schedule, analytics), and React Query hooks that expose these endpoints to UI components. The system must ensure cross-role consistency (customer orders visible to chefs, chef menu changes visible to customers) and full data persistence across app restarts.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict mode)
**Primary Dependencies**: Expo SDK 54, React 19.1, React Native 0.81, TanStack React Query 5.99, Zustand 5.0, AsyncStorage 2.2, Expo Router 6.0
**Storage**: AsyncStorage (persisted mock DB + Zustand persist)
**Testing**: Jest 29.7 + React Native Testing Library 12.9
**Target Platform**: iOS / Android (Expo managed workflow)
**Project Type**: Mobile app (single codebase, two runtime shells)
**Performance Goals**: 200-900ms simulated latency; data operations complete locally within 2 seconds
**Constraints**: Frontend-only MVP; no real backend; single-device, single-user at a time; must be swappable with real API
**Scale/Scope**: 6 seed kitchens, 4-8 dishes each, 3-5 reviews each, 6 chef accounts, 3 customer accounts, 2-3 sample orders

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                                    | Status | Notes                                                                                                                                                                                                                                       |
| -------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I. Frontend-Only, Backend-Ready              | PASS   | Mock server exposes typed API contract (request/response types, error codes). UI consumes only through React Query hooks — never direct AsyncStorage reads. Swapping mock for real backend requires only changing the API adapter.          |
| II. Single Source of Truth                   | PASS   | React Query owns all server-state (kitchens, orders, dishes, reviews). Zustand owns only client-state (cart, session, settings). Mock DB is the canonical store; React Query invalidation propagates changes. No duplicated data ownership. |
| III. Role Separation Without App Duplication | PASS   | Shared hooks and mock server serve both shells. Role-specific data (chef orders vs customer orders) filtered by query parameters, not by separate code paths.                                                                               |
| IV. RTL/LTR Correctness Is Not Optional      | PASS   | This phase is data-layer only; no UI surfaces. Seed data includes Arabic strings. Hooks/components consuming data will handle direction in Phase 5+.                                                                                        |
| V. Design Tokens, Not Hardcoded Styles       | PASS   | No UI in this phase. No style concerns.                                                                                                                                                                                                     |
| VI. Predictable Navigation with Route Guards | PASS   | No navigation changes in this phase. Auth state (session store) is consumed by existing route guards.                                                                                                                                       |

_Post-Phase 1 re-check_: All gates still pass. Data model and contracts maintain the API boundary required by Principle I. Zustand stores clearly own only client state per Principle II.

## Project Structure

### Documentation (this feature)

```text
specs/003-state-mock-api/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── auth.md
│   ├── kitchens.md
│   ├── orders.md
│   ├── menu.md
│   ├── favorites.md
│   ├── chef-orders.md
│   ├── chef-menu.md
│   ├── chef-schedule.md
│   └── chef-stats.md
├── checklists/
│   └── requirements.md
└── spec.md
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── mock-server.ts        # API contract functions (existing, expand)
│   ├── mock-db.ts            # NEW: Persistent in-memory mock DB
│   ├── seeds/
│   │   ├── users.ts          # Existing, keep
│   │   ├── kitchens.ts       # NEW
│   │   ├── dishes.ts         # NEW
│   │   ├── reviews.ts        # NEW
│   │   ├── schedules.ts      # NEW
│   │   └── orders.ts         # NEW
│   └── types.ts               # NEW: API request/response types
├── components/               # No changes this phase
├── design/                   # No changes this phase
├── hooks/
│   ├── use-auth.ts           # Existing, expand
│   ├── use-kitchens.ts       # NEW (includes useKitchenDetail and useSearchKitchens)
│   ├── use-orders.ts         # NEW
│   ├── use-favorites.ts      # NEW
│   ├── use-chef-orders.ts    # NEW
│   ├── use-chef-menu.ts      # NEW
│   ├── use-chef-schedule.ts  # NEW
│   └── use-chef-stats.ts     # NEW
├── i18n/                     # No changes this phase
├── lib/
│   ├── query-client.tsx      # Existing, may adjust defaults
│   ├── storage.ts            # Existing, use as-is
│   └── payment.ts            # NEW: Payment simulation logic
├── stores/
│   ├── session-store.ts      # Existing, keep
│   ├── cart-store.ts         # NEW
│   └── settings-store.ts     # Existing, keep
└── types/
    ├── navigation.ts         # Existing, keep
    ├── user.ts               # Existing, expand
    ├── order.ts              # NEW
    ├── kitchen.ts            # NEW
    ├── dish.ts               # NEW
    └── index.ts              # NEW: Re-exports

__tests__/
├── smoke.test.ts             # Existing
├── cart-store.test.ts        # NEW
├── order-pipeline.test.ts    # NEW
└── persistence.test.ts       # NEW
```

**Structure Decision**: Single React Native project. All new files follow the existing `src/` convention. API layer (`src/api/`) owns the mock server and DB. Hooks (`src/hooks/`) own React Query wrappers. Stores (`src/stores/`) own client state. Types (`src/types/`) define shared interfaces.

## Complexity Tracking

> No constitution violations. No entries needed.
