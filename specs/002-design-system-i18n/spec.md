# Feature Specification: Design System + i18n

**Feature Branch**: `002-design-system-i18n`  
**Created**: 2026-04-13  
**Status**: Draft  
**Input**: User description: "Phase 2 — Design System + i18n (Area B Foundation): Theme tokens, core components, and bilingual RTL/LTR working."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Switch App Language (Priority: P1)

A user wants to use the app in their preferred language (Arabic or English). When they change the language setting, the entire app — all text, layout direction, and visual alignment — adapts to the chosen language. Arabic users see a right-to-left layout with all text mirrored; English users see a standard left-to-right layout. The language preference persists across app restarts.

**Why this priority**: Language is fundamental to accessibility and usability. Without bilingual support, half the target audience cannot use the app effectively. This is the foundation every screen depends on.

**Independent Test**: Can be fully tested by switching the language toggle from English to Arabic, verifying all visible text changes, the layout mirrors to RTL, and restarting the app to confirm the preference is retained. Delivers immediate value to bilingual users.

**Acceptance Scenarios**:

1. **Given** the app is in English, **When** the user selects Arabic from the language toggle, **Then** a confirmation dialog appears explaining the app will reload, and upon reload all text is in Arabic with RTL layout
2. **Given** the app is in Arabic, **When** the user selects English from the language toggle, **Then** a confirmation dialog appears, and upon reload all text is in English with LTR layout
3. **Given** the user has set Arabic as their language, **When** the user closes and relaunches the app, **Then** the app opens in Arabic with RTL layout without requiring re-selection
4. **Given** the user is viewing any screen, **When** the language is switched, **Then** no text remains in the previous language and no layout element remains in the wrong direction

---

### User Story 2 - Role-Based Theme Experience (Priority: P2)

A customer and a chef use the same app but see different visual themes. Customers see a light, warm theme that feels welcoming. Chefs see a dark, professional theme suited for kitchen environments. The theme automatically applies based on the user's role as a default, but users can manually override the theme in settings (e.g., a chef who prefers light mode). All UI elements consistently follow the active theme without any visual inconsistencies.

**Why this priority**: The dual-theme experience is a core product differentiator and reinforces role identity. It depends on design tokens (P1 infrastructure) but is the primary consumer of those tokens.

**Independent Test**: Can be tested by logging in as a customer (light theme) and as a chef (dark theme), verifying that all screens, components, and interactive elements reflect the correct theme consistently. Delivers value by making each role feel distinct and appropriate.

**Acceptance Scenarios**:

1. **Given** a user logs in as a customer, **When** they navigate through any screen, **Then** all elements use the light theme palette consistently — no mixed or default colors appear
2. **Given** a user logs in as a chef, **When** they navigate through any screen, **Then** all elements use the dark theme palette consistently
3. **Given** the theme is active (light or dark), **When** the user interacts with any component (buttons, inputs, cards), **Then** interactive states (pressed, focused, disabled) use theme-appropriate color adjustments
4. **Given** a user with any role, **When** the user manually switches the theme in settings, **Then** the app applies the selected theme immediately and persists the preference across sessions

---

### User Story 3 - Consistent UI Components Across the App (Priority: P3)

A developer building new screens has access to a complete set of reusable UI components — buttons, inputs, text, cards, badges, dividers, and feedback states — that all respect the active theme and language direction. Using these components ensures visual consistency across the entire app without manual styling. Feedback components (loading skeletons, empty states, error states, toasts) provide standardized ways to communicate app states to users.

**Why this priority**: Component consistency ensures quality at scale and prevents drift. It depends on tokens and theme being in place (P1/P2) but is essential before feature screens can be built reliably.

**Independent Test**: Can be tested by rendering each component in isolation in both themes and both language directions, verifying correct appearance and behavior. Delivers value by enabling rapid, consistent screen development.

**Acceptance Scenarios**:

1. **Given** a developer uses any primitive component (Button, Input, Text, Card, Badge, Divider), **When** the component renders in any theme and language direction, **Then** it follows the design tokens exactly with no hardcoded colors or spacing
2. **Given** a screen is loading data, **When** the loading state is active, **Then** skeleton placeholders appear matching the expected content layout
3. **Given** a screen has no data, **When** the empty state is shown, **Then** a clear message and a call-to-action button guide the user to the next step
4. **Given** a data fetch fails, **When** the error state is shown, **Then** an error message with a retry option is displayed
5. **Given** a temporary notification needs to be shown, **When** a toast is triggered, **Then** it appears at the bottom of the screen (above any bottom navigation), auto-dismisses without blocking interaction, and respects safe area insets

---

### Edge Cases

- What happens when the user switches language on a screen with partially loaded data? The reload should handle in-flight data gracefully.
- What happens when the app is launched for the first time with no language preference set? The default should be Arabic (primary market).
- What happens when a component is rendered before the theme provider is ready? The app keeps the native splash screen visible until the theme provider and settings store are fully hydrated, so users never see unstyled or incorrectly-themed content.
- What happens when Arabic text contains Latin characters (numbers, brand names)? Mixed-direction text segments must align correctly within their container.
- What happens when a skeleton loading state is shown while the user switches language? The reload should re-trigger the loading state in the new language.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST provide a complete set of design tokens covering colors (both light and dark palettes), spacing scale, typography scale, border radius, and shadow definitions
- **FR-002**: The system MUST provide a theme provider that automatically selects the light palette for customer users and the dark palette for chef users based on the active user role, with a manual override option in settings that allows any user to switch between light and dark themes
- **FR-003**: The system MUST persist the user's theme preference so that a manually chosen theme is retained across app restarts
- **FR-004**: The system MUST support bilingual text display in Arabic and English, with all user-facing strings externalized and translatable
- **FR-005**: The system MUST handle right-to-left (RTL) layout for Arabic and left-to-right (LTR) layout for English, including proper mirroring of all UI elements, icons, and navigation flows
- **FR-006**: The system MUST provide a language toggle that allows users to switch between Arabic and English, with a confirmation dialog explaining that the app will reload
- **FR-007**: The system MUST persist the user's language preference so that it is retained across app restarts without requiring re-selection
- **FR-008**: The system MUST provide the following themed, direction-aware primitive components: Button, Input, Text, Card, Badge, Divider
- **FR-009**: The system MUST provide a screen container component that handles safe area insets, applies the correct themed background, and supports scroll behavior
- **FR-010**: The system MUST provide feedback components: Skeleton (list and detail variants), EmptyState (with call-to-action), ErrorState (with retry), and Toast (auto-dismissing notification anchored to the bottom of the screen above any bottom navigation, dismissing after 4 seconds)
- **FR-011**: The system MUST provide a standardized icon component using a single consistent icon set, with automatic mirroring for RTL layouts where semantically appropriate
- **FR-012**: The system MUST provide typography support with fonts appropriate for each locale — including Latin and Arabic script font families — with the correct font selected based on the active language
- **FR-013**: All components MUST render correctly in both theme palettes and both layout directions without visual defects, misalignment, or clipped content
- **FR-014**: No screen or component MUST use hardcoded colors, spacing values, or typography styles outside the defined design tokens

### Key Entities

- **Design Token**: A named, reusable value (color, spacing unit, font size, radius, shadow) that belongs to either the light or dark palette. Tokens are the single source of truth for all visual properties.
- **Theme**: A complete set of tokens (palette) identified by mode (light or dark). A theme is selected based on user role as a default, but can be manually overridden by the user. The chosen theme persists across sessions.
- **Language**: A user-selectable preference (Arabic or English) that determines text content, font selection, and layout direction (RTL or LTR). Persisted across sessions.
- **Primitive Component**: A foundational UI building block (Button, Input, Text, Card, Badge, Divider) that consumes design tokens and respects the active theme and layout direction.
- **Feedback Component**: A component that communicates app state to the user (Skeleton for loading, EmptyState for no data, ErrorState for failures, Toast for temporary notifications).
- **Screen Container**: A layout wrapper that provides safe area handling, themed background, and scroll behavior for all screens.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can switch the app language and see a fully adapted interface (all text translated, layout direction mirrored) within 5 seconds of confirming the switch
- **SC-002**: 100% of screens and components render correctly in both the light theme and dark theme with zero visual inconsistencies
- **SC-003**: 100% of screens and components render correctly in both RTL (Arabic) and LTR (English) layouts with no misaligned, clipped, or mirrored-when-should-not-be elements
- **SC-004**: The user's language preference persists across app restarts — on relaunch, the app opens in the previously selected language without any additional user action
- **SC-005**: Zero instances of hardcoded colors, spacing, or typography values exist outside the design token system — all visual properties are token-derived
- **SC-006**: A developer can compose a new screen using only primitive and feedback components without writing any custom styling, and the screen will automatically adapt to both themes and both layout directions

## Clarifications

### Session 2026-04-13

- Q: Can users manually override the role-based theme? → A: Manual override available — role sets the default, but users can switch in settings
- Q: Where should toast notifications be positioned? → A: Bottom of screen, above bottom navigation
- Q: What auto-dismiss duration should toast notifications use? → A: 4 seconds (mobile standard)

## Assumptions

- Arabic is the primary language of the target market; the default language for first-time users is Arabic
- The language switch requires a full app reload to correctly apply layout direction changes — this is communicated to the user via confirmation dialog before the switch takes effect
- Both themes (light and dark) share the same spacing, typography scale, radius, and shadow tokens — only the color palette differs between them
- Icons that convey direction (e.g., back arrow, chevron) should be automatically mirrored in RTL; icons without directional meaning (e.g., search, heart) should not be mirrored
- Toast notifications are lightweight, non-blocking overlays positioned at the bottom of the screen (above any bottom navigation), respecting safe area insets, that auto-dismiss after 4 seconds and do not require user interaction to close
- The icon set used for all icons will be a single, consistent set appropriate for both themes (line-style icons that work on both light and dark backgrounds)
- Empty states always include a call-to-action button to guide the user toward a productive next step
- Error states always include a retry mechanism so the user can recover without leaving the screen
- Skeleton loading placeholders should approximate the shape and layout of the content that will load, providing visual continuity
