# Implementation Plan: Project Setup

**Branch**: `001-project-setup` | **Date**: 2026-04-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-project-setup/spec.md`

## Summary

Establish a bootable Expo (managed) mobile app with file-based routing, role-based navigation shells (Customer light / Chef dark), auth gate with mock phone-entry authentication, session persistence, route guards, and developer tooling (lint, format, commitlint, test scaffold). This is the foundational phase upon which all subsequent features build.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Expo SDK 54 (managed), Expo Router v6, TanStack React Query v5, Zustand v5
**Storage**: AsyncStorage (session persistence, mock DB in later phases)
**Testing**: Jest + ts-jest (jest-expo deferred to later phase due to React 19 compatibility)
**Target Platform**: iOS 15+ and Android 12+ (Expo managed workflow)
**Project Type**: mobile-app (frontend-only with mock API boundary)
**Performance Goals**: App launch to interactive ≤ 3s; route transition ≤ 2s
**Constraints**: No real backend; mock API boundary must be clean for future swap; RTL/LTR support from day one
**Scale/Scope**: 2 role shells (4 customer tabs + 5 chef tabs), 1 auth gate, ~10 placeholder screens

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                                    | Status     | Notes                                                                                                             |
| -------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------- |
| I. Frontend-Only, Backend-Ready              | ✅ PASS    | Mock API boundary established via `src/api/` layer; auth uses mock phone lookup only                              |
| II. Single Source of Truth                   | ✅ PASS    | Zustand owns session/client state; no server-state data in Phase 1 yet                                            |
| III. Role Separation Without App Duplication | ✅ PASS    | Single codebase with `(customer)/` and `(chef)/` route groups sharing common layer                                |
| IV. RTL/LTR Correctness Is Not Optional      | ✅ PASS    | i18n setup deferred to Phase 2, but route structure is direction-agnostic                                         |
| V. Design Tokens, Not Hardcoded Styles       | ⚠️ PARTIAL | No tokens yet in Phase 1; basic theme distinction (light/dark) via Expo Router theming — tokens arrive in Phase 2 |
| VI. Predictable Navigation with Route Guards | ✅ PASS    | Auth gate in root `_layout.tsx` enforces role-based routing; unauthorized access redirects                        |

**Post-Phase 1 Re-check**: Principle V partial gap addressed — Phase 1 uses minimal theme tokens (background + text color only) to distinguish shells, with full token system deferred to Phase 2 per the implementation plan.

## Project Structure

### Documentation (this feature)

```text
specs/001-project-setup/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
nafas/
├── app/                          # Expo Router file-based routing
│   ├── _layout.tsx               # Root layout: auth gate + theme provider
│   ├── auth/                     # Auth shell (no tabs)
│   │   ├── welcome.tsx           # Welcome + phone input
│   │   ├── phone.tsx             # Phone number entry (placeholder for Phase 4)
│   │   ├── otp.tsx               # OTP verification (placeholder for Phase 4)
│   │   └── profile-setup.tsx    # Profile setup (placeholder for Phase 4)
│   ├── (customer)/               # Customer shell (tab layout)
│   │   ├── _layout.tsx           # Tab navigator + light theme
│   │   ├── home/
│   │   │   └── index.tsx
│   │   ├── favorites/
│   │   │   └── index.tsx
│   │   ├── cart/
│   │   │   └── index.tsx
│   │   ├── checkout/
│   │   │   └── index.tsx
│   │   ├── orders/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   └── profile/
│   │       └── index.tsx
│   ├── (chef)/                  # Chef shell (tab layout)
│   │   ├── _layout.tsx           # Tab navigator + dark theme
│   │   ├── dashboard/
│   │   │   └── index.tsx
│   │   ├── orders/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   ├── menu/
│   │   │   ├── index.tsx
│   │   │   └── edit/[dishId].tsx
│   │   ├── schedule/
│   │   │   └── index.tsx
│   │   └── stats/
│   │       └── index.tsx
│   └── payment-return.tsx        # Deep link handler
├── src/
│   ├── api/                      # Mock API layer
│   │   ├── mock-server.ts
│   │   ├── mock-db.ts
│   │   ├── seeds/
│   │   └── types.ts
│   ├── components/
│   │   ├── primitives/
│   │   ├── feedback/
│   │   ├── layout/
│   │   └── domain/
│   ├── design/
│   │   ├── tokens.ts
│   │   ├── theme.ts
│   │   └── typography.ts
│   ├── hooks/
│   │   └── use-auth.ts
│   ├── stores/
│   │   ├── session-store.ts
│   │   └── settings-store.ts
│   ├── i18n/
│   │   ├── index.ts
│   │   ├── ar/common.json
│   │   └── en/common.json
│   ├── lib/
│   │   ├── query-client.ts
│   │   └── storage.ts
│   └── types/
│       ├── user.ts
│       └── navigation.ts
├── __tests__/
│   └── smoke.test.ts
├── .github/
│   ├── pull_request_template.md
│   └── commitlintrc.yml (or commitlint.config.js)
├── app.config.ts
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc.js
├── package.json
└── jest.config.js
```

**Structure Decision**: Single Expo project with file-based routing via Expo Router. The `(customer)/` and `(chef)/` route groups use parentheses to create layout groups without affecting the URL path. This follows the Expo Router convention for shared layouts with different navigation structures. The `auth/` group (no parentheses) represents unauthenticated screens. Shared code lives in `src/` with clear separation: `api/` (mock boundary), `components/` (UI), `stores/` (client state), `hooks/` (data fetching), `design/` (tokens/theme).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                                  | Why Needed                                                                                                            | Simpler Alternative Rejected Because                                                                     |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Principle V partial (no full token system) | Tokens deferred to Phase 2 per implementation plan; Phase 1 needs minimal theme distinction to validate shell routing | Full token system in Phase 1 would require design.md finalization before routing foundation is validated |
