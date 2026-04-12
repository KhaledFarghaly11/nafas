# Tasks: Project Setup

**Input**: Design documents from `/specs/001-project-setup/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Jest smoke test included per spec requirement FR-011.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Mobile app**: `app/` (Expo Router routes), `src/` (shared code), `__tests__/` (tests)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, directory structure, and developer tooling

- [x] T001 Initialize the Expo project — run `npx create-expo-app@latest nafas --template blank-typescript` in the parent directory, then move all generated files into the repo root. Verify `npx expo start` launches without errors.
- [x] T002 Install core navigation dependencies — run `npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar`. Verify no peer dependency warnings.
- [x] T003 [P] Install state management dependencies — run `npx expo install @react-native-async-storage/async-storage` then `npm install zustand @tanstack/react-query`. Verify packages appear in `package.json`.
- [x] T004 [P] Install developer tooling dependencies — run `npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react-native eslint-plugin-import prettier husky @commitlint/cli @commitlint/config-conventional jest @testing-library/react-native @types/react`. Verify packages appear in `package.json` devDependencies.
- [x] T005 Configure Expo Router entry point — set `"main": "expo-router/entry"` in `package.json`. This tells Expo to use expo-router's entry point instead of the default App.js.
- [x] T006 Configure app.config.ts — create `app.config.ts` at repo root with: name "Nafas", slug "nafas", scheme "nafas", version "1.0.0", orientation "default", placeholder icon/splash paths, iOS bundleIdentifier "com.nafas.app", Android package "com.nafas.app", plugins `["expo-router"]`. Use the exact config from `specs/001-project-setup/quickstart.md` step 3.
- [x] T007 [P] Configure TypeScript strict mode — in `tsconfig.json`, set `"strict": true` under `compilerOptions`. Ensure `paths` includes `"@/*": ["./src/*"]` and `"@/api/*": ["./src/api/*"]` for clean imports.
- [x] T008 [P] Configure ESLint — create `.eslintrc.js` at repo root with extends: `["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:react-native/all"]`, parser `@typescript-eslint/parser`, plugins `["@typescript-eslint", "react-native", "import"]`, rules: `"import/order"` with alphabetize and groups (builtin, external, internal, parent, sibling, index), `"no-unused-vars": "off"`, `"@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]`. Add `"lint": "eslint . --ext .ts,.tsx"` script to `package.json`.
- [x] T009 [P] Configure Prettier — create `.prettierrc.js` at repo root with: `module.exports = { singleQuote: true, trailingComma: "all", printWidth: 100, tabWidth: 2 };`. Add `"format": "prettier --write \"**/*.{ts,tsx,json,md}\""` script to `package.json`.
- [x] T010 [P] Configure commitlint — create `commitlint.config.js` at repo root with: `module.exports = { extends: ["@commitlint/config-conventional"] };`. Initialize husky with `npx husky init` and create `.husky/commit-msg` file containing `npx --no -- commitlint --edit $1`.
- [x] T011 [P] Configure Jest — create `jest.config.js` at repo root with: preset from `jest-expo`, transform ignore patterns to include `react-native`, `@react-native`, `expo-router`, `zustand`, `@tanstack`, moduleFileExtensions `["ts", "tsx", "js", "jsx", "json"]`, testMatch `["**/__tests__/**/*.test.[jt]s?(x)"]`. Add `"test": "jest"` script to `package.json`.
- [x] T012 Create full directory structure — create all directories from the plan: `app/auth/`, `app/(customer)/home/`, `app/(customer)/favorites/`, `app/(customer)/cart/`, `app/(customer)/checkout/`, `app/(customer)/orders/`, `app/(customer)/profile/`, `app/(chef)/dashboard/`, `app/(chef)/orders/`, `app/(chef)/menu/edit/`, `app/(chef)/schedule/`, `app/(chef)/stats/`, `src/api/seeds/`, `src/components/primitives/`, `src/components/feedback/`, `src/components/layout/`, `src/components/domain/`, `src/design/`, `src/hooks/`, `src/stores/`, `src/i18n/ar/`, `src/i18n/en/`, `src/lib/`, `src/types/`, `__tests__/`, `.github/`. Add empty `.gitkeep` files in directories that would otherwise be empty (like `src/components/primitives/`).
- [x] T013 [P] Create smoke test — create `__tests__/smoke.test.ts` with a single test: `it("renders without crashing", () => { expect(true).toBe(true); })`. Run `npm test` and verify it passes.
- [x] T014 [P] Create PR template — create `.github/pull_request_template.md` with sections: Description, Type of Change (checkboxes: bug fix, new feature, breaking change, refactor), How Has This Been Tested, Checklist (self-review, code style, no new warnings, tests pass).

**Checkpoint**: `npx expo start` launches, `npm run lint` passes, `npm test` passes, `git commit -m "invalid message"` is rejected by commitlint.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T015 Create shared TypeScript types — create `src/types/user.ts` with: `UserRole` type = `'customer' | 'chef'`, `User` interface with fields `id: string`, `phone: string`, `role: UserRole`, `name: string`, `UserSession` interface with fields `userId: string | null`, `role: UserRole | null`, `phone: string | null`, `authenticatedAt: number | null`, `AuthResult` interface with fields `success: boolean`, `user: User | null`, `error: { code: string; message: string } | null`. Export all types. See `specs/001-project-setup/data-model.md` for exact field definitions.
- [x] T016 [P] Create navigation types — create `src/types/navigation.ts` with: `CustomerTab` type = `'home' | 'favorites' | 'cart' | 'orders' | 'profile'`, `ChefTab` type = `'dashboard' | 'orders' | 'menu' | 'schedule' | 'stats'`. Export both types. See `specs/001-project-setup/contracts/navigation.md` for tab definitions.
- [x] T017 Create AsyncStorage wrapper utility — create `src/lib/storage.ts` with: `StorageService` object with three methods: `async getItem<T>(key: string): Promise<T | null>` (reads from AsyncStorage, parses JSON, returns null on error), `async setItem<T>(key: string, value: T): Promise<void>` (stringifies and writes to AsyncStorage), `async removeItem(key: string): Promise<void>` (removes from AsyncStorage). Import AsyncStorage from `@react-native-async-storage/async-storage`. Export `StorageService`. This is the single abstraction over AsyncStorage for the entire app.
- [x] T018 Create React Query client setup — create `src/lib/query-client.tsx` with: `QueryClient` instance from `@tanstack/react-query` configured with `defaultOptions: { queries: { staleTime: 1000 * 60, retry: 1, refetchOnWindowFocus: false } }`. Export the `queryClient` instance and a `QueryClientProvider` wrapper component that wraps children with the provider. This will be used in the root layout.
- [x] T019 Create session store — create `src/stores/session-store.ts` with Zustand store using persist middleware. Store shape: `{ userId: string | null, role: UserRole | null, phone: string | null, authenticatedAt: number | null, hydrated: boolean }` (all start as `null`, `hydrated` starts as `false`). Actions: `login(user: { id: string; phone: string; role: UserRole; name: string })` (sets all fields + authenticatedAt to Date.now()), `logout()` (resets all fields to null). Persist config: key `"nafas-session"`, storage using `createJSONStorage(() => AsyncStorage)` from `zustand/middleware` (Zustand handles JSON serialization/deserialization automatically — do NOT double-serialize), `onRehydrateStorage` callback that sets `hydrated = true` when rehydration completes. Export `useSessionStore` hook and `sessionStore` instance. See `specs/001-project-setup/data-model.md` UserSession entity for exact fields.
- [x] T020 Create seed data for chef users — create `src/api/seeds/users.ts` with: `CHEF_ACCOUNTS` array containing 3 objects: `{ phone: "0100000001", name: "أم سمية", kitchenId: "kitchen-1" }`, `{ phone: "0100000002", name: "حاج محمد", kitchenId: "kitchen-2" }`, `{ phone: "0100000003", name: "ست نونه", kitchenId: "kitchen-3" }`. Export `CHEF_ACCOUNTS`. See `specs/001-project-setup/data-model.md` ChefPhoneNumber seed records.
- [x] T021 Create mock auth API — create `src/api/mock-server.ts` with: `login(phone: string)` function that: (1) validates phone is non-empty and numeric — if not, returns `{ success: false, user: null, error: { code: "INVALID_PHONE", message: "Please enter a valid phone number" } }`, (2) checks if phone matches any entry in `CHEF_ACCOUNTS` — if yes, returns `{ success: true, user: { id: "chef-" + phone, phone, role: "chef" as const, name: matchedChef.name }, error: null }`, (3) otherwise returns `{ success: true, user: { id: "customer-" + phone, phone, role: "customer" as const, name: "Customer" }, error: null }`. Also export `logout()` (calls `sessionStore.getState().logout()`) and `getSession()` (returns `sessionStore.getState()` from `src/stores/session-store.ts`). All return types must match `AuthResult` and `UserSession` from `src/types/user.ts`. See `specs/001-project-setup/contracts/auth-api.md` for exact contract.
- [x] T022 Create minimal design tokens — create `src/design/tokens.ts` with: `lightTokens` object: `{ colors: { background: "#FFFFFF", text: "#1A1A1A", textSecondary: "#666666", primary: "#2E7D32", tabBackground: "#FFFFFF", tabBarInactive: "#999999" } }`, `darkTokens` object: `{ colors: { background: "#121212", text: "#F5F5F5", textSecondary: "#AAAAAA", primary: "#66BB6A", tabBackground: "#1E1E1E", tabBarInactive: "#777777" } }`. Export both objects. Full token system arrives in Phase 2 of the implementation plan; these are the minimal tokens needed to visually distinguish the two shells. See `specs/001-project-setup/plan.md` Constitution Check post-design note.
- [x] T023 Create theme provider — create `src/design/theme.tsx` with: `ThemeContext` using React.createContext, `ThemeProvider` component that: (1) reads `role` from `useSessionStore()`, (2) provides `lightTokens` if role is "customer" or null, `darkTokens` if role is "chef", (3) renders `ThemeProviderContext.Provider` wrapping `children`. Export `ThemeProvider` and `useTheme()` hook that reads from context. Import tokens from `src/design/tokens.ts`.

**Checkpoint**: Foundation ready — all shared types, stores, API, and theme infrastructure in place. User story implementation can now begin.

---

## Phase 3: User Story 1 - First Launch Experience (Priority: P1) 🎯 MVP

**Goal**: A new user opens the app, sees a welcome screen with branding and a phone number input, enters their number, and gets routed to the correct shell based on whether the number is a pre-seeded chef account.

**Independent Test**: Launch the app with no saved session. Verify the welcome screen shows branding and a phone input. Enter a chef number (0100000001) → verify chef shell appears. Enter any other number → verify customer shell appears.

### Implementation for User Story 1

- [x] T024 [US1] Create the welcome screen — create `app/auth/welcome.tsx` with a React component that renders: (1) A centered `SafeAreaView` with the light theme background color, (2) App title "Nafas" in large text, (3) Tagline "Homemade Egyptian Food" below the title, (4) A `TextInput` for phone number with placeholder "Enter phone number", keyboard type "phone-pad", auto-focus, (5) A "Get Started" `Button` that calls `handleLogin`, (6) A `handleLogin` function that: validates the phone input is non-empty and contains only numeric characters (surface `INVALID_PHONE` error for non-numeric input), calls `login(phone)` from `src/api/mock-server.ts`, on success calls `useSessionStore.getState().login(result.user)` then `router.replace("/(customer)/home")` or `router.replace("/(chef)/dashboard")` based on `result.user.role`, on error shows an Alert with the error message. Import `router` from `expo-router`, `useSessionStore` from `src/stores/session-store.ts`, `login` from `src/api/mock-server.ts`, `useTheme` from `src/design/theme.ts`. Style all colors from theme tokens, not hardcoded values.
- [x] T025 [US1] Create auth route group layout — create `app/auth/_layout.tsx` with a `Stack` navigator from `expo-router`. Configure with `screenOptions={{ headerShown: false }}`. This wraps all auth screens (welcome, phone, otp, profile-setup) without a tab bar.
- [x] T026 [P] [US1] Create auth placeholder screens — create three minimal placeholder files so Expo Router doesn't error on missing routes: `app/auth/phone.tsx` with a `View` containing centered text "Phone — Coming in Phase 4", `app/auth/otp.tsx` with a `View` containing centered text "OTP — Coming in Phase 4", `app/auth/profile-setup.tsx` with a `View` containing centered text "Profile Setup — Coming in Phase 4". Each should use theme colors from `useTheme()`.
- [x] T027 [US1] Create the root layout with auth gate — create `app/_layout.tsx` with: (1) `QueryClientProvider` wrapping everything (from `src/lib/query-client.ts`), (2) Inside that, `ThemeProvider` (from `src/design/theme.ts`), (3) Inside that, a `Slot` component from `expo-router`, (4) A `useEffect` that runs on mount and whenever `sessionStore.role` changes: first check `sessionStore.hydrated` — if false, wait (use `onFinishHydration` or a subscription) and call `SplashScreen.preventAutoHideAsync()` to keep splash visible; once hydrated, if `role` is null, call `router.replace("/auth/welcome")`; if role is "customer", call `router.replace("/(customer)/home")`; if role is "chef", call `router.replace("/(chef)/dashboard")`, then call `SplashScreen.hideAsync()`. Use `useRouter()` from `expo-router` and `useSessionStore` from `src/stores/session-store.ts`. Important: use `router.replace()` not `router.push()` to prevent back-stack pollution. The `useEffect` should only redirect when the current path doesn't already match the target.

**Checkpoint**: At this point, User Story 1 should be fully testable — launch the app, see welcome screen, enter phone, get routed to the correct shell. The shells won't have tab navigation yet (that's US2 and US3), but the routing should work without crashing.

---

## Phase 4: User Story 2 - Customer Navigation Shell (Priority: P1)

**Goal**: After signing in as a customer, the user sees a 4-tab bottom navigation (Home, Favorites, Orders, Profile) with a light theme. Tapping each tab switches to a placeholder screen for that section.

**Independent Test**: Sign in with a customer phone number (any non-chef number). Verify 4 tabs appear at the bottom. Tap each tab and verify the correct placeholder screen shows. Verify the light theme (white background, dark text).

### Implementation for User Story 2

- [x] T028 [US2] Create customer tab layout — create `app/(customer)/_layout.tsx` with a `Tabs` navigator from `expo-router`. Configure with `screenOptions` that set: `tabBarActiveTintColor` from light tokens primary color, `tabBarInactiveTintColor` from light tokens tabBarInactive, `tabBarStyle` with `backgroundColor` from light tokens tabBackground, `headerStyle` with `backgroundColor` from light tokens background, `headerTintColor` from light tokens text. Define 4 tabs using `Tabs.Screen`: name "home" with title "Home" and icon "home", name "favorites" with title "Favorites" and icon "heart", name "orders" with title "Orders" and icon "clipboard-list", name "profile" with title "Profile" and icon "user". Use `@expo/vector-icons/Feather` for tab icons. All colors must come from `useTheme()` — do not hardcode hex values.
- [x] T029 [P] [US2] Create customer Home placeholder — create `app/(customer)/home/index.tsx` with a `View` containing centered `Text` saying "Home — Coming Soon". Apply `flex: 1, justifyContent: "center", alignItems: "center"`, background and text colors from theme. This is a placeholder; real content comes in Phase 5.
- [x] T030 [P] [US2] Create customer Favorites placeholder — create `app/(customer)/favorites/index.tsx` with a `View` containing centered `Text` saying "Favorites — Coming Soon". Same styling pattern as T029.
- [x] T031 [P] [US2] Create customer Cart placeholder — create `app/(customer)/cart/index.tsx` with a `View` containing centered `Text` saying "Cart — Coming Soon". Same styling pattern as T029.
- [x] T032 [P] [US2] Create customer Checkout placeholder — create `app/(customer)/checkout/index.tsx` with a `View` containing centered `Text` saying "Checkout — Coming Soon". Same styling pattern as T029.
- [x] T033 [P] [US2] Create customer Orders placeholder — create `app/(customer)/orders/index.tsx` with a `View` containing centered `Text` saying "Orders — Coming Soon". Same styling pattern as T029.
- [x] T034 [P] [US2] Create customer Order Detail placeholder — create `app/(customer)/orders/[id].tsx` with a `View` containing centered `Text` saying "Order Detail — Coming Soon". Use `useLocalSearchParams()` from expo-router to read the `id` param and display it. Same styling pattern as T029.
- [x] T035 [P] [US2] Create customer Profile placeholder — create `app/(customer)/profile/index.tsx` with a `View` containing centered `Text` saying "Profile — Coming Soon" plus a "Sign Out" `Button` that calls `logout()` from `src/api/mock-server.ts` then `router.replace("/auth/welcome")`. Same styling pattern as T029.
- [x] T036 [US2] Create customer Kitchen Detail placeholder — create `app/(customer)/home/kitchen/[id].tsx` with a `View` containing centered `Text` saying "Kitchen Detail — Coming Soon". Use `useLocalSearchParams()` from expo-router to read the `id` param. Same styling pattern as T029. This route is nested under the Home tab.

**Checkpoint**: Sign in as a customer → 4-tab navigation appears with light theme → each tab navigable → placeholder screens visible. Customer shell is fully functional.

---

## Phase 5: User Story 3 - Chef Navigation Shell (Priority: P1)

**Goal**: After signing in as a chef, the user sees a 5-tab bottom navigation (Dashboard, Orders, Menu, Schedule, Stats) with a dark theme. Tapping each tab switches to a placeholder screen for that section.

**Independent Test**: Sign in with a chef phone number (0100000001). Verify 5 tabs appear at the bottom. Tap each tab and verify the correct placeholder screen shows. Verify the dark theme (dark background, light text).

### Implementation for User Story 3

- [x] T037 [US3] Create chef tab layout — create `app/(chef)/_layout.tsx` with a `Tabs` navigator from `expo-router`. Configure with `screenOptions` that set: `tabBarActiveTintColor` from dark tokens primary color, `tabBarInactiveTintColor` from dark tokens tabBarInactive, `tabBarStyle` with `backgroundColor` from dark tokens tabBackground, `headerStyle` with `backgroundColor` from dark tokens background, `headerTintColor` from dark tokens text. Define 5 tabs using `Tabs.Screen`: name "dashboard" with title "Dashboard" and icon "grid", name "orders" with title "Orders" and icon "clipboard-list", name "menu" with title "Menu" and icon "book-open", name "schedule" with title "Schedule" and icon "calendar", name "stats" with title "Stats" and icon "bar-chart". Use `@expo/vector-icons/Feather` for tab icons. All colors must come from `useTheme()` — do not hardcode hex values.
- [x] T038 [P] [US3] Create chef Dashboard placeholder — create `app/(chef)/dashboard/index.tsx` with a `View` containing centered `Text` saying "Dashboard — Coming Soon". Apply `flex: 1, justifyContent: "center", alignItems: "center"`, background and text colors from theme. This is a placeholder; real content comes in Phase 9.
- [x] T039 [P] [US3] Create chef Orders placeholder — create `app/(chef)/orders/index.tsx` with a `View` containing centered `Text` saying "Chef Orders — Coming Soon". Same styling pattern as T038.
- [x] T040 [P] [US3] Create chef Order Detail placeholder — create `app/(chef)/orders/[id].tsx` with a `View` containing centered `Text` saying "Chef Order Detail — Coming Soon". Use `useLocalSearchParams()` from expo-router to read the `id` param. Same styling pattern as T038.
- [x] T041 [P] [US3] Create chef Menu placeholder — create `app/(chef)/menu/index.tsx` with a `View` containing centered `Text` saying "Menu — Coming Soon". Same styling pattern as T038.
- [x] T042 [P] [US3] Create chef Edit Dish placeholder — create `app/(chef)/menu/edit/[dishId].tsx` with a `View` containing centered `Text` saying "Edit Dish — Coming Soon". Use `useLocalSearchParams()` from expo-router to read the `dishId` param. Same styling pattern as T038.
- [x] T043 [P] [US3] Create chef Schedule placeholder — create `app/(chef)/schedule/index.tsx` with a `View` containing centered `Text` saying "Schedule — Coming Soon". Same styling pattern as T038.
- [x] T044 [P] [US3] Create chef Stats placeholder — create `app/(chef)/stats/index.tsx` with a `View` containing centered `Text` saying "Stats — Coming Soon". Same styling pattern as T038.

**Checkpoint**: Sign in as a chef → 5-tab navigation appears with dark theme → each tab navigable → placeholder screens visible. Chef shell is fully functional.

---

## Phase 6: User Story 4 - Session Persistence and Route Guarding (Priority: P2)

**Goal**: A returning user bypasses the welcome screen. Cross-role navigation is blocked. Corrupted sessions gracefully fall back to the welcome screen.

**Independent Test**: Sign in → close the app → reopen → verify you land in the correct shell without re-authenticating. Try navigating to a chef route as a customer → verify redirect. Corrupt session data in AsyncStorage → verify fallback to welcome.

### Implementation for User Story 4

- [x] T045 [US4] Add session validation to session store — update `src/stores/session-store.ts` to add a `validateSession` function that: (1) reads the current state, (2) if `userId` is null but `role` is not null (or vice versa), clears the session and returns `false`, (3) if any field is `undefined` (not `null`, but actually `undefined`), clears the session and returns `false`, (4) otherwise returns `true`. Call this function in the store's `onRehydrateStorage` callback — if validation fails, the store resets to initial state. This handles corrupted or partial session data per FR-013.
- [x] T046 [US4] Implement route guard logic in root layout — update `app/_layout.tsx` to enhance the auth gate `useEffect` with route guarding: (1) Get the current pathname using `usePathname()` from expo-router, (2) If session exists and pathname starts with `/auth/`, redirect to the role-matched shell home, (3) If session has role "customer" and pathname starts with `/(chef)/`, redirect to `/(customer)/home`, (4) If session has role "chef" and pathname starts with `/(customer)/`, redirect to `/(chef)/dashboard`, (5) If no session and pathname does NOT start with `/auth/`, redirect to `/auth/welcome`. Use `router.replace()` for all redirects. This implements FR-006 and FR-007.
- [x] T047 [US4] Verify session persistence works end-to-end — test the following scenarios manually: (1) Sign in as customer → close and reopen app → verify customer shell appears without welcome screen, (2) Sign in as chef → close and reopen app → verify chef shell appears, (3) While signed in as customer, try navigating to `/(chef)/dashboard` via router → verify redirect to `/(customer)/home`, (4) Sign out → verify welcome screen appears. No code changes needed — this is verification only. Fix any issues found.

**Checkpoint**: Session persists across app restarts. Route guards block cross-role navigation. Corrupted sessions fall back gracefully.

---

## Phase 7: User Story 5 - Developer Workflow Foundation (Priority: P2)

**Goal**: Developers have enforced linting, formatting, commit conventions, and a working test framework. Code style violations are caught, non-conventional commits are rejected, and the test suite runs.

**Independent Test**: Run `npm run lint` and verify it reports errors. Run `npm run format` and verify it fixes style. Try a commit with message "bad" and verify it's rejected. Run `npm test` and verify it passes.

### Implementation for User Story 5

- [x] T048 [US5] Verify ESLint catches violations — create a temporary file with a known lint violation (e.g., unused variable), run `npm run lint`, verify the violation is reported, then delete the temporary file. If ESLint is not catching violations, debug the `.eslintrc.js` configuration from T008. This is verification only.
- [x] T049 [US5] Verify Prettier formatting works — run `npm run format` on the codebase and verify it formats files correctly. Check that `.prettierrc.js` settings (single quotes, trailing commas, 100 char width) are applied. This is verification only.
- [x] T050 [US5] Verify commitlint rejects bad messages — make a commit with message "bad message" and verify it is rejected by the husky commit-msg hook. Then make a commit with a conventional message like "chore: verify commitlint setup" and verify it succeeds. This is verification only.
- [x] T051 [US5] Verify Jest test framework works — run `npm test` and verify the smoke test from T013 passes. Also verify that `jest.config.js` correctly resolves TypeScript test files. This is verification only.
- [x] T052 [P] [US5] Create deep link route handler — create `app/payment-return.tsx` with a component that: (1) reads search params using `useLocalSearchParams()` from expo-router, (2) if no session exists, redirects to `/auth/welcome`, (3) if chef session, redirects to `/(chef)/dashboard`, (4) if customer session, displays a simple "Payment Return — status: {params.status}, orderId: {params.orderId}" message. This is a placeholder route that registers the `nafas://payment-return` deep link in the Expo Router. No actual payment logic. See `specs/001-project-setup/contracts/navigation.md` Deep Link Validation section.

**Checkpoint**: `npm run lint` catches violations, `npm run format` works, commitlint rejects bad messages, `npm test` passes. Developer workflow is fully functional.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and verification

- [x] T053 [P] Create settings store — create `src/stores/settings-store.ts` with a simple Zustand store (not persisted yet — persistence added in Phase 2 when i18n is set up): `{ language: "en" as "en" | "ar" }`, action `setLanguage(lang)`. Export `useSettingsStore`. This is a placeholder for Phase 2 i18n support.
- [x] T054 [P] Create auth hook — create `src/hooks/use-auth.ts` with a custom hook `useAuth()` that: (1) reads session from `useSessionStore()`, (2) provides `isAuthenticated` boolean (true when userId is not null), (3) provides `role` from session, (4) provides `login` function that calls `login(phone)` from mock-server then `sessionStore.getState().login(user)`, (5) provides `logout` function that calls `logout()` from mock-server. Export `useAuth`. This wraps the auth API and store for cleaner component usage.
- [x] T055 Run full verification — go through the quickstart.md verification checklist at `specs/001-project-setup/quickstart.md`. Verify every item: app launches, lint passes, tests pass, welcome screen shows, phone auth routes correctly, both shells render with correct themes, session persists, all placeholder screens show their section names. Fix any issues found.
- [x] T056 Delete the original `App.js` or `app/index.js` — the `create-expo-app` template may have generated a default `App.js` or `app/index.js`. Since we use Expo Router with `app/_layout.tsx`, remove any conflicting entry files at the repo root to prevent "multiple entry point" errors.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational — MVP target
- **User Story 2 (Phase 4)**: Depends on US1 (needs auth gate routing to work)
- **User Story 3 (Phase 5)**: Depends on US1 (needs auth gate routing to work) — can run in parallel with US2
- **User Story 4 (Phase 6)**: Depends on US1 + US2 + US3 (needs both shells to exist for route guarding)
- **User Story 5 (Phase 7)**: Depends on Setup only — can start after Phase 1
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational — no other story dependencies
- **US2 (P1)**: Depends on US1 (auth gate must route to customer shell)
- **US3 (P1)**: Depends on US1 (auth gate must route to chef shell) — **can parallel with US2**
- **US4 (P2)**: Depends on US1 + US2 + US3 (needs both shells for guard testing)
- **US5 (P2)**: Depends on Setup only — **can parallel with US1–US4**

### Within Each User Story

- Types and models before stores
- Stores before API layer
- API layer before UI screens
- Layout components before screen components
- Core implementation before integration

### Parallel Opportunities

- T003, T004 (install dependencies) — parallel after T001
- T007, T008, T009, T010, T011, T013, T014 (config files) — all parallel after T001
- T015, T016 (type files) — parallel
- T026 (placeholder screens) — parallel within US1
- T029–T036 (customer placeholders) — all parallel after T028
- T038–T044 (chef placeholders) — all parallel after T037
- US2 and US3 can be worked on in parallel (different route groups, different files)
- US5 can be worked on in parallel with US2/US3/US4

---

## Parallel Example: User Story 2 + User Story 3

```bash
# After US1 completes, these can run in parallel:
# Developer A: Customer shell (US2)
Task: "T028 Create customer tab layout in app/(customer)/_layout.tsx"
Task: "T029 Create customer Home placeholder in app/(customer)/home/index.tsx"
Task: "T030 Create customer Favorites placeholder in app/(customer)/favorites/index.tsx"
# ... (T031-T036)

# Developer B: Chef shell (US3)
Task: "T037 Create chef tab layout in app/(chef)/_layout.tsx"
Task: "T038 Create chef Dashboard placeholder in app/(chef)/dashboard/index.tsx"
Task: "T039 Create chef Orders placeholder in app/(chef)/orders/index.tsx"
# ... (T040-T044)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (First Launch + Auth)
4. **STOP and VALIDATE**: Test that entering a phone number routes to the correct shell
5. Demo if ready — even without tab navigation, the auth routing works

### Recommended Delivery Order

1. Setup + Foundational → Foundation ready
2. Add US1 (Auth + Welcome) → App boots, auth works → **MVP**
3. Add US2 (Customer Shell) + US3 (Chef Shell) in parallel → Full navigation
4. Add US4 (Session Persistence + Guards) → Production-ready session handling
5. Add US5 (Dev Tooling Verification) → Confidence in workflow
6. Polish → Clean codebase

### Parallel Team Strategy

1. Everyone completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 → US2 → US4
   - Developer B: US3 → US5
3. US4 requires both shells (US2 + US3) to be complete before testing

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All colors must come from `useTheme()` / design tokens — never hardcode hex values
- All placeholder screens use the same pattern: centered "Section Name — Coming Soon" text with theme colors
- The `app/` directory is for Expo Router file-based routes only — all shared logic goes in `src/`
- When implementing, follow the exact file paths specified in each task
