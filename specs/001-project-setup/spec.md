# Feature Specification: Project Setup

**Feature Branch**: `001-project-setup`  
**Created**: 2026-04-12  
**Status**: Draft  
**Input**: User description: "Read phase 1 from docs/implementation-plan.md - Project Setup: Bootable Expo app with routing, guards, and Git conventions"

## Clarifications

### Session 2026-04-12

- Q: How should mock authentication work in Phase 1? → A: Phone input only — enter phone number, pre-seeded chef numbers route to chef shell, others to customer

## User Scenarios & Testing _(mandatory)_

### User Story 1 - First Launch Experience (Priority: P1)

A new user opens the Nafas app for the first time. With no existing session, the app presents a welcome screen that introduces the app and includes a phone number input field. The user enters their phone number to proceed. If the number matches a pre-seeded chef account, they are routed to the chef shell; otherwise, they enter the customer shell. No OTP verification is required in Phase 1 — phone entry alone constitutes mock authentication.

**Why this priority**: Without a working entry point, no other feature can be experienced. This is the foundation of the entire user journey.

**Independent Test**: Can be fully tested by launching the app with no saved session, entering a phone number on the welcome screen, and verifying the user is routed to the correct shell based on the number entered.

**Acceptance Scenarios**:

1. **Given** the app is launched for the first time with no saved session, **When** the app loads, **Then** the user lands on a welcome screen with app branding and a phone number input (not a blank or error state)
2. **Given** the user is on the welcome screen, **When** they enter a phone number and submit, **Then** the app authenticates them via mock authentication and routes them to the appropriate shell
3. **Given** the user enters a pre-seeded chef phone number, **When** they submit, **Then** they are routed to the chef shell
4. **Given** the user enters any other phone number, **When** they submit, **Then** they are routed to the customer shell

---

### User Story 2 - Customer Navigation Shell (Priority: P1)

A customer signs in and the app presents a tab-based navigation with all customer sections available: Home, Favorites, Orders, and Profile. Each tab is accessible and the customer can switch between them seamlessly. The interface uses a light visual theme consistent with the customer experience.

**Why this priority**: The customer shell is the primary container for all customer-facing features. Without it, customers cannot access any functionality.

**Independent Test**: Can be tested by signing in with a customer account and verifying all four tabs are present, navigable, and the light theme is applied.

**Acceptance Scenarios**:

1. **Given** a user signs in with a customer account, **When** authentication succeeds, **Then** the user is routed to the customer shell with four tabs (Home, Favorites, Orders, Profile)
2. **Given** the customer is in the customer shell, **When** they tap any tab, **Then** the corresponding screen is displayed
3. **Given** the customer is in the customer shell, **When** the app is rendered, **Then** a light visual theme is applied throughout

---

### User Story 3 - Chef Navigation Shell (Priority: P1)

A chef signs in and the app presents a tab-based navigation with all chef sections available: Dashboard, Orders, Menu, Schedule, and Stats. Each tab is accessible and the chef can switch between them seamlessly. The interface uses a dark visual theme clearly distinguishing the chef experience from the customer experience.

**Why this priority**: The chef shell is the primary container for all chef-facing features. Without it, chefs cannot manage their kitchen operations.

**Independent Test**: Can be tested by signing in with a chef account and verifying all five tabs are present, navigable, and the dark theme is applied.

**Acceptance Scenarios**:

1. **Given** a user signs in with a chef account, **When** authentication succeeds, **Then** the user is routed to the chef shell with five tabs (Dashboard, Orders, Menu, Schedule, Stats)
2. **Given** the chef is in the chef shell, **When** they tap any tab, **Then** the corresponding screen is displayed
3. **Given** the chef is in the chef shell, **When** the app is rendered, **Then** a dark visual theme is applied throughout

---

### User Story 4 - Session Persistence and Route Guarding (Priority: P2)

A returning user who previously signed in opens the app and is immediately taken to their appropriate shell (customer or chef) without needing to sign in again. Additionally, a customer cannot accidentally navigate to chef screens and vice versa — the app enforces role-based access to each shell.

**Why this priority**: Session persistence is critical for daily use — users should not need to sign in every time they open the app. Route guarding prevents confusing cross-role navigation.

**Independent Test**: Can be tested by signing in, closing the app completely, reopening it, and verifying the user lands directly in their correct shell. Also test that navigating to a route belonging to the other role redirects back.

**Acceptance Scenarios**:

1. **Given** a user has previously signed in and the app is closed, **When** the app is reopened, **Then** the user is taken directly to their appropriate shell (customer or chef) without seeing the welcome or sign-in screens
2. **Given** a customer is signed in, **When** they attempt to access a chef-only route, **Then** they are redirected to their customer shell
3. **Given** a chef is signed in, **When** they attempt to access a customer-only route, **Then** they are redirected to their chef shell

---

### User Story 5 - Developer Workflow Foundation (Priority: P2)

Developers working on the Nafas codebase have a consistent, enforced development workflow: code is automatically checked for style and quality issues, commit messages follow a standard format, and a test framework is ready to validate critical logic. This ensures code quality from the very first feature and prevents regressions.

**Why this priority**: Without developer tooling in place from the start, technical debt accumulates rapidly and the codebase becomes harder to maintain as features are added.

**Independent Test**: Can be tested by making a code style violation and verifying the linter catches it, making a commit with a non-standard message and verifying it is rejected, and running the test suite to confirm it executes successfully.

**Acceptance Scenarios**:

1. **Given** a developer writes code that violates style rules, **When** they run the lint check, **Then** violations are reported with clear messages
2. **Given** a developer writes a commit message that does not follow the convention, **When** they attempt to commit, **Then** the commit is rejected with guidance on the expected format
3. **Given** the project test framework is set up, **When** a developer runs the test suite, **Then** it executes successfully (even if only a smoke test exists)

---

### Edge Cases

- What happens when the app is launched with corrupted or partial session data? The app should fall back to the welcome screen rather than crash or show a blank screen.
- What happens if the user's device has no network on first launch? The welcome and auth screens should still render since they do not depend on live data.
- What happens when a user signs out from within a shell? They should be returned to the welcome screen and all session data cleared.
- What happens if the app is killed mid-navigation? On relaunch, the app should restore the last stable state (the correct shell based on session).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST present a welcome screen with a phone number input to users who have no active session
- **FR-014**: System MUST authenticate users via phone number entry alone (mock authentication) — pre-seeded chef phone numbers route to the chef shell, all other numbers route to the customer shell
- **FR-015**: System MUST NOT require OTP verification in Phase 1; phone entry submission is sufficient to establish a session
- **FR-002**: System MUST route authenticated customers to a customer-specific navigation shell with Home, Favorites, Orders, and Profile sections
- **FR-003**: System MUST route authenticated chefs to a chef-specific navigation shell with Dashboard, Orders, Menu, Schedule, and Stats sections
- **FR-004**: System MUST apply a light visual theme to the customer shell and a dark visual theme to the chef shell
- **FR-005**: System MUST persist user session across app launches so returning users skip the welcome and sign-in screens
- **FR-006**: System MUST enforce role-based route access — customers cannot access chef routes and chefs cannot access customer routes
- **FR-007**: System MUST redirect users to the correct shell when a route mismatch is detected based on their role
- **FR-008**: System MUST present placeholder screens for each tab that clearly indicate the section name and that content is coming soon
- **FR-009**: System MUST enforce consistent code style through automated linting and formatting tools
- **FR-010**: System MUST enforce conventional commit messages through commit message validation
- **FR-011**: System MUST include a working test framework capable of running unit tests for business logic
- **FR-012**: System MUST clear session data and return to the welcome screen when a user signs out
- **FR-013**: System MUST gracefully handle corrupted or missing session data by falling back to the welcome screen

### Key Entities

- **User Session**: Represents the authenticated state of a user, including their identity, role (customer or chef), and authentication status. Persists across app launches.
- **User Role**: An attribute that determines which navigation shell and routes a user has access to — either "customer" or "chef".

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A new user can launch the app and see the welcome screen within 3 seconds of tapping the app icon
- **SC-002**: An authenticated user is routed to their correct shell (customer or chef) within 2 seconds of sign-in
- **SC-003**: A returning authenticated user bypasses the welcome screen and lands in their shell within 3 seconds of app launch
- **SC-004**: All tabs in both shells are accessible and navigable — tapping any tab switches the displayed screen 100% of the time
- **SC-005**: The light theme is consistently applied across all customer screens and the dark theme across all chef screens with no visual inconsistency
- **SC-006**: Code style violations are detected by the linter with zero false negatives for the configured rules
- **SC-007**: Non-conventional commit messages are rejected 100% of the time
- **SC-008**: The test suite executes and reports results (pass or fail) without configuration errors

## Assumptions

- Users are on mobile devices (iOS and Android) — desktop web is not in scope for the MVP
- The app will operate in a single-device environment with a simulated backend; real backend integration is a future phase
- Chef accounts are pre-seeded and not created through the app UI during the MVP
- The "sign-in" flow for Phase 1 uses phone number entry only (no OTP) as mock authentication — the full OTP-based sign-in is covered in Phase 4
- Both light and dark themes will be refined in later phases; Phase 1 establishes the mechanism and basic visual distinction only
- Placeholder screens for tabs may show minimal content but must clearly identify the section
- Git branch naming and commit conventions follow the project's documented standards
- The testing framework covers critical logic only in Phase 1; comprehensive test coverage is targeted in later phases
