# Nafas MVP — Implementation Plan

**Project**: Nafas (نَفَس — "breath") — React Native Mobile App (Frontend Only)  
**Tech**: Expo (managed) + TypeScript + Expo Router + React Query + Zustand  
**Last updated**: 2026-04-11  
**Constitution**: `.specify/memory/constitution.md` v1.0.0

---

## 1. Overview

Nafas connects customers with homemakers who cook homemade Egyptian food. This is a **frontend-only MVP** with a mock API simulating a production backend, enabling realistic demos and rapid iteration toward a real backend.

The app ships two role-based shells in one codebase:

- **Customer (عميل)**: Light theme — browse, cart, checkout, orders, favorites, reorder
- **Chef (صانعة طعام)**: Dark theme — dashboard, orders, menu CRUD, schedule, analytics

---

## 2. Key Decisions (Resolved)

| Item              | Decision                                                                      |
| ----------------- | ----------------------------------------------------------------------------- |
| Chef access       | Pre-seeded phone numbers in mock DB → auto-land in chef shell. No dev toggle. |
| Favorites storage | Mock DB + React Query (server state pattern)                                  |
| Language switch   | Full app reload with confirmation dialog                                      |
| Review creation   | Read-only for MVP (display seeded reviews only)                               |
| Payment mock      | Instant simulation dialog (Success/Fail modal) — no WebView                   |
| Delivery fee      | Flat fee per order (single line item)                                         |
| Signup fields     | Name + Area (customer only; chef accounts pre-seeded)                         |
| Search scope      | Kitchen name + dish name                                                      |
| Reorder edge case | Skip unavailable items + show toast notification                              |
| Location areas    | Real Cairo neighborhoods (Maadi, Zamalek, Heliopolis, Nasr City, etc.)        |
| Testing           | Jest + RNTL for critical logic only (cart, order pipeline, persistence)       |
| Chef analytics    | Custom bar chart components (no chart library)                                |
| Customer profile  | Minimal: name, phone, area (read-only), language toggle, logout               |
| Git conventions   | Branch naming (`feature/XXX-name`), conventional commits, PR template         |
| i18n direction    | Full app restart on language change, clearly communicated                     |

---

## 3. Project Structure

```
nafas/
├── app/                          # Expo Router file-based routing
│   ├── auth/                   # Auth shell (no tabs)
│   │   ├── welcome.tsx
│   │   ├── phone.tsx
│   │   ├── otp.tsx
│   │   └── profile-setup.tsx
│   ├── customer/               # Customer shell (tab layout)
│   │   ├── _layout.tsx           # Tab navigator + light theme
│   │   ├── home/
│   │   │   ├── index.tsx
│   │   │   └── kitchen/[id].tsx
│   │   ├── favorites/
│   │   │   └── index.tsx
│   │   ├── cart/
│   │   │   └── index.tsx
│   │   ├── checkout/
│   │   │   └── index.tsx
│   │   ├── orders/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   └── profile/
│   │       └── index.tsx
│   ├── chef/                   # Chef shell (tab layout)
│   │   ├── _layout.tsx           # Tab navigator + dark theme
│   │   ├── dashboard/
│   │   │   └── index.tsx
│   │   ├── orders/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   ├── menu/
│   │   │   ├── index.tsx
│   │   │   └── edit/[dishId].tsx
│   │   ├── schedule/
│   │   │   └── index.tsx
│   │   └── stats/
│   │       └── index.tsx
│   ├── _layout.tsx               # Root layout: auth gate + theme provider
│   └── payment-return.tsx        # Deep link handler (nafas://payment-return)
├── src/
│   ├── api/                      # Mock API layer
│   │   ├── mock-server.ts        # API contract functions
│   │   ├── mock-db.ts            # Persisted mock DB (AsyncStorage)
│   │   ├── seeds/                # Static seed data
│   │   │   ├── kitchens.ts
│   │   │   ├── dishes.ts
│   │   │   ├── reviews.ts
│   │   │   ├── users.ts
│   │   │   ├── schedules.ts
│   │   │   └── orders.ts
│   │   └── types.ts              # API request/response types
│   ├── components/               # Shared UI components
│   │   ├── primitives/           # Button, Input, Text, Card, Badge, Divider, Icon
│   │   ├── feedback/             # Skeleton, EmptyState, ErrorState, Toast
│   │   ├── layout/               # ScreenContainer, Section, BottomNav
│   │   └── domain/              # KitchenCard, DishCard, OrderCard, Timeline, etc.
│   ├── design/                   # Design system
│   │   ├── tokens.ts            # Colors, spacing, typography, radius
│   │   ├── theme.ts             # Theme provider (light/dark)
│   │   └── typography.ts        # Font families + scale
│   ├── hooks/                    # React Query hooks
│   │   ├── use-auth.ts
│   │   ├── use-kitchens.ts
│   │   ├── use-kitchen-detail.ts
│   │   ├── use-orders.ts
│   │   ├── use-favorites.ts
│   │   ├── use-chef-orders.ts
│   │   ├── use-chef-menu.ts
│   │   ├── use-chef-schedule.ts
│   │   └── use-chef-stats.ts
│   ├── stores/                   # Zustand stores
│   │   ├── session-store.ts
│   │   ├── cart-store.ts
│   │   └── settings-store.ts
│   ├── i18n/                     # Internationalization
│   │   ├── index.ts
│   │   ├── ar/
│   │   │   └── common.json
│   │   └── en/
│   │       └── common.json
│   ├── lib/                      # Utilities
│   │   ├── query-client.ts
│   │   ├── storage.ts            # AsyncStorage wrapper
│   │   └── payment.ts            # Payment simulation logic
│   └── types/                    # Shared TypeScript types
│       ├── order.ts
│       ├── kitchen.ts
│       ├── dish.ts
│       ├── user.ts
│       └── navigation.ts
├── __tests__/                    # Critical logic tests
│   ├── cart-store.test.ts
│   ├── order-pipeline.test.ts
│   └── persistence.test.ts
├── docs/
│   └── implementation-plan.md    # This file
├── app.config.ts
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc.js
└── package.json
```

---

## 4. Implementation Phases

### Phase 1: Project Setup (Area A)

**Goal**: Bootable app with routing, guards, and Git conventions.

| ID   | Task                     | Details                                                                         |
| ---- | ------------------------ | ------------------------------------------------------------------------------- |
| T001 | Initialize Expo app      | `npx create-expo-app nafas --template blank-typescript`                         |
| T002 | Configure app.config.ts  | Scheme `nafas://`, app name, placeholder icons/splash                           |
| T003 | Add lint/format tooling  | ESLint + Prettier + import sorting + TypeScript strict                          |
| T004 | Git conventions          | Branch naming rules, commitlint, PR template in `.github/`                      |
| T005 | Testing scaffold         | Jest + RNTL configured, one smoke test passing                                  |
| T006 | Expo Router setup        | Install expo-router, configure file-based routing                               |
| T007 | Route group structure    | Create `(auth)/`, `(customer)/`, `(chef)/` directories with placeholder screens |
| T008 | Auth gate + route guards | Root `_layout.tsx`: no session → auth; role mismatch → correct shell            |
| T009 | Customer tab layout      | `_layout.tsx` with tabs: Home, Favorites, Orders, Profile                       |
| T010 | Chef tab layout          | `_layout.tsx` with tabs: Dashboard, Orders, Menu, Schedule, Stats               |

**Exit criteria**: App boots → lands on Welcome (no session) → mock login → lands in correct shell. Chef phone routes to chef tabs. Customer phone routes to customer tabs.

---

### Phase 2: Design System + i18n (Area B Foundation)

**Goal**: Theme tokens, core components, and bilingual RTL/LTR working.

| ID   | Task                         | Details                                                                                                                                  |
| ---- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| T011 | Design tokens from design.md | `tokens.ts`: Nafas palette (cream/clay/saffron/oud/bark/smoke/mint/rose), warm shadows, both palettes, spacing, typography scale, radius |
| T012 | Theme provider               | `theme.ts`: reads role from session store, provides light or dark Nafas token set                                                        |
| T013 | Typography setup             | Tajawal (Arabic display) + Noto Sans Arabic (Arabic body) + Cormorant Garamond (numeral) loaded via @expo-google-fonts                   |
| T014 | Icon standardization         | Pick one icon set (e.g., `@expo/vector-icons`/Feather), wrap in themed Icon component                                                    |
| T015 | Primitives                   | Button, Input, Text, Card, Badge, Divider — all token-driven, theme-aware                                                                |
| T016 | Screen container             | Safe-area handling, background from theme, scroll behavior                                                                               |
| T017 | Feedback components          | Skeleton (list + detail variants), EmptyState (with CTA), ErrorState (with retry), Toast                                                 |
| T018 | i18n setup                   | i18next + react-i18next, `ar/common.json` (Egyptian dialect), `en/common.json` structure                                                 |
| T019 | RTL/LTR handling             | I18nManager direction on language change, full reload with confirmation dialog                                                           |
| T020 | Language toggle              | Settings screen: language picker, persisted in settings store                                                                            |
| T021 | RTL verification pass        | Verify all primitives render correctly in both directions                                                                                |

**Exit criteria**: Switching language to Arabic reloads app in RTL. All primitives render correctly in both themes. No hardcoded colors or magic numbers.

---

### Phase 3: State Architecture + Mock API (Area B Foundation)

**Goal**: Zustand stores, mock DB with persistence, React Query hooks — cross-role consistency working.

| ID   | Task                              | Details                                                                                                             |
| ---- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| T022 | Storage utility                   | AsyncStorage wrapper with type-safe get/set/remove                                                                  |
| T023 | sessionStore                      | User ID, role, phone — persisted                                                                                    |
| T024 | cartStore                         | Kitchen groups, items with quantities, schedule (ASAP/Today/Tomorrow), instructions, delivery fee — persisted       |
| T025 | settingsStore                     | Language preference — persisted                                                                                     |
| T026 | Mock DB core                      | In-memory state initialized from seeds, persisted to AsyncStorage, read/write API                                   |
| T027 | Seed data — users                 | Customer accounts + pre-seeded chef accounts (known phone numbers)                                                  |
| T028 | Seed data — kitchens              | 6–8 kitchens with Cairo areas (Maadi, Zamalek, Heliopolis, Nasr City, Dokki, Mohandessin, New Cairo, 6th October)   |
| T029 | Seed data — dishes                | 4–8 dishes per kitchen, with categories, prices, prep times, stock levels                                           |
| T030 | Seed data — reviews               | 3–5 reviews per kitchen, text + rating                                                                              |
| T031 | Seed data — schedules             | Weekly schedule per kitchen                                                                                         |
| T032 | Seed data — orders                | 2–3 sample orders (various statuses)                                                                                |
| T033 | Mock server — auth endpoints      | `login(phone, otp)`, `signup(name, area, phone)` — OTP fixed `123456`                                               |
| T034 | Mock server — kitchen endpoints   | `getKitchens(filters)`, `getKitchenDetail(id)`, `searchKitchens(query)`                                             |
| T035 | Mock server — menu + reviews      | `getMenu(kitchenId)`, `getReviews(kitchenId)`                                                                       |
| T036 | Mock server — favorites           | `getFavorites(userId)`, `followKitchen(userId, kitchenId)`, `unfollowKitchen(userId, kitchenId)`                    |
| T037 | Mock server — order endpoints     | `createOrder(...)`, `getOrders(userId)`, `getOrderDetail(orderId)`, `reorder(orderId)`                              |
| T038 | Mock server — chef endpoints      | `getChefOrders(chefId)`, `updateOrderStatus(orderId, status)`, `acceptOrder(orderId)`, `rejectOrder(orderId)`       |
| T039 | Mock server — chef menu CRUD      | `getChefMenu(chefId)`, `createDish(...)`, `updateDish(...)`, `deleteDish(dishId)`, `toggleDishAvailability(dishId)` |
| T040 | Mock server — chef schedule       | `getChefSchedule(chefId)`, `updateChefSchedule(chefId, schedule)`                                                   |
| T041 | Mock server — chef stats          | `getChefStats(chefId)` — weekly income, orders, repeat %, top dish                                                  |
| T042 | Mock server — simulated latency   | 200–900ms random delay on all calls                                                                                 |
| T043 | Mock server — error injection     | Toggleable random failures (default OFF, dev setting)                                                               |
| T044 | Query client setup                | TanStack Query provider, default options (staleTime, retry)                                                         |
| T045 | React Query hooks — auth          | `useLogin`, `useSignup`                                                                                             |
| T046 | React Query hooks — kitchens      | `useKitchens`, `useKitchenDetail`, `useSearchKitchens`                                                              |
| T047 | React Query hooks — favorites     | `useFavorites`, `useFollowKitchen`, `useUnfollowKitchen`                                                            |
| T048 | React Query hooks — orders        | `useCreateOrder`, `useOrders`, `useOrderDetail`, `useReorder`                                                       |
| T049 | React Query hooks — chef orders   | `useChefOrders`, `useUpdateOrderStatus`, `useAcceptOrder`, `useRejectOrder`                                         |
| T050 | React Query hooks — chef menu     | `useChefMenu`, `useCreateDish`, `useUpdateDish`, `useDeleteDish`, `useToggleAvailability`                           |
| T051 | React Query hooks — chef schedule | `useChefSchedule`, `useUpdateChefSchedule`                                                                          |
| T052 | React Query hooks — chef stats    | `useChefStats`                                                                                                      |

**Exit criteria**: Customer places order → chef sees it. Chef updates status → customer timeline updates. Kill and relaunch app → data persists.

---

### Phase 4: Auth Flow (Area C)

**Goal**: Working login/signup with OTP, session persistence, chef routing.

| ID   | Task                 | Details                                                                                                        |
| ---- | -------------------- | -------------------------------------------------------------------------------------------------------------- |
| T053 | Welcome screen       | App logo, tagline, "Get Started" CTA, language toggle                                                          |
| T054 | Phone screen         | Phone number input, validation, "Send OTP"                                                                     |
| T055 | OTP screen           | 6-digit input, fixed `123456`, resend, verify                                                                  |
| T056 | Profile setup screen | Name + area selector (customer only, shown on signup)                                                          |
| T057 | Auth logic           | Signup → creates customer in mock DB. Login → checks if phone is pre-seeded chef → routes accordingly          |
| T058 | Session persistence  | On successful auth, store session in sessionStore + AsyncStorage. On app launch, restore session and skip auth |

**Exit criteria**: New phone → signup (customer) → customer shell. Pre-seeded chef phone → login → chef shell. Kill app → relaunch → session restored.

---

### Phase 5: Customer Core — Browse + Kitchen (Area C)

**Goal**: Home discovery, search, kitchen detail with add-to-cart.

| ID   | Task                   | Details                                                                                             |
| ---- | ---------------------- | --------------------------------------------------------------------------------------------------- |
| T059 | Area selector          | Dropdown/sheet with Cairo neighborhoods, persisted in settings                                      |
| T060 | Home screen layout     | Area selector, search bar, filter chips, sections (Now Open, Today's Menu, Top Rated, New Kitchens) |
| T061 | KitchenCard component  | Image, name, rating, cuisine tags, open/closed badge, verified badge                                |
| T062 | Search implementation  | Filters kitchens + dishes by name matching query string                                             |
| T063 | Filter implementation  | Category, open now, rating, verified — updates query params                                         |
| T064 | Kitchen detail header  | Cover image, name, bio, badges, follow/unfollow button, rating, schedule (collapsible)              |
| T065 | Kitchen detail menu    | Dish list: DishCard with name, description, price, add-to-cart, low stock indicator                 |
| T066 | Kitchen detail reviews | Review list (read-only): username, rating, text, date                                               |
| T067 | Add-to-cart from menu  | Tap "+" on DishCard → adds to cartStore under correct kitchen group, shows floating cart button     |

**Exit criteria**: Browse home → search by name → open kitchen → add dishes to cart. Follow kitchen appears in favorites. All states (loading, empty, error) work.

---

### Phase 6: Customer Core — Cart + Checkout + Orders (Area C)

**Goal**: End-to-end customer ordering flow.

| ID   | Task                     | Details                                                                                                                                                               |
| ---- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T068 | Cart screen              | Items grouped by kitchen, quantity +/- controls, schedule selector (ASAP/Today/Tomorrow), instructions input, totals breakdown (subtotal + flat delivery fee + total) |
| T069 | Cart empty state         | "Your cart is empty" → CTA to Home                                                                                                                                    |
| T070 | Checkout screen          | Address form (manual, required), payment method selector, order summary, "Place Order"                                                                                |
| T071 | Cash payment flow        | Default method, optional "Pay with X EGP" input, places order directly                                                                                                |
| T072 | Vodafone Cash simulation | On selection → simulation dialog (Success/Fail), on success → mark order paid, navigate to order detail                                                               |
| T073 | InstaPay simulation      | Same as Vodafone Cash — simulation dialog                                                                                                                             |
| T074 | Payment deep link route  | `payment-return.tsx` wired in router for future real provider use                                                                                                     |
| T075 | Payment fallback         | "Try again" / "Back to order" on failure                                                                                                                              |
| T076 | Orders list screen       | Tabs: Active / Past. OrderCard: kitchen names, total, status badge, date                                                                                              |
| T077 | Order detail screen      | Status timeline, items breakdown, delivery address, payment info                                                                                                      |
| T078 | Timeline component       | Visual step indicator: confirmed → preparing → cooking → ready → on_the_way → delivered + cancelled                                                                   |
| T079 | Reorder action           | On delivered orders → adds available items to cart, skips unavailable with toast notification, navigates to cart                                                      |

**Exit criteria**: Add items to cart → checkout with cash → order appears in Active orders. Timeline shows correct status. Reorder rebuilds cart (skipping unavailable items).

---

### Phase 7: Favorites + Profile (Area C)

**Goal**: Favorites management and profile/settings.

| ID   | Task             | Details                                                                                                  |
| ---- | ---------------- | -------------------------------------------------------------------------------------------------------- |
| T080 | Favorites screen | Two sections: "Open Now" (full) and "Closed" (dimmed). Kitchen cards with unfollow action                |
| T081 | Favorites sync   | Follow from kitchen detail → appears in favorites. Unfollow → removed. Data from mock DB via React Query |
| T082 | Profile screen   | Name, phone, area (read-only), language toggle with restart confirmation, logout button                  |

**Exit criteria**: Follow kitchen → appears in favorites Open/Closed correctly. Change language → app reloads in correct direction. Logout → returns to auth.

---

### Phase 8: Chef Core — Orders + Menu (Area C)

**Goal**: Chef can manage incoming orders and menu items.

| ID   | Task                     | Details                                                                                                                  |
| ---- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| T083 | Chef incoming orders     | List of pending orders with Accept/Reject actions                                                                        |
| T084 | Chef order detail        | Full order info + status progression buttons (confirmed → preparing → cooking → ready → on_the_way → delivered) + cancel |
| T085 | Chef order status update | Tapping status button updates mock DB → customer timeline reflects change                                                |
| T086 | Chef menu list           | All dishes with availability toggle switch, add dish FAB                                                                 |
| T087 | Chef menu add/edit form  | AR/EN name + description, price, category, prep time, max portions, availability, placeholder image picker               |
| T088 | Chef menu delete         | Swipe or long-press to delete with confirmation                                                                          |
| T089 | Chef menu sync           | Changes reflected in customer kitchen detail (same mock DB, React Query invalidation)                                    |

**Exit criteria**: Chef accepts order → customer sees "confirmed". Chef advances status → customer timeline updates. Chef adds/edits dish → customer menu reflects it.

---

### Phase 9: Chef Core — Schedule + Dashboard + Stats (Area C)

**Goal**: Complete chef feature set.

| ID   | Task                   | Details                                                                              |
| ---- | ---------------------- | ------------------------------------------------------------------------------------ |
| T090 | Weekly schedule editor | Day-by-day: open/closed toggle, open time, close time, available dishes per day      |
| T091 | Schedule sync          | Changes reflected in customer kitchen schedule section                               |
| T092 | Chef dashboard         | Today's income, today's orders count, avg rating, quick action buttons to other tabs |
| T093 | Analytics screen       | Weekly income/orders bar chart, repeat customer %, top dish — custom bar components  |
| T094 | Analytics RTL          | Charts render correctly in both RTL and LTR                                          |

**Exit criteria**: Chef edits schedule → customer sees updated hours. Dashboard shows mock stats. Analytics bars render in both directions.

---

### Phase 10: Polish + QA Pass (Cross-cutting)

**Goal**: All screens meet the quality gates from the constitution.

| ID   | Task                        | Details                                                                               |
| ---- | --------------------------- | ------------------------------------------------------------------------------------- |
| T095 | Loading states audit        | Every list and detail screen has skeleton loading                                     |
| T096 | Empty states audit          | Every screen has empty state with next-action CTA                                     |
| T097 | Error states audit          | Every API-backed screen has error state with retry                                    |
| T098 | RTL edge case pass          | Test every screen in Arabic RTL: icons, layout, text alignment, timelines, charts     |
| T099 | Accessibility pass          | 44pt touch targets, contrast ratios, readable font sizes                              |
| T100 | Performance pass            | FlatList optimizations (keyExtractor, windowSize), memoized cards, image optimization |
| T101 | Critical logic tests        | Cart calculations, order status pipeline, state persistence                           |
| T102 | Mock error injection test   | Enable random failures → verify all screens handle errors gracefully                  |
| T103 | End-to-end demo walkthrough | Full customer + chef flow on single device                                            |

**Exit criteria**: Every screen passes the Definition of Done from the constitution.

---

## 5. Quality Gates (Per Screen — Constitution §10)

A screen is **done** when:

1. Uses shared components/tokens exclusively (no hardcoded styles)
2. Supports Arabic + English strings
3. Works in both RTL and LTR
4. Has loading + empty + error UI states
5. Does not crash on missing or partial mock data
6. Navigation in/out of the screen is correct
7. All relevant state persists (where expected)

---

## 6. Seed Data Summary

### Cairo Neighborhoods

Maadi, Zamalek, Heliopolis, Nasr City, Dokki, Mohandessin, New Cairo, 6th October

### Chef Accounts (Pre-Seeded)

| Phone      | Name     | Kitchen               |
| ---------- | -------- | --------------------- |
| 0100000001 | أم سمية  | Umm Samia's Kitchen   |
| 0100000002 | حاج محمد | Haj Mohamed's Kitchen |
| 0100000003 | ست نونه  | Sit Nona's Kitchen    |

### Mock OTP

Any phone number → OTP is always `123456`

---

## 7. Order Status Pipeline

```
confirmed → preparing → cooking → ready → on_the_way → delivered

cancelled (terminal, from any pre-delivery status)
```

- Chef: can advance statuses + cancel
- Customer: sees timeline visualization
- Cart: supports multiple kitchens → one combined order with kitchen sub-orders
- Schedule: ASAP | Today | Tomorrow (no time slots)

---

## 8. Payment Flow

| Method           | Flow                                                                                           |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| Cash (default)   | Optional "Pay with X EGP" input → place order → order detail                                   |
| Vodafone Cash    | Simulation dialog (Success/Fail) → on success mark paid → order detail                         |
| InstaPay         | Simulation dialog (Success/Fail) → on success mark paid → order detail                         |
| Failure fallback | "Try again" / "Back to order" options                                                          |
| Deep link route  | `nafas://payment-return?status=success&orderId=XYZ` wired for future real provider integration |

---

## 9. Risks & Mitigations

| Risk                     | Mitigation                                                                                |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| RTL layout edge cases    | Dedicated RTL test pass in Phase 10; I18nManager-based direction; full reload on switch   |
| Deep link payment return | Router wired but MVP uses simulation dialog; dialog is the fallback                       |
| Single-device mock DB    | Code structured behind API boundary; swap mock server for real backend without UI changes |
| Design token drift       | All tokens centralized in `tokens.ts`; linter can enforce no hardcoded colors             |
| Chef access confusion    | Pre-seeded phones documented in this plan; clearly labeled in seed data                   |
