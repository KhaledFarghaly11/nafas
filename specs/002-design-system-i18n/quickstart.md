# Quickstart: Design System + i18n

**Feature**: 002-design-system-i18n
**Date**: 2026-04-13

---

## Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npx expo`)
- iOS Simulator or Android Emulator for RTL testing

## Setup

### 1. Install Dependencies

```bash
npm install i18next react-i18next expo-font expo-updates @expo-google-fonts/tajawal @expo-google-fonts/noto-sans-arabic @expo-google-fonts/cormorant-garamond
```

> `@expo/vector-icons` and `@react-native-async-storage/async-storage` are already installed.

### 2. Font Assets

Font files are bundled automatically by `@expo-google-fonts` packages — no manual TTF downloads needed.

Font families loaded at runtime:

- **Tajawal** (Regular, Medium, Bold, ExtraBold) — Arabic display: headlines, cook names, dish names
- **Noto Sans Arabic** (Light, Regular, Medium) — Arabic body: readable at small sizes
- **Cormorant Garamond** (Regular, SemiBold, Italic) — Latin numeral: prices, timers

### 3. Run the App

```bash
npm start
```

---

## Key Files to Create/Modify

| File                                        | Action     | Description                                                                      |
| ------------------------------------------- | ---------- | -------------------------------------------------------------------------------- |
| `src/design/tokens.ts`                      | **Modify** | Expand from colors-only to full token set (spacing, typography, radius, shadows) |
| `src/design/theme.tsx`                      | **Modify** | Add theme override support from settings store                                   |
| `src/design/typography.ts`                  | **Create** | Font family definitions and scale                                                |
| `src/i18n/index.ts`                         | **Create** | i18next initialization with settings store language                              |
| `src/i18n/ar/common.json`                   | **Create** | Arabic translations                                                              |
| `src/i18n/en/common.json`                   | **Create** | English translations                                                             |
| `src/stores/settings-store.ts`              | **Modify** | Add persistence + themeOverride                                                  |
| `src/components/primitives/Button.tsx`      | **Create** | Themed button component                                                          |
| `src/components/primitives/Input.tsx`       | **Create** | Themed input component                                                           |
| `src/components/primitives/Text.tsx`        | **Create** | Themed text component                                                            |
| `src/components/primitives/Card.tsx`        | **Create** | Themed card component                                                            |
| `src/components/primitives/Badge.tsx`       | **Create** | Themed badge component                                                           |
| `src/components/primitives/Divider.tsx`     | **Create** | Themed divider component                                                         |
| `src/components/primitives/Icon.tsx`        | **Create** | Themed icon component with RTL mirroring                                         |
| `src/components/layout/ScreenContainer.tsx` | **Create** | Safe area + scroll container                                                     |
| `src/components/feedback/Skeleton.tsx`      | **Create** | Loading placeholders                                                             |
| `src/components/feedback/EmptyState.tsx`    | **Create** | Empty state with CTA                                                             |
| `src/components/feedback/ErrorState.tsx`    | **Create** | Error state with retry                                                           |
| `src/components/feedback/Toast.tsx`         | **Create** | Toast notification + provider                                                    |
| `src/lib/rtl.ts`                            | **Create** | `useRTL()` hook + RTL utilities                                                  |
| `app/_layout.tsx`                           | **Modify** | Add font loading, i18n init, ToastProvider                                       |

---

## Development Workflow

### Building a New Screen

1. Wrap screen content in `<ScreenContainer>`
2. Use `<Text variant="heading1">` for titles, `<Text variant="body">` for content
3. Use `<Button variant="primary">` for main actions
4. Handle states:
   ```tsx
   if (isLoading) return <Skeleton variant="list" />;
   if (error) return <ErrorState onRetry={refetch} />;
   if (data.length === 0)
     return <EmptyState title="No items" actionLabel="Browse" onAction={goHome} />;
   ```

### Adding a New Translation Key

1. Add key to `src/i18n/en/common.json`
2. Add translation to `src/i18n/ar/common.json`
3. Use in component: `t('key')`

### Testing RTL

1. Switch language to Arabic in settings
2. Confirm reload dialog
3. Verify all components render correctly in RTL
4. Switch back to English and verify LTR

---

## Exit Criteria Verification

- [ ] Switch language to Arabic → app reloads in RTL
- [ ] All primitives render correctly in both themes (light/dark)
- [ ] No hardcoded colors or magic numbers in any component
- [ ] Theme override persists across app restarts
- [ ] Language preference persists across app restarts
- [ ] Toast appears at bottom, auto-dismisses after 4 seconds
