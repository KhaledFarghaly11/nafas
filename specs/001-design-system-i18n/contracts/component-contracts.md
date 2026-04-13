# Component Contracts: Design System + i18n

**Feature**: 001-design-system-i18n
**Date**: 2026-04-13

This document defines the public API contracts for all components and hooks introduced by this feature.

---

## Hooks

### `useTheme() → TokenSet`

Returns the active token set based on current theme (light or dark).

```typescript
useTheme(): {
  colors: {
    background: string
    text: string
    textSecondary: string
    primary: string
    primaryLight: string
    error: string
    success: string
    warning: string
    surface: string
    border: string
    tabBackground: string
    tabBarInactive: string
    skeletonBase: string
    skeletonHighlight: string
  }
  spacing: { xs: number, sm: number, md: number, lg: number, xl: number, 2xl: number, 3xl: number }
  typography: { xs/sm/md/lg/xl/2xl/3xl/4xl: { fontSize: number, lineHeight: number, fontFamily: string } }
  radius: { none: number, sm: number, md: number, lg: number, xl: number, full: number }
  shadows: { none/sm/md/lg: object }
}
```

**Preconditions**: Must be called within `<ThemeProvider>`.
**Error**: Throws if used outside provider.

---

### `useRTL() → boolean`

Returns `true` if current layout direction is RTL.

```typescript
useRTL(): boolean
```

**Preconditions**: None.
**Note**: Value derives from `I18nManager.isRTL` at render time.

---

### `useToast()`

Shows a temporary notification at the bottom of the screen.

```typescript
useToast(): {
  show: (message: string, type?: 'success' | 'error' | 'info') => void
}
```

**Preconditions**: Must be called within `<ToastProvider>`.
**Behavior**:

- `type` defaults to `'info'`
- Replaces any currently visible toast
- Toast auto-dismisses after 4 seconds

---

## Primitive Components

All primitives share these common patterns:

- Accept optional `style` prop for layout overrides (not color/typography overrides)
- Consume tokens via `useTheme()` internally
- Respond to direction via `useRTL()` internally
- Support `testID` prop for testing

### `<Button>`

```typescript
Button: {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  leftIcon?: string   // icon name from Feather set
  rightIcon?: string  // icon name from Feather set
  style?: ViewStyle
  testID?: string
}
```

**Behavior**:

- `loading` replaces title with spinner, disables press
- `disabled` reduces opacity, disables press
- Icons auto-mirror in RTL if directional

---

### `<Input>`

```typescript
Input: {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  label?: string
  error?: string
  secureTextEntry?: boolean
  keyboardType?: KeyboardTypeOptions
  maxLength?: number
  disabled?: boolean
  style?: ViewStyle
  testID?: string
}
```

**Behavior**:

- Error text displayed below input in error color
- Text alignment follows layout direction (RTL: right, LTR: left)

---

### `<Text>`

```typescript
Text: {
  children: ReactNode
  variant?: 'heading1' | 'heading2' | 'heading3' | 'body' | 'caption' | 'overline'
  color?: 'primary' | 'secondary' | 'error' | 'inverse'  // maps to token, not raw color
  align?: 'left' | 'center' | 'right' | 'auto'
  numberOfLines?: number
  style?: TextStyle
  testID?: string
}
```

**Behavior**:

- `align='auto'` follows layout direction
- Font family automatically selected based on active language

---

### `<Card>`

```typescript
Card: {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
  variant?: 'elevated' | 'outlined' | 'filled'
  onPress?: () => void
  style?: ViewStyle
  testID?: string
}
```

---

### `<Badge>`

```
Badge: {
  label: string
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
  style?: ViewStyle
  testID?: string
}
```

---

### `<Divider>`

```typescript
Divider: {
  orientation?: 'horizontal' | 'vertical'
  spacing?: 'none' | 'sm' | 'md'
  style?: ViewStyle
  testID?: string
}
```

---

### `<Icon>`

```typescript
Icon: {
  name: string        // Feather icon name
  size?: number       // defaults to 24
  color?: 'primary' | 'secondary' | 'error' | 'inverse'  // maps to token
  mirrorInRTL?: boolean  // defaults to false
  style?: ViewStyle
  testID?: string
}
```

**Behavior**:

- When `mirrorInRTL=true` and direction is RTL, applies `scaleX: -1`

---

## Layout Components

### `<ScreenContainer>`

```typescript
ScreenContainer: {
  children: ReactNode
  scrollable?: boolean     // defaults to true
  safeArea?: boolean       // defaults to true
  padding?: 'none' | 'sm' | 'md' | 'lg'  // defaults to 'md'
  style?: ViewStyle
  testID?: string
}
```

**Behavior**:

- Applies themed background color
- Handles safe area insets when `safeArea=true`
- Wraps in ScrollView when `scrollable=true`

---

## Feedback Components

### `<Skeleton>`

```typescript
Skeleton: {
  variant: 'list' | 'detail' | 'card'
  count?: number           // defaults to 3 for list variant
  style?: ViewStyle
  testID?: string
}
```

**Behavior**:

- `list`: horizontal rows with circular avatar placeholder
- `detail`: larger block with image placeholder + text lines
- `card`: card-shaped placeholder with image + text areas
- Pulse animation on placeholder elements

---

### `<EmptyState>`

```typescript
EmptyState: {
  title: string
  message?: string
  actionLabel: string
  onAction: () => void
  icon?: string            // Feather icon name
  style?: ViewStyle
  testID?: string
}
```

**Behavior**:

- Always includes a call-to-action button (per spec requirement)
- Icon and text centered vertically

---

### `<ErrorState>`

```typescript
ErrorState: {
  title?: string           // defaults to translated error title
  message?: string         // defaults to translated error message
  retryLabel?: string      // defaults to translated "Retry"
  onRetry: () => void
  style?: ViewStyle
  testID?: string
}
```

**Behavior**:

- Always includes a retry button (per spec requirement)
- Default text comes from i18n

---

### `<Toast>`

Not directly instantiated. Managed by `<ToastProvider>` and triggered via `useToast()` hook.

**Rendering contract**:

- Position: bottom of screen, above bottom navigation
- Respects safe area insets
- Width: 90% of screen width, max 400px
- Auto-dismiss: 4 seconds
- Animation: slide up on show, slide down on dismiss
- Visual variant driven by `type` prop

---

## Provider Contracts

### `<ThemeProvider>`

```typescript
ThemeProvider: {
  children: ReactNode;
}
```

**Behavior**:

- Reads `role` from `session-store` and `themeOverride` from `settings-store`
- Provides active `TokenSet` via context
- Returns `null` until stores are hydrated (prevents flash)

---

### `<ToastProvider>`

```typescript
ToastProvider: {
  children: ReactNode;
}
```

**Behavior**:

- Wraps app at root level (inside ThemeProvider)
- Manages toast state internally
- Exposes `show()` via `useToast()` hook
- Renders toast portal above all content

---

## Settings Store Contract (Extended)

Existing `settings-store.ts` extension:

```typescript
SettingsStore: {
  // Existing
  language: 'ar' | 'en'
  setLanguage: (lang: 'ar' | 'en') => void

  // New
  themeOverride: 'light' | 'dark' | null
  setThemeOverride: (mode: 'light' | 'dark' | null) => void
  hydrated: boolean
}
```

**Persistence**: All fields persisted via AsyncStorage (using Zustand `persist` middleware, same pattern as `session-store`).

**Default values**:

- `language`: `'ar'`
- `themeOverride`: `null`
- `hydrated`: `false`
