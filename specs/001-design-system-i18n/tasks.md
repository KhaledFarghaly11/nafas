# Tasks: Design System + i18n

**Input**: Design documents from `/specs/001-design-system-i18n/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/component-contracts.md

**Tests**: Not explicitly requested — no test tasks included.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install new npm packages and configure fonts — everything that must exist before any code can be written.

- [x] T001 Install new dependencies: run `npm install i18next react-i18next expo-font expo-updates` in project root. Verify no peer dependency warnings in output.
- [x] T002 [P] Download font files (SpaceGrotesk-Regular.ttf, SpaceGrotesk-Medium.ttf, SpaceGrotesk-Bold.ttf, Inter-Regular.ttf, Inter-Medium.ttf, Cairo-Regular.ttf, Cairo-Medium.ttf, Cairo-Bold.ttf) and place them in `assets/fonts/`. If exact font files are unavailable, use `@expo/vector-icons` built-in fonts as temporary placeholder — the key is that `useFonts()` must not error on load.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented. These files are imported by every component in later phases.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Expand `src/design/tokens.ts` — replace the current minimal token objects with the full token set. The file must export `lightTokens` and `darkTokens` (both typed as `TokenSet`). Each token set must contain: (1) `colors` object with ALL of these keys: `background`, `text`, `textSecondary`, `primary`, `primaryLight`, `error`, `success`, `warning`, `surface`, `border`, `tabBackground`, `tabBarInactive`, `skeletonBase`, `skeletonHighlight`; (2) `spacing` object with keys: `xs=4, sm=8, md=12, lg=16, xl=24, 2xl=32, 3xl=48`; (3) `typography` object with keys `xs, sm, md, lg, xl, 2xl, 3xl, 4xl`, each containing `{ fontSize, lineHeight, fontFamily }` — use fontSize values 12/14/16/18/20/24/30/36 and lineHeight 1.5x fontSize; fontFamily should be `'Cairo'` (will be dynamically overridden by Text component); (4) `radius` object: `none=0, sm=4, md=8, lg=12, xl=16, full=9999`; (5) `shadows` object: `none, sm, md, lg` — each is `{ shadowColor, shadowOffset, shadowOpacity, shadowRadius }` with increasing elevation. Also export `type TokenSet = typeof lightTokens` for use by theme provider and components. Light colors: warm whites/greens (#FFFFFF background, #1A1A1A text, #2E7D32 primary, #66BB6A primaryLight, #F5F5F5 surface, #E0E0E0 border, #D32F2F error, #388E3C success, #F57C00 warning). Dark colors: dark backgrounds/light text (#121212 background, #F5F5F5 text, #66BB6A primary, #81C784 primaryLight, #1E1E1E surface, #333333 border, #EF5350 error, #66BB6A success, #FF9800 warning). Skeleton colors: light=#E0E0E0/#F5F5F5, dark=#333333/#444444.
- [x] T005 Update `src/design/theme.tsx` — modify ThemeProvider to read `themeOverride` from settings store in addition to `role` from session store. The theme selection logic must be: `const mode = useSettingsStore(s => s.themeOverride) ?? (role === 'chef' ? 'dark' : 'light')`, then `const tokens = mode === 'dark' ? darkTokens : lightTokens`. Import `useSettingsStore` from `@/stores/settings-store`. The `useTheme()` hook export stays the same. Also add a check for `settingsStore.hydrated` alongside the existing `sessionStore.hydrated` check — return `null` if EITHER store is not yet hydrated.
- [x] T006 Create `src/lib/rtl.ts` — export a `useRTL()` hook that returns `I18nManager.isRTL` as a boolean. Import `I18nManager` from `react-native`. The hook should be: `export function useRTL(): boolean { return I18nManager.isRTL; }`. Also export a helper `function applyRTLStyle(isRTL: boolean, mirrorInRTL: boolean): ViewStyle | undefined` that returns `{ transform: [{ scaleX: -1 }] }` when `isRTL && mirrorInRTL`, otherwise `undefined`.
- [x] T007 Create `src/i18n/index.ts` — initialize i18next for use with react-i18next. Import `i18n` from `i18next` and `initReactI18next` from `react-i18next`. Import `enCommon` from `@/i18n/en/common.json` and `arCommon` from `@/i18n/ar/common.json`. Call `i18n.use(initReactI18next).init({ resources: { en: { common: enCommon }, ar: { common: arCommon } }, lng: 'ar', defaultNS: 'common', interpolation: { escapeValue: false }, compatibilityJSON: 'v4' })`. Export the configured `i18n` instance. The language will be synced from settings store later (in T012).
- [x] T008 [P] Create `src/i18n/en/common.json` — English translation file with initial keys for this feature: `{ "app_name": "Nafas", "language_arabic": "العربية", "language_english": "English", "language_change_confirm_title": "Change Language", "language_change_confirm_message": "The app will reload to apply the new language. Continue?", "language_change_confirm_ok": "Change", "language_change_confirm_cancel": "Cancel", "theme_light": "Light", "theme_dark": "Dark", "theme_system": "Default", "error_title": "Something went wrong", "error_message": "An error occurred. Please try again.", "error_retry": "Retry", "empty_title": "Nothing here yet", "toast_dismissed": "Dismissed" }`.
- [x] T009 [P] Create `src/i18n/ar/common.json` — Arabic translation file with the same keys as English: `{ "app_name": "نفس", "language_arabic": "العربية", "language_english": "English", "language_change_confirm_title": "تغيير اللغة", "language_change_confirm_message": "سيتم إعادة تشغيل التطبيق لتطبيق اللغة الجديدة. هل تريد المتابعة؟", "language_change_confirm_ok": "تغيير", "language_change_confirm_cancel": "إلغاء", "theme_light": "فاتح", "theme_dark": "داكن", "theme_system": "الافتراضي", "error_title": "حدث خطأ ما", "error_message": "حدث خطأ. يرجى المحاولة مرة أخرى.", "error_retry": "إعادة المحاولة", "empty_title": "لا يوجد شيء هنا بعد", "toast_dismissed": "تم الرفض" }`.
- [x] T010 Update `src/stores/settings-store.ts` — add persistence and theme override. (1) Add imports: `AsyncStorage` from `@react-native-async-storage/async-storage`, `persist` and `createJSONStorage` from `zustand/middleware`. (2) Add `themeOverride: 'light' | 'dark' | null` field with default `null`. (3) Add `setThemeOverride: (mode: 'light' | 'dark' | null) => void` action. (4) Add `hydrated: boolean` field with default `false`. (5) Wrap the store creator with `persist()` middleware using `name: 'nafas-settings'` and `storage: createJSONStorage(() => AsyncStorage)`. (6) Add `onRehydrateStorage` callback that sets `hydrated: true` (same pattern as session-store). (7) Change default `language` from `'en'` to `'ar'`. (8) Export `type SettingsState` interface for reuse.
- [x] T011 Create `src/design/typography.ts` — export font family mappings used by the Text component. Define: `export const fontFamilies = { latin: { heading: 'SpaceGrotesk', body: 'Inter' }, arabic: { heading: 'Cairo', body: 'Cairo' } } as const`. Export a helper: `export function getFontFamily(language: 'ar' | 'en', variant: 'heading' | 'body'): string` that returns the correct font family based on language and variant.
- [x] T012 Update `app/_layout.tsx` — integrate font loading, i18n initialization, and settings store sync. (1) Add import of `useFonts` from `expo-font` and all 8 font files from `../../assets/fonts/`. (2) Add import of `i18n` from `@/i18n` (this triggers i18next init on module load). (3) Add import of `useSettingsStore` from `@/stores/settings-store`. (4) In `RootLayout`, call `const [fontsLoaded] = useFonts({ SpaceGrotesk: require('../../assets/fonts/SpaceGrotesk-Regular.ttf'), ... })` with all fonts. (5) Add `const settingsHydrated = useSettingsStore(s => s.hydrated)`. (6) Change the `if (!hydrated)` check to `if (!hydrated || !settingsHydrated || !fontsLoaded)` — return null until all three are ready. (7) After the hydration check, add a `useEffect` that syncs i18n language with settings store: `useEffect(() => { const lang = useSettingsStore.getState().language; if (i18n.language !== lang) { i18n.changeLanguage(lang); } }, [settingsHydrated])`. (8) Wrap children with `<ToastProvider>` inside `<ThemeProvider>`: `<QueryProvider><ThemeProvider><ToastProvider><Slot /></ToastProvider></ThemeProvider></QueryProvider>`.

**Checkpoint**: Foundation ready — all tokens defined, theme provider supports override, i18n initialized, settings persisted, fonts loading. User story implementation can now begin.

---

## Phase 3: User Story 1 - Switch App Language (Priority: P1) 🎯 MVP

**Goal**: Users can switch between Arabic and English. The app reloads in the correct direction (RTL for Arabic, LTR for English). Language preference persists across restarts.

**Independent Test**: Switch language from English to Arabic in settings → confirmation dialog appears → app reloads in Arabic RTL → close and relaunch app → still in Arabic RTL.

### Implementation for User Story 1

- [x] T013 [US1] Create `src/components/primitives/Text.tsx` — themed Text component. Props per contracts: `children: ReactNode`, `variant?: 'heading1'|'heading2'|'heading3'|'body'|'caption'|'overline'` (default `'body'`), `color?: 'primary'|'secondary'|'error'|'inverse'` (default `'primary'`), `align?: 'left'|'center'|'right'|'auto'` (default `'auto'`), `numberOfLines?: number`, `style?: TextStyle`, `testID?: string`. Implementation: (1) Call `useTheme()` to get tokens. (2) Map variant to typography token: heading1→4xl, heading2→3xl, heading3→2xl, body→md, caption→sm, overline→xs. (3) Map color prop to token: primary→colors.text, secondary→colors.textSecondary, error→colors.error, inverse→colors.background. (4) For `align='auto'`, use `useRTL()` to set `textAlign` to `'right'` if RTL else `'left'`. (5) Override fontFamily from typography token with the correct font for current language using `getFontFamily()` from typography.ts — get language from `useSettingsStore(s => s.language)`. (6) Render a React Native `<Text>` with computed styles. Export as named export.
- [x] T014 [US1] Create `src/components/primitives/Button.tsx` — themed Button component. Props per contracts: `title: string`, `onPress: () => void`, `variant?: 'primary'|'secondary'|'ghost'|'danger'` (default `'primary'`), `size?: 'sm'|'md'|'lg'` (default `'md'`), `disabled?: boolean`, `loading?: boolean`, `leftIcon?: string`, `rightIcon?: string`, `style?: ViewStyle`, `testID?: string`. Implementation: (1) Call `useTheme()` for tokens, `useRTL()` for direction. (2) Map variant to colors: primary→bg=colors.primary text=colors.background, secondary→bg=colors.surface text=colors.primary border=colors.border, ghost→bg=transparent text=colors.primary, danger→bg=colors.error text=colors.background. (3) Map size to padding: sm→spacing.sm, md→spacing.md, lg→spacing.lg. (4) Map size to text variant: sm→caption, md→body, lg→heading3. (5) When `loading=true`, show `<ActivityIndicator>` in matching color instead of title text, and set `pointerEvents='none'`. (6) When `disabled=true`, reduce opacity to 0.5 and set `pointerEvents='none'`. (7) Render left/right Icon components if provided. (8) Wrap everything in a `<Pressable>` or `<TouchableOpacity>`. Export as named export.
- [x] T015 [US1] Create `src/components/primitives/Icon.tsx` — themed Icon component. Props: `name: string` (Feather icon name), `size?: number` (default 24), `color?: 'primary'|'secondary'|'error'|'inverse'` (default `'primary'`), `mirrorInRTL?: boolean` (default false), `style?: ViewStyle`, `testID?: string`. Implementation: (1) Import `Feather` from `@expo/vector-icons`. (2) Call `useTheme()` to map color prop to token value (same mapping as Text). (3) Call `useRTL()` and `applyRTLStyle()` from `src/lib/rtl.ts` — if `mirrorInRTL && isRTL`, apply `scaleX: -1` transform. (4) Render `<Feather name={name} size={size} color={resolvedColor} style={[rtlStyle, style]} />`. Export as named export.
- [x] T016 [US1] Create `src/components/feedback/Skeleton.tsx` — loading placeholder component. Props: `variant: 'list'|'detail'|'card'`, `count?: number` (default 3 for list variant), `style?: ViewStyle`, `testID?: string`. Implementation: (1) Call `useTheme()` to get `colors.skeletonBase` and `colors.skeletonHighlight`. (2) For `variant='list'`: render `count` rows, each with a 40x40 rounded circle on the left (using skeletonBase color) and 2 rounded rectangles to the right (text placeholders). (3) For `variant='detail'`: render 1 large 200x150 rectangle (image placeholder) + 3 smaller lines below. (4) For `variant='card'`: render 1 card-sized rectangle with rounded corners (image area top, text lines bottom). (5) Apply a simple pulse animation using `Animated.Value` that oscillates opacity between 0.3 and 1.0 on a 1-second loop. Use `skeletonBase` as fill color. Export as named export.
- [x] T017 [US1] Create `src/components/feedback/EmptyState.tsx` — empty state component. Props: `title: string`, `message?: string`, `actionLabel: string`, `onAction: () => void`, `icon?: string` (Feather icon name), `style?: ViewStyle`, `testID?: string`. Implementation: (1) Call `useTheme()` for tokens. (2) Center all content vertically in a flex container. (3) If `icon` provided, render `<Icon name={icon} size={48} color="secondary" />`. (4) Render title using `<Text variant="heading3">`. (5) If `message` provided, render `<Text variant="body" color="secondary">`. (6) Render `<Button variant="primary" title={actionLabel} onPress={onAction} />`. (7) Space items with `spacing.md` gap. Export as named export.
- [x] T018 [US1] Create `src/components/feedback/ErrorState.tsx` — error state component with retry. Props: `title?: string` (default from i18n `error_title`), `message?: string` (default from i18n `error_message`), `retryLabel?: string` (default from i18n `error_retry`), `onRetry: () => void`, `style?: ViewStyle`, `testID?: string`. Implementation: (1) Import `useTranslation` from `react-i18next` and call `const { t } = useTranslation()`. (2) Call `useTheme()` for tokens. (3) Center all content vertically. (4) Render `<Icon name="alert-circle" size={48} color="error" />`. (5) Render title using `<Text variant="heading3" color="error">{title ?? t('error_title')}</Text>`. (6) Render message using `<Text variant="body" color="secondary">{message ?? t('error_message')}</Text>`. (7) Render `<Button variant="primary" title={retryLabel ?? t('error_retry')} onPress={onRetry} />`. Export as named export.
- [x] T019 [US1] Create `src/components/feedback/Toast.tsx` — contains the Toast component, ToastProvider, and useToast hook ALL IN ONE FILE. (1) Create a React context `ToastContext` with shape `{ show: (message: string, type?: 'success'|'error'|'info') => void }`. (2) Create `useToast()` hook that reads from this context, throwing if used outside provider. (3) Create internal state type: `{ visible: boolean, message: string, type: 'success'|'error'|'info', id: number }`. (4) Create `ToastProvider` component: manages toast state with `useState`, provides `show` function via context. The `show` function: sets toast state to visible with new message/type, starts a 4-second `setTimeout` that hides the toast, clears any existing timeout if a new toast comes in. (5) Create `Toast` rendering component: positioned absolutely at bottom of screen (use `position: 'absolute', bottom: 80, left: '5%', right: '5%'`, `maxWidth: 400` with alignSelf center), above bottom navigation. Use `<SafeAreaView>` for inset handling. Apply `colors.surface` background, `radius.lg` border radius, `shadows.md` shadow. Map type to left border color: success→colors.success, error→colors.error, info→colors.primary. Render message with `<Text variant="body">`. Add slide-up/slide-down animation using `Animated.Value` with `translateY`. (6) In ToastProvider render: render children + `<Toast ... />` if state.visible. Export: `ToastProvider` and `useToast` as named exports.
- [x] T020 [US1] Create `src/components/layout/ScreenContainer.tsx` — screen wrapper component. Props: `children: ReactNode`, `scrollable?: boolean` (default true), `safeArea?: boolean` (default true), `padding?: 'none'|'sm'|'md'|'lg'` (default `'md'`), `style?: ViewStyle`, `testID?: string`. Implementation: (1) Call `useTheme()` for tokens. (2) Map padding to spacing tokens: none→0, sm→spacing.sm, md→spacing.md, lg→spacing.lg. (3) Create the container: if `safeArea=true`, wrap in `<SafeAreaView>` from `react-native-safe-area-context` with `style={{ flex: 1, backgroundColor: tokens.colors.background }}`. (4) Inside, if `scrollable=true`, wrap children in `<ScrollView>` with `contentContainerStyle={{ padding: resolvedPadding }}`. (5) If not scrollable, just a `<View>` with padding. (6) Apply `style` prop last so it can override layout but not colors. Export as named export.

**Checkpoint**: At this point, User Story 1 is testable — language can be switched (via settings store directly for now), components render in both themes and directions, feedback states work. The language toggle UI itself is in Phase 4 (US2) since it requires the primitives built here.

---

## Phase 4: User Story 2 - Role-Based Theme Experience (Priority: P2)

**Goal**: Customers see light theme by default, chefs see dark theme by default. Users can manually override the theme in settings. Theme preference persists across sessions.

**Independent Test**: Login as customer → light theme. Login as chef → dark theme. Switch theme in settings → theme changes immediately and persists after restart.

### Implementation for User Story 2

- [ ] T021 [US2] Create `src/components/primitives/Card.tsx` — themed Card component. Props: `children: ReactNode`, `padding?: 'none'|'sm'|'md'|'lg'` (default `'md'`), `variant?: 'elevated'|'outlined'|'filled'` (default `'elevated'`), `onPress?: () => void`, `style?: ViewStyle`, `testID?: string`. Implementation: (1) Call `useTheme()` for tokens. (2) Map padding to spacing token values (same as ScreenContainer). (3) Map variant: elevated→background=colors.surface + shadows.md, outlined→background=colors.surface + 1px border with colors.border, filled→background=colors.primary + no shadow. (4) Apply `radius.lg` border radius to all variants. (5) If `onPress` provided, wrap in `<Pressable>` (with pressed state opacity=0.7) instead of `<View>`. Export as named export.
- [ ] T022 [US2] Create `src/components/primitives/Input.tsx` — themed Input component. Props per contracts: `value: string`, `onChangeText: (text: string) => void`, `placeholder?: string`, `label?: string`, `error?: string`, `secureTextEntry?: boolean`, `keyboardType?`, `maxLength?: number`, `disabled?: boolean`, `style?: ViewStyle`, `testID?: string`. Implementation: (1) Call `useTheme()` for tokens, `useRTL()` for direction. (2) Render optional label above input using `<Text variant="caption">`. (3) Render `<TextInput>` with: backgroundColor=colors.surface, borderColor=error?colors.error:colors.border, borderWidth=1, borderRadius=radius.md, padding=spacing.md, color=colors.text, placeholderTextColor=colors.textSecondary, textAlign=useRTL()?'right':'left' for default alignment. (4) If `error` provided, render error text below using `<Text variant="caption" color="error">`. (5) If `disabled=true`, set opacity=0.5 and `editable=false`. Export as named export.
- [ ] T023 [US2] Create `src/components/primitives/Badge.tsx` — themed Badge component. Props: `label: string`, `variant?: 'primary'|'success'|'warning'|'error'|'info'` (default `'primary'`), `size?: 'sm'|'md'` (default `'md'`), `style?: ViewStyle`, `testID?: string`. Implementation: (1) Call `useTheme()` for tokens. (2) Map variant to background/text color pair: primary→bg=colors.primaryLight/text=colors.primary, success→bg=colors.success(20% opacity)/text=colors.success, warning→bg=colors.warning(20% opacity)/text=colors.warning, error→bg=colors.error(20% opacity)/text=colors.error, info→bg=colors.primaryLight/text=colors.primary. (3) Map size to padding/font: sm→px=spacing.xs py=2 fontSize=typography.xs, md→px=spacing.sm py=spacing.xs fontSize=typography.sm. (4) Apply `radius.sm` border radius. (5) Render with `<View>` wrapper and `<Text>` inside. Export as named export.
- [ ] T024 [US2] Create `src/components/primitives/Divider.tsx` — themed Divider component. Props: `orientation?: 'horizontal'|'vertical'` (default `'horizontal'`), `spacing?: 'none'|'sm'|'md'` (default `'md'`), `style?: ViewStyle`, `testID?: string`. Implementation: (1) Call `useTheme()` for tokens. (2) For horizontal: render `<View>` with height=1, width='100%', backgroundColor=colors.border, marginVertical mapped from spacing (none=0, sm=spacing.xs, md=spacing.sm). (3) For vertical: render `<View>` with width=1, height='100%', backgroundColor=colors.border, marginHorizontal mapped from spacing. Export as named export.
- [ ] T025 [US2] Add language switch function in `src/stores/settings-store.ts` — add a new action `switchLanguage: (lang: 'ar' | 'en') => void` that: (1) calls `I18nManager.forceRTL(lang === 'ar')` (import I18nManager from react-native), (2) calls `i18n.changeLanguage(lang)` (import i18n from @/i18n), (3) calls `Updates.reloadAsync()` (import from expo-updates), (4) sets `language: lang` via the existing setLanguage action BEFORE the reload. The caller is responsible for showing the confirmation dialog — this function assumes the user already confirmed.
- [ ] T026 [US2] Create `src/components/domain/LanguageToggle.tsx` — language switcher component with confirmation dialog. Props: `style?: ViewStyle`, `testID?: string`. Implementation: (1) Import `useSettingsStore` from `@/stores/settings-store`, `useTranslation` from `react-i18next`, `Alert` from `react-native`. (2) Read current language: `const language = useSettingsStore(s => s.language)`. (3) Render two `<Button>` components in a row: one for "العربية" and one for "English". The currently active language button uses `variant="primary"`, the other uses `variant="ghost"`. (4) On tap of a different language button, show `<Alert.alert>` with title from `t('language_change_confirm_title')`, message from `t('language_change_confirm_message')`, and two buttons: `{ text: t('language_change_confirm_cancel'), style: 'cancel' }` and `{ text: t('language_change_confirm_ok'), onPress: () => useSettingsStore.getState().switchLanguage(selectedLang) }`. (5) Use `<View style={{ flexDirection: 'row', gap: tokens.spacing.md }}>` for layout. Export as named export.
- [ ] T027 [US2] Create `src/components/domain/ThemeToggle.tsx` — theme switcher component. Props: `style?: ViewStyle`, `testID?: string`. Implementation: (1) Import `useSettingsStore` from `@/stores/settings-store`, `useSessionStore` from `@/stores/session-store`, `useTranslation` from `react-i18next`. (2) Read current state: `const themeOverride = useSettingsStore(s => s.themeOverride)`, `const role = useSessionStore(s => s.role)`. (3) Derive active mode: `const activeMode = themeOverride ?? (role === 'chef' ? 'dark' : 'light')`. (4) Render three `<Button>` components in a row for "Light" / "Dark" / "Default" (using `t('theme_light')`, `t('theme_dark')`, `t('theme_system')`). (5) The active mode button uses `variant="primary"`, others use `variant="ghost"`. (6) On tap: call `useSettingsStore.getState().setThemeOverride(selectedValue)` where selectedValue is `'light'`, `'dark'`, or `null` (for Default). No reload needed — theme change is immediate since ThemeProvider reactively reads from settings store. Export as named export.

**Checkpoint**: At this point, User Stories 1 AND 2 work — language can be switched with reload, theme follows role with override option, all primitives render correctly.

---

## Phase 5: User Story 3 - Consistent UI Components Across the App (Priority: P3)

**Goal**: All components render correctly in both themes and both directions. No hardcoded styles. Developer can compose new screens using only these components.

**Independent Test**: Render every primitive and feedback component in 4 combinations (light/LTR, light/RTL, dark/LTR, dark/RTL) — all render without visual defects, clipped text, or misalignment.

### Implementation for User Story 3

- [ ] T028 [US3] Create barrel exports file `src/components/primitives/index.ts` — re-export all primitives: `export { Text } from './Text'`, `export { Button } from './Button'`, `export { Icon } from './Icon'`, `export { Card } from './Card'`, `export { Input } from './Input'`, `export { Badge } from './Badge'`, `export { Divider } from './Divider'`.
- [ ] T029 [P] [US3] Create barrel exports file `src/components/feedback/index.ts` — re-export all feedback components: `export { Skeleton } from './Skeleton'`, `export { EmptyState } from './EmptyState'`, `export { ErrorState } from './ErrorState'`, `export { ToastProvider, useToast } from './Toast'`.
- [ ] T030 [P] [US3] Create barrel exports file `src/components/layout/index.ts` — re-export: `export { ScreenContainer } from './ScreenContainer'`.
- [ ] T031 [US3] Create barrel exports file `src/components/index.ts` — re-export all component groups: `export * from './primitives'`, `export * from './feedback'`, `export * from './layout'`.
- [ ] T032 [US3] Verify and fix RTL rendering for all components — for each component file created in Phase 3 and Phase 4, review that: (1) No component uses `left`/`right` CSS properties — use `start`/`end` or conditional `marginLeft`/`marginRight` based on `useRTL()`. (2) `<Icon mirrorInRTL>` is used for all directional icons (back arrows, chevrons). (3) `<Input>` textAlign follows RTL correctly. (4) `<Badge>` and `<Button>` icon positioning (leftIcon/rightIcon) swaps automatically in RTL. (5) `<Skeleton>` padding respects RTL. (6) Verify mixed-direction text rendering: Arabic strings containing Latin numbers or brand names must align correctly within their container (e.g., "طلب #1234", "ماكدونالدز"). Fix any issues found. This is a manual review task — read each file, check the conditions, make edits as needed.

**Checkpoint**: All user stories are independently functional. Component library is complete, exported, and verified in both directions.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and integration checks.

- [ ] T033 Run `npm run lint` and fix all errors — ensure no lint warnings or errors in any new or modified files.
- [ ] T034 Run `npm test` and verify all existing tests still pass — no regressions from the token/theme/settings changes.
- [ ] T035 Verify the complete language switch flow end-to-end: (1) App launches in Arabic (RTL). (2) Switch to English via LanguageToggle → confirmation dialog → app reloads in English (LTR). (3) Switch back to Arabic → confirmation dialog → app reloads in Arabic (RTL). (4) Kill and relaunch app → previous language and theme persist. (5) **Performance check**: measure time from confirming the dialog to app fully loaded in new language — must be under 5 seconds (SC-001). Fix any issues found.
- [ ] T036 Verify theme override persistence: (1) Login as chef → dark theme. (2) Override to light theme via ThemeToggle. (3) Kill and relaunch → still light theme. (4) Logout → login as chef again → light theme override persists. (5) Select "Default" on ThemeToggle → theme reverts to role-based dark theme. Fix any issues found.
- [ ] T037 Verify no hardcoded colors or spacing — search all new/modified files for hex color patterns (`#[0-9a-fA-F]{3,8}`) outside `tokens.ts` and any numeric spacing values not from the token system. Replace any found with token references.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2)
- **User Story 2 (Phase 4)**: Depends on Foundational (Phase 2); uses Text/Button/Icon from US1
- **User Story 3 (Phase 5)**: Depends on US1 and US2 (needs all components created)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (Language Switch + Core Primitives)**: Starts after Phase 2 — no dependencies on other stories
- **US2 (Theme Experience + More Primitives)**: Starts after Phase 2 — uses Text/Button/Icon from US1 but independently testable
- **US3 (Component Consistency + RTL Verification)**: Needs all components from US1+US2 to verify

### Within Each User Story

- Components that use `useTheme()` depend on tokens.ts (T004) and theme.tsx (T005)
- Components that use `useRTL()` depend on rtl.ts (T006)
- Components that use translations depend on i18n/index.ts (T007) + locale files (T008, T009)
- Settings store (T010) must be done before theme.tsx (T005) can reference themeOverride

### Parallel Opportunities

- T002 can run in parallel with T001 (font files while npm installs)
- T008 and T009 can run in parallel (different locale JSONs)
- T021, T022, T023, T024 can all run in parallel (different primitive components, different files)
- T026, T027 can run in parallel (different domain components, different files)
- T028, T029, T030 can run in parallel (different barrel export files)

---

## Parallel Example: User Story 2

```text, these US2 tasks can run in parallel:
T021: Card.tsx        (new file)
T022: Input.tsx       (new file)
T023: Badge.tsx       (new file)
T024: Divider.tsx     (new file)

# Then sequentially:
T025: Add switchLanguage to settings-store.ts (modifies existing file)

# Then in parallel (domain components):
T026: LanguageToggle.tsx (new file)
T027: ThemeToggle.tsx    (new file)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: Foundational (T003–T011)
3. Complete Phase 3: User Story 1 (T012–T019)
4. **STOP and VALIDATE**: Test language switch + component rendering
5. Demo: App switches language, components themed correctly

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Language switching + core components (MVP!)
3. Add User Story 2 → Theme override + remaining primitives
4. Add User Story 3 → Barrel exports + RTL verification
5. Polish → Lint, test, no-hardcoded-values audit

### Key Implementation Notes

- **Every component** must call `useTheme()` — never import tokens directly
- **Every component** with layout direction sensitivity must call `useRTL()`
- **Font family** is resolved at render time based on current language, not hardcoded
- **Language switch** always goes through `switchLanguage()` in settings store — never call `I18nManager.forceRTL()` or `Updates.reloadAsync()` directly from a component
- **Toast** is triggered via `useToast()` hook — never import Toast component directly
- **No hardcoded colors** — if you find yourself typing a hex value, it belongs in `tokens.ts`
