# Research: Design System + i18n

**Feature**: 001-design-system-i18n
**Date**: 2026-04-13

---

## 1. Design Token Architecture

### Decision

Use a flat token object with semantic naming, structured as two complete palettes (`lightTokens`, `darkTokens`) sharing non-color tokens. Theme provider switches between palettes at the root level.

### Rationale

- The existing `tokens.ts` already establishes this pattern with `lightTokens` / `darkTokens`
- Flat semantic tokens (e.g., `colors.background`, `colors.primary`) are simpler to consume than nested category tokens for a two-theme mobile app
- Sharing spacing, typography, radius, and shadows across both palettes avoids duplication and ensures consistency — only colors differ between light and dark (already stated in spec assumptions)
- This matches the constitution's Principle V (design tokens, not hardcoded styles)

### Alternatives Considered

- **Multi-layer tokens (global → semantic → component)**: Overkill for a two-theme mobile app with no design system team; adds indirection without benefit at this scale
- **CSS custom properties / style dictionary**: Not applicable in React Native; NativeWind was considered but adds unnecessary complexity for a two-theme app

---

## 2. Theme Override Mechanism

### Decision

Add a `themeOverride` field to `settings-store.ts` (persisted via AsyncStorage). Theme provider reads: `settingsStore.themeOverride ?? (role === 'chef' ? 'dark' : 'light')`.

### Rationale

- `settings-store.ts` already exists and handles language preference; adding theme preference follows the same pattern
- Persisting the override in settings (not session) store keeps it separate from auth state and survives logout/re-login
- The override is nullable: `null` means "use role default", `'light'` or `'dark'` means explicit choice

### Alternatives Considered

- **session-store**: Wrong scope — theme preference is a user setting, not auth state; should persist across different sessions
- **Device system preference (prefers-color-scheme)**: Not in spec; adds a third source of truth. Could be added later as an additional override source

### Constitution Violation Note

Constitution Principle III states theme "MUST NOT be user-toggleable within a session." The spec clarification explicitly overrides this: users can manually switch themes. This is justified for accessibility reasons (chefs in bright environments needing light mode, customers with dark-mode preference). The default remains role-based, but override is now supported. Documented in Complexity Tracking.

---

## 3. i18n Framework and Structure

### Decision

Use `i18next` + `react-i18next` with namespace-per-feature JSON files under `src/i18n/{locale}/`. Initialize at app startup with language from `settings-store`. RTL/LTR handled via React Native's `I18nManager`.

### Rationale

- Constitution explicitly lists "i18next + react-i18next" as the i18n tooling constraint
- JSON files are the standard i18next backend and allow easy translation handoff
- `I18nManager.forceRTL()` + app restart is the standard React Native approach for direction changes — cannot reliably switch direction at runtime without restart
- The existing `settings-store.ts` already has `language` field; needs persistence middleware added

### Alternatives Considered

- **expo-localization for device language**: Useful for initial detection but spec says default is Arabic; can be added as fallback later
- **Single JSON file per locale**: Doesn't scale; namespace-per-feature is cleaner for a multi-screen app even in MVP

---

## 4. RTL/LTR Handling Strategy

### Decision

Use `I18nManager.forceRTL(bool)` + `Updates.reloadAsync()` on language change. Show confirmation dialog before reload. All components use `I18nManager.isRTL` or the `useRTL()` hook for conditional rendering.

### Rationale

- `I18nManager` is the React Native standard for RTL support
- Direction changes require app restart in React Native — `Updates.reloadAsync()` from `expo-updates` is the cleanest way
- Confirmation dialog before reload is required by both the spec and constitution Principle IV
- Components should never manually flip layout — always use `I18nManager.isRTL` or `flexDirection: 'row-reverse'` via the theme system

### Alternatives Considered

- **Manual RTL CSS-like approach**: Fragile, error-prone, contradicts constitution Principle IV
- **Reanimated layout animation on direction change**: Not reliable for full direction swap; restart is the only proven approach

---

## 5. Icon Set and RTL Mirroring

### Decision

Use `@expo/vector-icons` (Feather set) as the icon family. Wrap in a themed `Icon` component that automatically mirrors directional icons in RTL via `style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}`.

### Rationale

- `@expo/vector-icons` is included with Expo — no additional dependency needed
- Feather is a clean line-style set that works on both light and dark backgrounds (matching spec assumption)
- The implementation plan (T014) explicitly mentions Feather as the candidate
- Mirroring via `scaleX` is the standard React Native approach for RTL icon flipping
- A `mirrorInRTL` prop on the Icon component allows per-icon control (back arrow = mirror, heart = don't mirror)

### Alternatives Considered

- **MaterialCommunityIcons**: Too dense/heavy for this app's aesthetic
- **Custom SVG icons**: Unnecessary for MVP; adds build complexity
- **Directional icon swapping (separate LTR/RTL assets)**: Overkill when `scaleX` mirroring works for 90%+ of directional icons

---

## 6. Typography: Font Loading and Locale Selection

### Decision

Load three font families: Space Grotesk (Latin headings), Inter (Latin body), Cairo (Arabic). Use `useFont()` from `expo-font` at app startup. Typography component selects font family based on active language.

### Rationale

- Implementation plan (T013) explicitly lists these three fonts
- Space Grotesk + Inter covers Latin typography with good hierarchy; Cairo is the standard Arabic web font with excellent readability
- Font selection by locale is straightforward: Arabic → Cairo, English → Space Grotesk/Inter
- `expo-font` with `useFonts()` hook is the Expo-standard approach

### Alternatives Considered

- **System fonts**: No control over Arabic rendering quality; Cairo specifically designed for Arabic UI
- **Single font for both scripts**: No font provides excellent coverage of both Latin and Arabic at display quality

---

## 7. Component Architecture

### Decision

All primitive and feedback components accept a `style` prop for layout-only overrides but internally consume design tokens exclusively. No component accepts raw color/spacing values. Components are theme-aware via `useTheme()` hook and direction-aware via `useRTL()` hook.

### Rationale

- Constitution Principle V requires all visual properties come from tokens
- Accepting `style` for layout (margin, padding within token bounds) is pragmatic for screen composition
- The `useTheme()` pattern already exists in `theme.tsx`; extending it is natural
- A `useRTL()` utility hook wrapping `I18nManager.isRTL` provides a clean API for direction-aware components

### Alternatives Considered

- **Styled-components / NativeWind**: Additional dependency for marginal benefit at MVP scale; token consumption via hooks is simpler and already established
- **No style prop at all**: Too restrictive; screen-level layout composition requires some layout flexibility

---

## 8. Toast Positioning and Auto-Dismiss

### Decision

Toast rendered via a root-level `ToastProvider` that wraps the app. Toasts appear at screen bottom, above bottom tab bar, respecting safe area insets. Auto-dismiss after 4 seconds. Managed via a `useToast()` hook that exposes `showToast(message, type)`.

### Rationale

- Bottom positioning was clarified (standard mobile convention)
- 4-second auto-dismiss was clarified (mobile standard)
- A provider-based approach is the React-standard pattern for global overlays (same as react-native-paper, React Native Paper Snackbar)
- Hook-based API keeps toast triggering simple from any component

### Alternatives Considered

- **Portal-based rendering**: More complex; provider pattern is simpler and sufficient for single-toast-at-a-time
- **Navigation-level toast**: Tied to screen lifecycle; provider decouples toast from navigation

---

## 9. Language Switch Reload Mechanism

### Decision

On language toggle: (1) show confirmation dialog, (2) update `settingsStore.language`, (3) call `I18nManager.forceRTL()`, (4) call `Updates.reloadAsync()`. No partial/language-patch approach.

### Rationale

- React Native's `I18nManager` direction requires app restart for reliable RTL/LTR switching
- `Updates.reloadAsync()` from `expo-updates` is the cleanest restart mechanism
- Full reload avoids inconsistent half-translated states
- Constitution Principle IV requires clear communication before applying direction changes

### Alternatives Considered

- **In-place re-rendering without restart**: Known to be unreliable for layout direction in React Native
- **react-native-restart**: Third-party; `Updates.reloadAsync()` from Expo is first-party and sufficient
