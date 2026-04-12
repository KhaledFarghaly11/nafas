# Research: Project Setup

**Feature**: 001-project-setup
**Date**: 2026-04-12
**Status**: Complete

## Research Tasks

### 1. Expo Router Route Groups and Layouts

**Decision**: Use parenthesized route groups `(customer)/` and `(chef)/` for role-specific tab navigation, with a non-parenthesized `auth/` group for unauthenticated screens.

**Rationale**: Expo Router v6 supports file-based routing with layout groups via parentheses. Parenthesized directories create shared layouts without affecting URL paths — perfect for two separate tab navigators (customer 5-tab, chef 5-tab) under one app. The root `_layout.tsx` acts as the auth gate, conditionally rendering the appropriate shell based on session state.

**Alternatives considered**:

- Separate `customer/` and `chef/` directories without parentheses: Would work but creates nested URL paths and doesn't clearly signal layout-group intent
- Dynamic route switching via single layout: More complex, requires conditional tab rendering in one `_layout.tsx`, violates separation of concerns
- Multiple Expo apps: Violates Constitution Principle III (Role Separation Without App Duplication)

### 2. Auth Gate Pattern with Expo Router

**Decision**: Root `_layout.tsx` reads from `sessionStore` (Zustand persisted store). If no session → redirect to `/auth/welcome`. If session exists → redirect to `/(customer)/home` or `/(chef)/dashboard` based on role. Use Expo Router's `useRouter().replace()` for initial routing to avoid back-stack pollution.

**Rationale**: Centralized auth gate in the root layout is the simplest and most reliable pattern. It runs before any shell-specific layout mounts, preventing flash of unauthorized content. Using `replace()` instead of `push()` ensures the auth screen is not in the navigation history once the user is signed in.

**Alternatives considered**:

- Per-route hooks checking auth: Error-prone, easy to miss a route, scattered logic
- Middleware-based approach: Expo Router doesn't have Next.js-style middleware; would require custom implementation
- Navigation container wrapping: Less explicit, harder to debug

### 3. Session Persistence Strategy

**Decision**: Zustand with `zustand/middleware` persist middleware using AsyncStorage as the storage backend. Session store shape: `{ userId: string | null, role: 'customer' | 'chef' | null, phone: string | null }`. On app launch, the store hydrates from AsyncStorage before the root layout renders.

**Rationale**: Zustand's persist middleware is purpose-built for this pattern. AsyncStorage is the standard async storage for React Native. Hydration happens asynchronously via AsyncStorage, so the root layout must gate routing until hydration completes — use Zustand's `hasHydrated` selector and `onFinishHydration` callback to prevent flash of unauthorized content. The implementation plan already specifies this approach (session-store.ts).

**Alternatives considered**:

- Custom AsyncStorage read in root layout: More boilerplate, no reactivity, harder to keep in sync
- React Context for session: Re-renders entire tree on session change, less performant than Zustand subscriptions
- SecureStore for session: Unnecessary for mock auth; add when real tokens exist

### 4. Mock Authentication for Phase 1

**Decision**: Welcome screen includes a phone number input. On submit, the app validates that the input is numeric-only (digits), then checks if the number matches a pre-seeded chef number (from `seeds/users.ts`). If non-numeric or empty, return an `INVALID_PHONE` error. If match → create session with role `chef`. Otherwise → create session with role `customer`. No OTP.

**Rationale**: The spec (per clarification Q1) explicitly chose phone-input-only mock auth. This keeps the welcome screen UX consistent with Phase 4's direction while avoiding duplicate work. The mock auth function lives in `src/api/mock-server.ts` behind the same API boundary that real auth will use later.

**Alternatives considered**:

- Role selector buttons: Breaks UX continuity with Phase 4; user never sees a role selector in production
- Hybrid with demo toggle: Adds complexity for minimal gain; Phase 1 exit criteria can be tested with phone numbers alone

### 5. Theme Application by Role

**Decision**: Root `_layout.tsx` wraps the app in a theme context provider. When routing to `(customer)/`, the provider sets light tokens; when routing to `(chef)/`, it sets dark tokens. Theme is derived from `sessionStore.role` — not user-toggleable (Constitution Principle III). Phase 1 uses minimal tokens (background color, text color, tab bar styling) with full token system in Phase 2.

**Rationale**: Constitution Principles III and V require theme to be role-forced and token-driven. Phase 1 establishes the mechanism (theme provider that reads role) with minimal visual tokens. Full palette, spacing, typography tokens arrive in Phase 2 when `design.md` is finalized. This avoids premature token design that might need rework.

**Alternatives considered**:

- Per-shell theme in `_layout.tsx` of each group: Duplicates theme logic, harder to enforce single-source
- CSS variable approach: Not available in React Native
- No theme in Phase 1: Violates Constitution Principle III (role shells must be visually distinct)

### 6. Developer Tooling Stack

**Decision**:

- **Lint**: ESLint with `@typescript-eslint/recommended` + `eslint-plugin-react-native` + `eslint-plugin-import` (import sorting)
- **Format**: Prettier with project config (`.prettierrc.js`)
- **Commits**: `@commitlint/cli` + `@commitlint/config-conventional` + `husky` for pre-commit hooks
- **Tests**: Jest + `@testing-library/react-native` configured via `jest.config.js` with one smoke test

**Rationale**: The implementation plan (T003–T005) specifies these exact tools. TypeScript strict mode is recommended by the constitution. Jest + RNTL is the React Native testing standard. Commitlint with conventional config enforces the project's commit conventions documented in the implementation plan.

**Alternatives considered**:

- Biome instead of ESLint+Prettier: Faster but less ecosystem support for React Native specific rules
- Vitest instead of Jest: Not well-supported with React Native / Expo
- lint-staged instead of husky: Complementary (can use both), but husky provides the git hook infrastructure

### 7. Expo Router Deep Link Configuration

**Decision**: Configure `nafas://` scheme in `app.config.ts`. Create `payment-return.tsx` as a deep link handler route. This is a placeholder for Phase 6+ payment integration but must be wired now to ensure the routing structure supports it.

**Rationale**: The constitution specifies `nafas://payment-return` as a deep link path. Wiring it during project setup ensures the routing structure is complete and the scheme is registered with the OS. No actual payment logic is implemented in Phase 1.

**Alternatives considered**:

- Skip deep link setup entirely in Phase 1: Risks needing routing restructure later
- Use universal links instead of custom scheme: More complex setup; custom scheme is sufficient for MVP
