# Feature Specification: State Architecture + Mock API

**Feature Branch**: `feature/003-state-mock-api`  
**Created**: 2026-04-15  
**Status**: Draft  
**Input**: User description: "Phase 3: State Architecture + Mock API — Zustand stores, mock DB with persistence, React Query hooks — cross-role consistency working."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Customer places an order that the chef receives (Priority: P1)

A customer browses kitchens, adds dishes to their cart, and places an order. The chef sees the incoming order in their order list immediately, with all item details, delivery address, and payment information correctly reflected.

**Why this priority**: This is the core value loop of the entire product — without the ability for a customer's order to reach the chef, no other feature matters. It validates the full data pipeline from customer action to chef visibility.

**Independent Test**: Can be fully tested by having a customer place an order and verifying the chef sees it appear in their order list with correct details. Delivers the core transactional value of the app.

**Acceptance Scenarios**:

1. **Given** a customer has added items to their cart, **When** they complete checkout, **Then** the order appears in the chef's incoming orders list within 2 seconds
2. **Given** a customer places an order with items from a specific kitchen, **When** the chef views the order, **Then** all dish names, quantities, prices, special instructions, and the delivery address are accurately displayed
3. **Given** a customer places an order, **When** the order is created, **Then** the customer can see the order in their active orders list with "pending" status

---

### User Story 2 - Chef updates order status and customer sees it reflected (Priority: P2)

A chef accepts an incoming order and then advances it through preparation stages (pending → confirmed → preparing → cooking → ready → on_the_way → delivered). At each step, the customer sees the updated status in their order timeline without needing to refresh.

**Why this priority**: This closes the feedback loop between chef and customer. Without status visibility, customers have no confidence their order is being handled.

**Independent Test**: Can be tested by having a chef advance an order through status steps and verifying the customer's order detail reflects each change.

**Acceptance Scenarios**:

1. **Given** a chef has a pending order, **When** they accept it, **Then** the customer sees the status change to "confirmed" within 2 seconds
2. **Given** a chef advances an order from "confirmed" to "preparing", **When** the customer views their order detail, **Then** the timeline reflects the new status
3. **Given** a chef rejects a pending order, **When** the customer views their orders, **Then** the order shows as "cancelled"

---

### User Story 3 - App data persists across restarts (Priority: P2)

A user (customer or chef) closes the app completely and reopens it. Their session is restored automatically — they do not need to log in again. Any previously created orders, menu changes, or cart contents are still present.

**Why this priority**: Persistence is fundamental to trust. If data disappears on restart, the app feels broken and unreliable. Session restoration is also critical for a smooth daily experience.

**Independent Test**: Can be tested by performing any data action (place order, add to cart, update menu), force-closing the app, reopening it, and verifying all data is intact.

**Acceptance Scenarios**:

1. **Given** a user is logged in, **When** they close and reopen the app, **Then** they are taken directly to their role's home screen without re-authentication
2. **Given** a customer has items in their cart, **When** they close and reopen the app, **Then** the cart retains all items, quantities, and kitchen groupings
3. **Given** a chef has updated their menu, **When** they close and reopen the app, **Then** the menu changes are still reflected
4. **Given** a customer has placed an order, **When** they close and reopen the app, **Then** the order appears in their order list with the correct status

---

### User Story 4 - Customer manages a cart across multiple kitchens (Priority: P3)

A customer adds dishes from different kitchens to their cart. Each kitchen's items are grouped separately. The customer can adjust quantities, add delivery instructions, and see a clear breakdown of costs including the flat delivery fee per order.

**Why this priority**: Multi-kitchen cart management is a key differentiator from single-restaurant apps. It enables the core browsing experience — discover food from multiple homemakers in one session.

**Independent Test**: Can be tested by adding items from 2+ kitchens and verifying grouping, quantity adjustment, instruction persistence, and cost calculations.

**Acceptance Scenarios**:

1. **Given** a customer adds a dish from Kitchen A and a dish from Kitchen B, **When** they view their cart, **Then** items are grouped by kitchen with correct kitchen names
2. **Given** a customer has items in their cart, **When** they increase or decrease a quantity, **Then** the subtotal and total update immediately
3. **Given** a customer has items in their cart, **When** they add delivery instructions, **Then** the instructions are persisted and shown at checkout
4. **Given** a customer has items in their cart, **When** they view the total, **Then** it shows subtotal + flat delivery fee + grand total

---

### User Story 5 - Chef manages menu items (add, edit, delete, toggle availability) (Priority: P3)

A chef can add new dishes to their menu, edit existing dish details (name, description, price, category, prep time, portions), toggle a dish's availability on or off, and delete dishes. All changes are immediately reflected when customers view the kitchen's menu.

**Why this priority**: Menu management is how chefs control what customers can order. Without it, the menu is static and the app cannot be used in a real daily workflow.

**Independent Test**: Can be tested by having a chef add a new dish, toggle its availability, edit its price, and verify a customer browsing that kitchen sees each change reflected.

**Acceptance Scenarios**:

1. **Given** a chef is on their menu management screen, **When** they add a new dish with all required details, **Then** the dish appears in their menu list and is visible to customers browsing that kitchen
2. **Given** a chef has a dish in their menu, **When** they toggle its availability off, **Then** customers can no longer see or add that dish to their cart
3. **Given** a chef edits a dish's price, **When** a customer views the menu, **Then** the updated price is displayed
4. **Given** a chef deletes a dish, **When** a customer views the menu, **Then** the dish is no longer listed

---

### User Story 6 - Chef views their schedule and analytics (Priority: P4)

A chef can view and update their weekly schedule (open/closed per day, hours, available dishes per day). They can also see basic analytics: weekly income, order count, repeat customer percentage, and their top-selling dish.

**Why this priority**: Schedule and analytics empower chefs to run their kitchen as a business. Schedule affects what customers see (open/closed), and analytics help chefs make decisions.

**Independent Test**: Can be tested by having a chef update their schedule and verify customers see updated hours, and by viewing analytics that reflect actual order data.

**Acceptance Scenarios**:

1. **Given** a chef updates their schedule for a day, **When** a customer views that kitchen, **Then** the updated hours are reflected
2. **Given** a chef has received orders over the past week, **When** they view their analytics, **Then** income, order count, repeat customer percentage, and top dish are displayed accurately

---

### Edge Cases

- What happens when two customers place orders simultaneously on the same kitchen? The system must handle concurrent writes without data loss.
- What happens when a customer adds an item to their cart, but the chef marks it unavailable before checkout? The cart should still show the item but the checkout should indicate unavailability.
- What happens when a customer tries to reorder and some items are no longer available? Unavailable items are skipped with a notification; available items are added to the cart.
- What happens when the app encounters an error during data operations? The user sees a friendly error message with a retry option, and no data is lost.
- What happens when simulated latency causes a slow response? The user sees a loading indicator while the simulated latency (200-900ms) completes.
- What happens when a chef's schedule says they are closed on a particular day? Customers see the kitchen as "closed" and cannot place orders for that day.
- What happens when the mock data store is corrupted or empty on app launch? The system re-initializes from seed data automatically.
- What happens when one chef in a multi-kitchen order cancels their sub-order? The overall order status remains tied to the remaining sub-orders; the cancelled sub-order is shown as cancelled within the order detail.
- What happens when a user logs out and a different user logs in? All orders and menu changes from the previous session remain in the mock DB; only the session and cart are cleared.

## Clarifications

### Session 2026-04-15

- Q: When a customer's cart contains items from multiple kitchens and they place an order, how should the order be structured? → A: One combined order with kitchen-grouped sub-orders (single payment, single delivery, one flat delivery fee)
- Q: When a multi-kitchen order is placed and chefs update their sub-order statuses independently, what status does the customer see for the overall order? → A: Overall status = lowest (least advanced) sub-order status
- Q: When a user logs out or switches accounts, what happens to the existing persisted mock data (orders, menu changes, etc.)? → A: Keep all persisted data — only clear the session and current user's cart on logout
- Q: When the mock DB is first initialized on a fresh install, should it auto-generate unique IDs or use fixed/hardcoded IDs from the seed data? → A: Seed data uses fixed IDs; new runtime records (orders, dishes) use auto-incrementing integers
- Q: Should the mock data layer support a "reset to seed data" action that the user can trigger, or is reset only possible by reinstalling? → A: Support a reset-to-seeds action accessible from a developer/settings screen

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST maintain user session information (user ID, role, phone number) persistently so users remain logged in across app restarts
- **FR-002**: System MUST store cart state (items grouped by kitchen, quantities, schedule preference, delivery instructions, delivery fee) persistently so the cart survives app restarts
- **FR-003**: System MUST store user preferences (language setting) persistently across app restarts
- **FR-004**: System MUST provide a local data layer that simulates a backend, initialized with realistic seed data, and supports full read/write operations
- **FR-005**: System MUST seed at least 6 kitchens across real Cairo neighborhoods (Maadi, Zamalek, Heliopolis, Nasr City, Dokki, Mohandessin, New Cairo, 6th October)
- **FR-006**: System MUST seed 4–8 dishes per kitchen with categories, prices, preparation times, and stock levels
- **FR-007**: System MUST seed 3–5 reviews per kitchen with text and rating
- **FR-008**: System MUST seed pre-registered chef accounts with known phone numbers that route to the chef experience upon login
- **FR-009**: System MUST seed weekly schedules per kitchen and 2–3 sample orders in various statuses
- **FR-010**: System MUST provide authentication operations: login with phone and OTP, and signup with name, area, and phone
- **FR-011**: System MUST provide kitchen browsing operations: list kitchens with filters, get kitchen detail, and search by kitchen or dish name
- **FR-012**: System MUST provide menu and review operations: list dishes for a kitchen, and list reviews for a kitchen
- **FR-013**: System MUST provide favorites operations: list user's followed kitchens, follow a kitchen, and unfollow a kitchen
- **FR-014**: System MUST provide order operations: create a single combined order with kitchen-grouped sub-orders (one payment, one delivery address, one flat delivery fee), list user's orders, get order detail, and reorder from a past order
- **FR-015**: System MUST provide chef order operations: list chef's orders, update order status, accept an order, and reject an order
- **FR-016**: System MUST provide chef menu operations: list chef's dishes, create a dish, update a dish, delete a dish, and toggle dish availability
- **FR-017**: System MUST provide chef schedule operations: get chef's weekly schedule and update it
- **FR-018**: System MUST provide chef analytics: weekly income, order count, repeat customer percentage, and top-selling dish
- **FR-019**: System MUST simulate realistic network latency (200–900ms) on all data operations to prepare the UI for real-world conditions
- **FR-020**: System MUST support toggleable random error injection for testing error handling (disabled by default)
- **FR-021**: System MUST persist all data changes locally so they survive app restarts and re-initialize from seeds only on first launch
- **FR-022**: System MUST provide data access hooks that handle loading, error, and success states for every operation
- **FR-023**: System MUST ensure data consistency across roles — a chef's menu change is visible to customers, and a customer's order is visible to the chef
- **FR-024**: System MUST handle the order status pipeline: pending → confirmed → preparing → cooking → ready → on_the_way → delivered, plus cancellation from any status through ready (not from on_the_way or delivered). For multi-kitchen orders, each sub-order has an independent status; the overall order status MUST reflect the least advanced sub-order status
- **FR-025**: System MUST support reordering by adding available items from a past order to the cart and skipping unavailable items with a notification
- **FR-026**: System MUST preserve all persisted mock data (orders, menu changes, favorites, reviews, schedules) when a user logs out or switches accounts; only the active session and the current user's cart MUST be cleared
- **FR-027**: System MUST use fixed, deterministic IDs for all seed data and auto-incrementing integer IDs for any new records created at runtime
- **FR-028**: System MUST provide a reset-to-seeds action accessible from a developer/settings screen that clears all runtime data and re-initializes the mock DB from seed data

### Key Entities

_Identity rule: Seed data uses fixed IDs; runtime-created records use auto-incrementing integers._

- **User**: Represents a customer or chef. Key attributes: ID, name, phone number, role, area (customers only). Chefs are pre-registered; customers sign up.
- **Kitchen**: Represents a homemaker's kitchen. Key attributes: ID, chef reference, name, bio, cuisine tags, area, rating, verification status, cover image. Related to: Dishes, Reviews, Schedule.
- **Dish**: Represents a menu item. Key attributes: ID, kitchen reference, name, description, price, category, preparation time, max portions, availability status, image. Related to: Kitchen.
- **Review**: Represents customer feedback. Key attributes: ID, kitchen reference, user reference, rating, text, date. Related to: Kitchen, User.
- **Schedule**: Represents a kitchen's weekly availability. Key attributes: kitchen reference, per-day open/closed status, open/close times. Related to: Kitchen.
- **Order**: Represents a customer's combined order containing kitchen-grouped sub-orders. Key attributes: ID, customer reference, line items grouped by kitchen (each sub-order has its own independent status trackable by the chef), overall status (derived as the least advanced sub-order status), delivery address, payment method and status, flat delivery fee (one per order), special instructions, schedule preference, timestamps. Each chef sees only their kitchen's sub-order. Related to: User, Kitchen, Dish.
- **Cart**: Represents a customer's in-progress order. Key attributes: kitchen-grouped items with quantities, schedule preference (ASAP/Today/Tomorrow), delivery instructions, flat delivery fee. Cleared on logout along with the session. Related to: Kitchen, Dish.
- **Session**: Represents the current user's authentication state. Key attributes: user ID, role, phone. Persisted locally. Cleared on logout; all other persisted data (orders, menus, etc.) is retained.
- **Settings**: Represents user preferences. Key attributes: language preference. Persisted locally.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A customer can place an order and the corresponding chef sees it in their order list within 2 seconds
- **SC-002**: A chef can advance an order status and the customer sees the updated timeline within 2 seconds
- **SC-003**: A user can close and reopen the app and their session is restored without re-authentication in under 3 seconds
- **SC-004**: Cart contents (items, quantities, instructions) persist correctly across app restarts with zero data loss
- **SC-005**: All seed data (kitchens, dishes, reviews, schedules, orders, users) loads correctly on first launch
- **SC-006**: A chef's menu change (add, edit, delete, toggle availability) is reflected in the customer's view within 2 seconds
- **SC-007**: Simulated latency stays within the 200–900ms range for all data operations
- **SC-008**: Error injection can be toggled on/off, and when enabled, errors are surfaced to the user with a retry option
- **SC-009**: Reordering skips unavailable items and notifies the user, while available items are added to the cart within 2 seconds
- **SC-010**: All data operations provide clear loading, error, and success states — the user is never left wondering what happened
- **SC-011**: A user can trigger a reset-to-seeds action from the settings screen and the app returns to its initial seed state within 3 seconds

## Assumptions

- The app is frontend-only; the "backend" is a local data layer that simulates server behavior within the app itself
- OTP is always `123456` for any phone number — no real SMS integration needed
- Chef accounts are pre-seeded with known phone numbers; there is no chef self-registration flow
- A flat delivery fee of 25 EGP applies per order (not per kitchen sub-order)
- Cart supports items from multiple kitchens grouped as a single order
- Seed data is only loaded on first launch; subsequent launches use the persisted modified data
- The data layer API is structured to be swappable with a real backend in the future without changing the UI layer
- Only one user can be logged in at a time on a single device
- Concurrent writes from the same device are sequential (single-user device assumption)
- Order status pipeline follows the defined sequence: pending → confirmed → preparing → cooking → ready → on_the_way → delivered, with cancellation possible from any status through ready
- Search scope is limited to kitchen names and dish names
- Analytics data is derived from existing orders rather than being independently seeded
- Reviews are read-only for the MVP (display only, no creation by customers)
- When error injection is enabled, each API call has approximately a 15% chance of returning an injected error with code 'INJECTED_ERROR'
