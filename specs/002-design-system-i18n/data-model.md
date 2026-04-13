# Data Model: Design System + i18n

**Feature**: 002-design-system-i18n
**Date**: 2026-04-13

---

## Entities

### DesignToken

Centralized visual property values consumed by all components.

| Field    | Type                                                             | Description                                                       |
| -------- | ---------------------------------------------------------------- | ----------------------------------------------------------------- |
| category | `'colors' \| 'spacing' \| 'typography' \| 'radius' \| 'shadows'` | Token category                                                    |
| name     | `string`                                                         | Semantic token name (e.g., `background`, `clay`, `bark`, `md`)    |
| value    | `string \| number`                                               | Token value (hex color, px number, etc.)                          |
| palette  | `'light' \| 'dark' \| 'shared'`                                  | Which palette the token belongs to; `shared` for non-color tokens |

**Validation Rules**:

- Color tokens must be valid hex strings (6 or 8 digits)
- Spacing values follow a 4px base grid (4, 8, 12, 16, 24, 32, 48, 64)
- Typography scale defines: xs (12), sm (14), md (15), lg (18), xl (19), 2xl (24), 3xl (30), 4xl (36), numeral (20)
- Radius values: none (0), sm (8), md (12), lg (20), xl (24), full (50)
- Shadow values: none, sm, md, lg (elevation levels with platform-specific implementations)

---

### Theme

A complete set of tokens identified by mode.

| Field  | Type                | Description                                         |
| ------ | ------------------- | --------------------------------------------------- |
| mode   | `'light' \| 'dark'` | Theme identifier                                    |
| tokens | `TokenSet`          | Complete set of resolved token values for this mode |

**Derived Logic**:

- Default selection: `role === 'chef' ? 'dark' : 'light'`
- Override selection: `settingsStore.themeOverride ?? defaultSelection`
- Light palette: cream background (#FAF3E8), oud text (#2C1A0E), clay primary (#C1714F), saffron highlights, warm-tinted shadows
- Dark palette: deep oud background (#1A110A), cream text (#FAF3E8), clay primary, saffron active tint for chef tabs

**Validation Rules**:

- Every color token must exist in both light and dark palettes
- Shared tokens (spacing, typography, radius, shadows) must be identical across palettes

---

### Language

User preference determining text content and layout direction.

| Field        | Type             | Description                                           |
| ------------ | ---------------- | ----------------------------------------------------- |
| code         | `'ar' \| 'en'`   | ISO 639-1 language code                               |
| direction    | `'rtl' \| 'ltr'` | Layout direction derived from language                |
| label        | `string`         | Display name in native script ('العربية' / 'English') |
| fontFamilies | `object`         | Primary and secondary font families for this language |

**Derived Logic**:

- `ar` → `rtl`, Tajawal (display) + Noto Sans Arabic (body) font families
- `en` → `ltr`, Tajawal (display) + Noto Sans Arabic (body) + Cormorant Garamond (numeral) font families
- Default for new users: `ar`

**Validation Rules**:

- Language code must be one of the supported values
- Direction must match the language code (ar→rtl, en→ltr)

---

### SettingsStore

Persisted user preferences.

| Field         | Type                        | Default | Description                                    |
| ------------- | --------------------------- | ------- | ---------------------------------------------- |
| language      | `'ar' \| 'en'`              | `'ar'`  | Active language preference                     |
| themeOverride | `'light' \| 'dark' \| null` | `null`  | Manual theme override; null = use role default |
| hydrated      | `boolean`                   | `false` | Whether store has rehydrated from persistence  |

**Relationships**:

- `themeOverride` resolves to a Theme mode, which provides a TokenSet
- `language` resolves to a Language entity, which determines direction and font families

**Validation Rules**:

- `themeOverride` must be null or a valid theme mode
- `language` must be a supported language code
- `hydrated` must be true before any UI renders (prevents flash of wrong theme/language)

---

### Toast

Transient notification state.

| Field     | Type                             | Description                            |
| --------- | -------------------------------- | -------------------------------------- |
| id        | `string`                         | Unique toast instance identifier       |
| message   | `string`                         | Display text (already translated)      |
| type      | `'success' \| 'error' \| 'info'` | Visual variant                         |
| visible   | `boolean`                        | Whether toast is currently displayed   |
| createdAt | `number`                         | Timestamp for auto-dismiss calculation |

**Lifecycle**:

1. Created: `showToast(message, type)` called
2. Visible: rendered at bottom of screen above navigation
3. Auto-dismissed: 4 seconds after creation
4. Removed: state cleaned up after dismiss animation

**Validation Rules**:

- Only one toast visible at a time (new toast replaces existing)
- Message must be a non-empty string
- Auto-dismiss timer resets if toast is replaced

---

## Entity Relationships

```
SessionStore.role ──────→ Theme.defaultMode
                              │
SettingsStore.themeOverride ──→ Theme.mode (overrides default)
                              │
                              └──→ TokenSet (consumed by all components)

SettingsStore.language ──→ Language
                              │
                              ├──→ direction (RTL/LTR)
                              ├──→ fontFamilies
                              └──→ I18nManager.forceRTL()

Toast ○── managed by ToastProvider (global, root-level)
```

---

## State Ownership (Constitution Compliance)

| Data                | Owner                         | Source                                 |
| ------------------- | ----------------------------- | -------------------------------------- |
| Theme tokens        | React context (ThemeProvider) | `tokens.ts`                            |
| Active theme        | Zustand (settings-store)      | `themeOverride` + `session-store.role` |
| Language preference | Zustand (settings-store)      | `language` field, persisted            |
| Toast state         | React context (ToastProvider) | In-memory, transient                   |
| Session/role        | Zustand (session-store)       | Existing, no changes needed            |
