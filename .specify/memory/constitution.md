<!--
  Sync Impact Report
  ==================
  Version change: N/A (initial) → 1.0.0
  Modified principles: N/A (initial creation)
  Added sections:
    - Core Principles (6 principles)
    - Technical Constraints
    - Quality Gates & Non-Functional Requirements
    - Governance
  Removed sections: None
  Templates requiring updates:
    - .specify/templates/plan-template.md: ⚠ pending (Constitution Check
      section needs Nafas-specific gates added once plan is first used)
    - .specify/templates/spec-template.md: ✅ compatible (no changes needed)
    - .specify/templates/tasks-template.md: ✅ compatible (no changes needed)
    - .specify/templates/checklist-template.md: ✅ compatible
    - .specify/templates/agent-file-template.md: ✅ compatible
  Follow-up TODOs: None
-->

# Nafas Constitution

## Core Principles

### I. Frontend-Only, Backend-Ready

Every feature MUST be built against a well-defined API boundary, even
when the backend is a local mock module. The mock API MUST expose the
same contract shape (request/response types, error codes, pagination)
that a real production server would. Replacing the mock with a real
backend MUST require zero changes to UI or state-management code—only
a swap of the API client adapter.

**Rationale**: The MVP ships without a real backend; rework at
integration time is unacceptable if boundaries are sloppy from day
one.

### II. Single Source of Truth

State ownership MUST be unambiguous:

- **React Query** (TanStack Query) owns all server-state data
  (kitchens, orders, menu items, reviews). Even when the source is a
  mock API, data flows through query hooks—never through direct
  AsyncStorage reads in components.
- **Zustand** owns all client-state data (cart, session/locale,
  settings, theme). Zustand stores MUST NOT duplicate data that
  originates from the mock API.

Cross-role consistency (customer places order → chef sees it) is
maintained by the mock DB as the single canonical store; React Query
invalidation propagates changes to both shells.

**Rationale**: Dual ownership of the same datum causes stale UI,
subtle bugs, and makes the eventual backend swap harder to reason
about.

### III. Role Separation Without App Duplication

One codebase, two runtime shells. Shared components, hooks, and
utilities live in a common layer; role-specific screens and navigation
graphs are mounted by the active shell. Theme is forced by role
(Customer = light, Chef = dark) and MUST NOT be user-toggleable within
a session.

**Rationale**: Duplication across two apps would double maintenance;
shared code with role branching is cheaper and enforces consistency.

### IV. RTL/LTR Correctness Is Not Optional

Every screen and component MUST be verified in both Arabic (RTL) and
English (LTR) layouts. Bi-directional support MUST use the i18n
direction flag (not CSS hacks or manual reverse). If an
app-restart is required for a direction change, the UI MUST clearly
communicate this to the user before applying the change.

**Rationale**: Nafas targets Egyptian customers who may use either
language; broken RTL is a shipping blocker, not a nice-to-have.

### V. Design Tokens, Not Hardcoded Styles

All colors, spacing values, typography scales, border radii, and
elevation levels MUST come from centralized design tokens sourced from
`design.md`. Hardcoded hex values, magic numbers, or inline styles
that bypass the token system are prohibited. Components MUST consume
tokens through the theme system, making light/dark and RTL/LTR
switching automatic.

**Rationale**: Consistency across 50+ screens is impossible without
a single token source; theming and future design iteration depend on
it.

### VI. Predictable Navigation with Route Guards

Navigation MUST enforce role-based access. A customer session MUST NOT
reach chef routes and vice versa. Route guards MUST redirect
unauthorized access to the appropriate shell's home screen. Deep-link
routes (`nafas://payment-return`, etc.) MUST be validated against the
current session before navigation proceeds.

**Rationale**: A single-app architecture means navigation protection
is the boundary between roles; missing guards expose internal screens.

## Technical Constraints

### Platform & Tooling

- **Framework**: Expo (managed workflow)
- **Language**: TypeScript (strict mode recommended)
- **Navigation**: Expo Router (primary) or React Navigation (locked
  once chosen)
- **Data fetching**: TanStack React Query
- **Client state**: Zustand
- **Persistence**: AsyncStorage (mock DB + cart/settings)
- **i18n**: i18next + react-i18next
- **Payments**: react-native-webview + deep linking (`nafas://`)

> Tooling decisions are locked once implementation starts to avoid
> rework.

### Deep Linking

- Scheme: `nafas://`
- Payment return paths:
  - `nafas://payment-return?status=success&orderId=XYZ`
  - `nafas://payment-return?status=failed&orderId=XYZ`

### Mock API Requirements

- Simulated latency: 200–900 ms per call.
- Random failure injection: default OFF; toggleable via dev settings.
- Persisted mock DB in AsyncStorage so actions survive app restarts.
- Cross-role consistency on the same device: customer order → chef
  incoming; chef status update → customer timeline.

### Theming

- Customer shell: forced light theme.
- Chef shell: forced dark theme.
- All tokens sourced from `design.md`.
- Component library MUST be theme-aware.

### i18n + Direction

- Language toggle persisted in AsyncStorage.
- Arabic applies RTL; English applies LTR.
- Restart requirement (if any) MUST be communicated clearly.

### Order Model Rules

- Cart supports multiple kitchens; checkout produces one combined order
  containing grouped kitchen sub-orders.
- Scheduling: `ASAP | Today | Tomorrow` only (no time slots in MVP).
- Payment methods:
  - Cash on delivery (default, with optional "Pay with X EGP" input).
  - Vodafone Cash (redirect/deep-link return).
  - InstaPay (redirect/deep-link return).

### Order Status Pipeline

`confirmed → preparing → cooking → ready → on_the_way → delivered`
and `cancelled` as terminal.

Customer sees a timeline; chef can advance statuses post-acceptance.

### Favorites

- Follow/unfollow kitchens.
- Favorites page splits: Open Now vs Closed (dimmed).

### Chef Access in MVP

- Seeded phone numbers map to chef sessions OR
- Dev-only "switch role" toggle in Profile/Settings.

## Quality Gates & Non-Functional Requirements

### UX Quality Bars

Every screen MUST have:

- **Loading state** (prefer skeletons for lists).
- **Empty state** with a next action CTA.
- **Error state** with retry capability.

Lists MUST use FlatList with proper optimizations (keyExtractor,
getItemType where applicable, reasonable windowSize).

Accessibility basics: minimum 44 pt touch targets, sufficient color
contrast, readable typography at system font scale.

### Reliability Bars

- App MUST be demo-stable even with mock errors.
- Random error injection MUST be toggleable (dev setting, default OFF).
- Payment flow MUST have a fallback ("Try again" / "Back to order").

### Definition of Done (Per Screen)

A screen is done when:

1. Uses shared components/tokens exclusively.
2. Supports Arabic + English strings.
3. Works in both RTL and LTR.
4. Has loading + empty + error UI states.
5. Does not crash on missing or partial mock data.
6. Navigation in/out of the screen is correct.
7. All relevant state persists where expected.

## Governance

This constitution is the authoritative source for all architectural
and process decisions on the Nafas MVP. It supersedes ad-hoc
conventions and informal agreements.

### Amendment Procedure

1. Propose amendment with written rationale and impact analysis.
2. Team review and explicit approval required before merging.
3. Version MUST be bumped per semantic versioning:
   - **MAJOR**: Backward-incompatible principle removal or
     redefinition.
   - **MINOR**: New principle/section added or materially expanded
     guidance.
   - **PATCH**: Clarifications, wording, typo fixes.
4. Update all dependent templates and documentation in the same
   change set.

### Compliance Review

- Every spec and plan MUST include a Constitution Check gate before
  implementation begins.
- Code reviews MUST verify adherence to declared principles.
- Complexity that violates a principle MUST be documented in the
  plan's Complexity Tracking table with justification.

### Runtime Guidance

Use `.specify/memory/` documents for development-time reference.
When in doubt, this constitution takes precedence.

**Version**: 1.0.0 | **Ratified**: 2026-04-11 | **Last Amended**: 2026-04-11
