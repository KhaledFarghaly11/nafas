# Research: State Architecture + Mock API

**Feature**: 003-state-mock-api | **Date**: 2026-04-15

## R1: Mock DB Persistence Pattern

**Decision**: Single in-memory JavaScript object persisted to AsyncStorage as a JSON blob, with a `load()` / `save()` lifecycle.

**Rationale**: The mock DB needs to survive app restarts. AsyncStorage is the only persistence mechanism available in Expo managed workflow. Loading the entire DB into memory at startup is acceptable for the MVP scale (~6 kitchens, ~40 dishes, ~30 reviews, ~3 orders — well under 1MB serialized). Writes are infrequent relative to reads, so serializing the full state on each write is acceptable.

**Alternatives considered**:

- SQLite via expo-sqlite: Overkill for the data volume; adds native dependency and complexity; harder to reset/debug.
- Individual AsyncStorage keys per entity: Would require managing many keys and partial reads; harder to ensure cross-entity consistency; harder to implement reset-to-seeds.
- MMKV: Faster but adds native dependency; premature optimization for MVP data volume.

## R2: Zustand Cart Store Design

**Decision**: Persisted Zustand store with kitchen-grouped items. Each cart item references a dish ID and kitchen ID. Quantities are mutable. Schedule preference (ASAP/Today/Tomorrow) and delivery instructions are stored at the cart level.

**Rationale**: Cart is client-side state (not in the mock DB) because it's a transient working object — it only becomes server-state when the order is placed. Grouping by kitchen in the store structure (rather than deriving groups at render time) keeps cart operations (add item, change quantity, remove) simple and avoids re-computation.

**Alternatives considered**:

- Storing cart in React Query (as mock server state): Violates Principle II — cart is client state, not server state.
- Storing cart as individual AsyncStorage entries: Loses transactional integrity; harder to clear on logout.
- Flat list of items with kitchen derived from dish: Requires looking up kitchen from dish on every render; less efficient for grouped display.

## R3: React Query Invalidation Strategy for Cross-Role Consistency

**Decision**: After any mutation (place order, update menu, change status), invalidate all related query keys. Use query key structure: `['kitchens']`, `['kitchen', id]`, `['orders']`, `['order', id]`, `['chef-orders', chefId]`, `['chef-menu', chefId]`, `['favorites', userId]`, `['chef-schedule', chefId]`, `['chef-stats', chefId]`.

**Rationale**: Since both roles read from the same in-memory mock DB, a write by one role is immediately visible to the other — but only if React Query's cache is invalidated. Precise invalidation (e.g., invalidate only `['orders']` when an order is created) keeps re-fetches minimal while ensuring freshness.

**Alternatives considered**:

- `queryClient.invalidateQueries()` (invalidate everything): Simple but causes unnecessary re-renders across all screens.
- Polling/refetchInterval: Wasteful for a local data source; adds complexity.
- Event-based (emitter pattern): Over-engineered for MVP; the invalidation approach achieves the same result with simpler code.

## R4: Simulated Latency Implementation

**Decision**: Wrap every mock server function in a `withLatency()` helper that adds a random delay (200-900ms) before resolving. The delay is applied inside the mock server layer, not in the hooks.

**Rationale**: Simulating latency at the server layer means hooks and UI components experience realistic timing without any special code. This mirrors how a real API client would behave. The delay range (200-900ms) is taken from the constitution.

**Alternatives considered**:

- Delay in hooks: Would need to add delay logic to every hook; inconsistent if forgotten.
- MSW-style network interception: No real network layer to intercept; over-engineered.
- No delay: Would not prepare UI for real-world conditions; skeleton/loading states would never be tested.

## R5: Error Injection Design

**Decision**: A `shouldInjectError()` function that returns `true` randomly (configurable probability, default 0%) when enabled via a dev setting. When triggered, the mock server returns a structured error response instead of the normal response. Enabled/disabled via `settingsStore` or a dedicated dev flag persisted in AsyncStorage.

**Rationale**: Error injection must be opt-in (constitution: default OFF) and toggleable at runtime. Using a simple probability check in the mock server layer keeps the implementation minimal. The dev setting approach avoids polluting the main settings store visible to users.

**Alternatives considered**:

- External configuration file: Cannot be toggled at runtime without app restart.
- Hard-coded random errors: Not toggleable; too unpredictable for testing.
- Separate debug screen: More discoverable but adds UI scope; dev setting is sufficient for MVP.

## R6: Seed Data Identity and Auto-Increment

**Decision**: Seed data uses fixed numeric IDs (e.g., `kitchen-1`, `dish-1`, `order-1`). Runtime-created records use auto-incrementing integers managed by the mock DB (track highest ID per entity type and increment on creation).

**Rationale**: Fixed seed IDs make test assertions deterministic (e.g., "login with 0100000001 always returns chef"). Auto-increment for runtime records is simple, predictable, and sufficient for a single-device app. Using a prefix pattern (`kitchen-1`) is more readable than bare integers and avoids ID collisions across entity types.

**Alternatives considered**:

- UUIDs for everything: Less readable in debug logs; harder to write deterministic tests.
- All fixed IDs: Impossible for runtime-created records (orders, new dishes).
- Composite keys (e.g., `kitchenId-dishId`): Unnecessary complexity for a local mock.

## R7: Order Status Pipeline Enforcement

**Decision**: The mock server validates status transitions against the allowed pipeline: `pending → confirmed → preparing → cooking → ready → on_the_way → delivered`. `cancelled` is allowed from any pre-`delivered` status. Invalid transitions return an error.

**Rationale**: The order status pipeline is a core business rule. Enforcing it at the server layer (even mock) ensures the UI never enters an invalid state and mirrors how a real backend would validate. This also means tests can verify the pipeline is respected.

**Alternatives considered**:

- Client-side enforcement only: Could be bypassed; doesn't match real backend behavior.
- No enforcement: Would allow impossible states (e.g., `delivered → preparing`); breaks timeline display.
- State machine library: Over-engineered for 6 states and simple linear progression.
