# Tasks: State Architecture + Mock API

**Input**: Design documents from `/specs/003-state-mock-api/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Critical logic tests are included per the implementation plan (cart-store.test.ts, order-pipeline.test.ts, persistence.test.ts).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Types + Mock DB Infrastructure)

**Purpose**: Create the shared type definitions and mock DB core that ALL user stories depend on. No hooks or stores yet — just the data layer foundation.

- [x] T001 Create `src/types/kitchen.ts` — Define the Kitchen interface matching data-model.md: id, chefId, name, nameEn, bio, bioEn, cuisineTags (string[]), area (one of 8 Cairo neighborhoods), rating (number), reviewCount (number), isVerified (boolean), coverImage (string), isOpen (boolean), createdAt (string ISO). Also export type `CairoArea` as a union of the 8 neighborhood strings: 'Maadi' | 'Zamalek' | 'Heliopolis' | 'Nasr City' | 'Dokki' | 'Mohandessin' | 'New Cairo' | '6th October'.
- [x] T002 [P] Create `src/types/dish.ts` — Define the Dish interface matching data-model.md: id, kitchenId, name, nameEn, description, descriptionEn, price (number), category (string), categoryEn (string), prepTime (number, minutes), maxPortions (number), available (boolean), imageUrl (string | null), createdAt (string ISO). Export type `DishCategory` as a union of common Egyptian food categories: 'مشويات' | 'حلويات' | 'مقبلات' | 'أصناف رئيسية' | 'شوربات' | 'سلطات' | 'مشروبات' | 'فطائر'.
- [x] T003 [P] Create `src/types/order.ts` — Define the Order, SubOrder, OrderItem interfaces and the OrderStatus, PaymentMethod, PaymentStatus, SchedulePreference types matching data-model.md exactly. OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'cooking' | 'ready' | 'on_the_way' | 'delivered' | 'cancelled'. PaymentMethod = 'cash' | 'vodafone_cash' | 'instapay'. PaymentStatus = 'pending' | 'paid' | 'failed'. SchedulePreference = 'asap' | 'today' | 'tomorrow'. Order has: id, customerId, subOrders (SubOrder[]), status (OrderStatus), deliveryAddress, paymentMethod, paymentStatus, deliveryFee (number), instructions (string | null), schedule (SchedulePreference), createdAt, updatedAt. SubOrder has: kitchenId, chefId, status (OrderStatus), items (OrderItem[]), kitchenTotal (number). OrderItem has: dishId, dishName, quantity, unitPrice.
- [x] T004 [P] Update `src/types/user.ts` — Add `area` (string, optional — only for customers) and `kitchenId` (string, optional — only for chefs) and `createdAt` (string ISO) to the existing User interface. Keep all existing types (UserRole, UserSession, AuthResult) unchanged.
- [x] T005 Create `src/types/index.ts` — Re-export everything from user.ts, kitchen.ts, dish.ts, order.ts. Also export a `Review` interface: id (string), kitchenId (string), userId (string), rating (number 1-5), text (string), createdAt (string ISO). Export a `DaySchedule` interface: day ('sat'|'sun'|'mon'|'tue'|'wed'|'thu'|'fri'), isOpen (boolean), openTime (string | null), closeTime (string | null). Export a `Schedule` interface: kitchenId (string), days (DaySchedule[]). Export a `Follow` interface: userId (string), kitchenId (string), createdAt (string ISO).
- [x] T006 Create `src/api/types.ts` — Define request/response types for ALL mock server operations per the contracts/ directory. Each operation gets a named request type and a response type. See contracts/auth.md through contracts/chef-stats.md. Key types to define: `LoginRequest`, `LoginResponse` (= AuthResult), `SignupRequest` ({ name, area, phone }), `SignupResponse` (= AuthResult), `KitchenFilters` ({ area?, isOpen?, cuisineTag?, minRating?, isVerified?, search? }), `CreateOrderInput` with nested `CreateOrderKitchenInput` and `CreateOrderItemInput`, `CreateOrderResponse`, `ChefOrderFilters`, `CreateDishInput`, `UpdateDishInput` (= Partial<CreateDishInput>), `DayScheduleInput`, `ChefStats` (weeklyIncome, weeklyOrders, repeatCustomerPercent, topDish), `ReorderResponse` (addedItems + skippedItems). Also export a generic `ApiError` type: { success: false, error: { code: string } } and a helper type `ApiResult<T>` = ({ success: true } & T) | ApiError.
- [x] T007 Create `src/api/mock-db.ts` — This is the core persistent mock database. Implementation: (1) Define a `MockDB` interface with typed collections: users (Map<string, User>), kitchens (Map<string, Kitchen>), dishes (Map<string, Dish>), reviews (Map<string, Review>), schedules (Map<string, Schedule>), orders (Map<string, Order>), follows (Map<string, Follow>), autoIncrementCounters (Map<string, number>) for tracking next ID per entity type. (2) Create a `db` variable that holds the in-memory state. (3) Export `initializeDB()` — checks AsyncStorage key `nafas-mock-db` for persisted data. If found, parse and load into `db`. If not found, call `loadSeeds()` to initialize from seed files, then persist. (4) Export `loadSeeds()` — imports all seed files and populates the maps. See T008-T012 for seed file locations. (5) Export `persistDB()` — serializes `db` to JSON and writes to AsyncStorage key `nafas-mock-db`. Must be called after every write operation. (6) Export `resetToSeeds()` — clears the AsyncStorage key, re-creates `db` from `loadSeeds()`, then persists. (7) Export `getNextId(entityType: string)` — reads autoIncrementCounters map, increments, persists, returns string like `order-1`, `dish-7` etc. (8) Export typed getter helpers: `getUser(id)`, `getKitchen(id)`, `getDish(id)`, `getOrder(id)`, `getSchedule(kitchenId)`, etc. that return the entity or null. (9) Export typed query helpers: `getKitchensByArea(area)`, `getDishesByKitchen(kitchenId)`, `getReviewsByKitchen(kitchenId)`, `getOrdersByCustomer(customerId)`, `getOrdersByChef(chefId)`, `getFollowsByUser(userId)`. Use the StorageService from `src/lib/storage.ts` for AsyncStorage access.
- [x] T008 [P] Create `src/api/seeds/kitchens.ts` — Export `KITCHEN_SEEDS` array with 6 kitchens. Each kitchen: id like `kitchen-1` through `kitchen-6`, chefId referencing the chef user IDs (e.g., `chef-0100000001`), name (Arabic), nameEn (English), bio (Arabic, 1-2 sentences about the kitchen), bioEn (English), cuisineTags (Arabic, e.g., ['مصري', 'مشويات']), area (one of the 8 Cairo areas — use each area at least once), rating (4.0-5.0), reviewCount (0, will be updated from reviews), isVerified (mix of true/false), coverImage ('placeholder'), isOpen (true), createdAt (ISO string). Use authentic Egyptian kitchen names and descriptions. Example: kitchen-1 = { id: 'kitchen-1', chefId: 'chef-0100000001', name: 'مطبخ أم سمية', nameEn: "Umm Samia's Kitchen", bio: 'أكل بيتي مصري أصيل زي ما ماما كانت بتعمله', bioEn: 'Authentic Egyptian home cooking just like mom used to make', cuisineTags: ['مصري', 'مشويات'], area: 'Maadi', ... }.
- [x] T009 [P] Create `src/api/seeds/dishes.ts` — Export `DISH_SEEDS` array with 4-8 dishes per kitchen (24-48 total). Each dish: id like `dish-1` through `dish-48`, kitchenId, name (Arabic), nameEn (English), description (Arabic), descriptionEn (English), price (30-250 EGP), category (Arabic), categoryEn (English), prepTime (15-90 minutes), maxPortions (5-50), available (true), imageUrl (null), createdAt. Use authentic Egyptian dish names: e.g., dish-1 = { name: 'كشري', nameEn: 'Koshari', price: 65, category: 'أصناف رئيسية', categoryEn: 'Main Dishes' }. Cover categories: مشويات (grills), حلويات (sweets), مقبلات (appetizers), أصناف رئيسية (main dishes), شوربات (soups), فطائر (pastries). Make sure each kitchen has a realistic mix.
- [x] T010 [P] Create `src/api/seeds/reviews.ts` — Export `REVIEW_SEEDS` array with 3-5 reviews per kitchen (18-30 total). Each review: id like `review-1` through `review-30`, kitchenId, userId (use customer IDs like `customer-0110000001`), rating (3-5), text (Arabic, authentic Egyptian colloquial, e.g., 'الأكل حقيقي زي البيت بالظبط، رائحة المطبخ بتجيب السيرة'), createdAt (ISO string from the past week).
- [x] T011 [P] Create `src/api/seeds/schedules.ts` — Export `SCHEDULE_SEEDS` array with one Schedule per kitchen (6 total). Each schedule: kitchenId, days (7 DaySchedule entries for sat through fri). Most kitchens: open 6 days (closed one day), hours 10:00-22:00. Vary one kitchen to close earlier (16:00) and another to be closed on a different day. All isOpen=true days must have openTime and closeTime strings in 'HH:MM' format.
- [x] T012 [P] Create `src/api/seeds/orders.ts` — Export `ORDER_SEEDS` array with 3 sample orders. Order 1: single-kitchen order, status 'delivered', paymentStatus 'paid', paymentMethod 'cash'. Order 2: single-kitchen order, status 'preparing', paymentStatus 'paid', paymentMethod 'vodafone_cash'. Order 3: multi-kitchen order (2 kitchens), one sub-order 'confirmed' and the other 'pending', overall status 'pending' (least advanced). Each order has realistic items with dishName (snapshot) and unitPrice (snapshot). Use customer-0110000001 as customerId for order-1 and order-2, customer-0110000002 for order-3. Auto IDs: `order-1`, `order-2`, `order-3`.
- [x] T013 Update `src/api/seeds/users.ts` — Expand the existing CHEF_ACCOUNTS entries to include: id (e.g., `chef-0100000001`), createdAt (ISO string). Expand CUSTOMER_ACCOUNTS entries to include: id (e.g., `customer-0110000001`), area (one of the 8 Cairo areas), createdAt. Keep the existing phone/name/kitchenId fields. Export a `USER_SEEDS` array that combines both chef and customer accounts into User-typed objects for loading into the mock DB.
- [x] T014 Wire mock DB initialization into `app/_layout.tsx` — Import `initializeDB` from `src/api/mock-db.ts` and call it before the app renders. Add it to the existing initialization chain (after font loading, before store hydration completes). The `initializeDB` call must complete before any React Query hooks fire. Use a `useEffect` or make it part of the existing startup logic. Ensure the `hydrated` gate already present in the layout also waits for mock DB initialization.

**Checkpoint**: Mock DB can be initialized, persisted to AsyncStorage, and reloaded. All type definitions compile. Run `npx tsc --noEmit` to verify.

---

## Phase 2: Foundational (Mock Server + Cart Store + Latency/Error Infrastructure)

**Purpose**: Build the mock server layer, cart store, and infrastructure that ALL user stories need. After this phase, the full data pipeline exists: seeds → mock DB → mock server (with latency + errors) → React Query hooks.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T015 Add `devErrorInjection` field to `src/stores/settings-store.ts` — Add a `devErrorInjection: boolean` field (default false) to SettingsState interface. Add a `setDevErrorInjection: (enabled: boolean) => void` action that sets the field. Add `devErrorInjection: false` to the initial state. Make sure the persist partialize includes this new field. This follows the exact same pattern as the existing `themeOverride` field.
- [ ] T016 Rewrite `src/api/mock-server.ts` — Replace the current simple implementation with the full mock server. This file imports `db` and all helpers from `src/api/mock-db.ts`. Every exported function must be async (returns Promise). Every function must call `await withLatency()` at the start (see T017). Every mutation function must call `persistDB()` after modifying the DB. Implement ALL the following functions per the contracts/ directory:

  **Auth** (replacing existing `login`/`logout`/`getSession`):
  - `login(phone: string, otp: string)` — validate phone format, validate otp is '123456', look up user in db.users by phone, return AuthResult. On success, also call sessionStore.login(). If user not found, return error with code 'UNKNOWN_PHONE'.
  - `signup(name: string, area: string, phone: string)` — validate inputs, check phone not already in db.users, create new user with getNextId('user'), role 'customer', add to db.users, call sessionStore.login(), persist, return AuthResult.
  - `logout()` — call sessionStore.logout() AND cartStore.clearOnLogout() (import from cart-store). Return { success: true }.
  - `getSession()` — same as current, read from sessionStore.

  **Kitchens**:
  - `getKitchens(filters?: KitchenFilters)` — read all from db.kitchens, apply filters (area, isOpen, cuisineTag, minRating, isVerified, search). For search: match kitchen name/nameEn OR any dish name/nameEn in that kitchen. Return { kitchens: Kitchen[], total: number }.
  - `getKitchenDetail(id: string)` — get kitchen from db, also get dishes (db.dishes filtered by kitchenId, only available=true), reviews, schedule. Return { kitchen, dishes, reviews, schedule } or error NOT_FOUND.
  - `searchKitchens(query: string)` — search kitchens and dishes by name/nameEn. Return { kitchens: Kitchen[], dishes: Dish[] }.

  **Menu/Reviews**:
  - `getMenu(kitchenId: string)` — get dishes from db where kitchenId matches AND available=true. Return { dishes: Dish[] }.
  - `getReviews(kitchenId: string)` — get reviews from db by kitchenId. Compute averageRating and totalCount. Return { reviews, averageRating, totalCount }.

  **Favorites**:
  - `getFavorites(userId: string)` — get follows from db by userId, then look up each kitchen. Return { kitchens: Kitchen[] }.
  - `followKitchen(userId: string, kitchenId: string)` — validate both exist, check not already following, add to db.follows, persist. Return { success: true } or error.
  - `unfollowKitchen(userId: string, kitchenId: string)` — validate follow exists, remove from db.follows, persist. Return { success: true } or error.

  **Orders**:
  - `createOrder(input: CreateOrderInput)` — validate all dishes exist and are available (if a dish in the input has become unavailable since it was added to the cart, return error with code 'DISH_UNAVAILABLE' and include the unavailable dish IDs so the UI can inform the user), validate kitchens are open, create Order with SubOrders (one per kitchen group), set all sub-order statuses to 'pending', set overall status to 'pending', set paymentStatus to 'pending', generate id with getNextId('order'), add to db.orders, persist. Return { order: Order } or error with code 'DISH_UNAVAILABLE' | 'KITCHEN_CLOSED' | 'INVALID_ITEMS'.
  - `getOrders(userId: string, filters?: { status?: 'active' | 'past' })` — get orders from db where customerId matches userId, filter by active (non-terminal statuses) or past (delivered/cancelled). Return { orders: Order[] }.
  - `getOrderDetail(orderId: string)` — get order from db. Return { order: Order } or error NOT_FOUND.
  - `reorder(orderId: string)` — get order, verify it's delivered/cancelled, for each item in each sub-order: check if dish still exists and available. Available items → CartItem array. Unavailable/deleted items → skipped array with reason. Return { addedItems, skippedItems }.

  **Chef Orders**:
  - `getChefOrders(chefId: string, filters?: ChefOrderFilters)` — get all orders that contain a sub-order with matching chefId, filter by sub-order status (pending/active/completed). Return { orders: Order[] }.
  - `updateOrderStatus(orderId: string, subOrderId: string, status: OrderStatus)` — validate order exists, find sub-order by kitchenId within the order's subOrders, validate transition using VALID_TRANSITIONS map (see T018), update sub-order status, recalculate overall order status (least advanced sub-order), update order.updatedAt, persist. Return { success: true, order }.
  - `acceptOrder(orderId: string, subOrderId: string)` — shortcut for updateOrderStatus with 'confirmed'. Validate sub-order is currently 'pending'. Return result.
  - `rejectOrder(orderId: string, subOrderId: string)` — shortcut for updateOrderStatus with 'cancelled'. Validate sub-order is currently 'pending'. Return result.

  **Chef Menu**:
  - `getChefMenu(chefId: string)` — find kitchen by chefId, get ALL dishes (including available=false). Return { dishes: Dish[] }.
  - `createDish(chefId: string, input: CreateDishInput)` — find kitchen by chefId, validate input, create dish with getNextId('dish'), add to db.dishes, persist. Return { success: true, dish }.
  - `updateDish(dishId: string, input: UpdateDishInput)` — get dish, apply partial updates, persist. Return { success: true, dish }.
  - `deleteDish(dishId: string)` — remove from db.dishes, persist. Return { success: true }.
  - `toggleDishAvailability(dishId: string)` — get dish, flip available boolean, persist. Return { success: true, dish }.

  **Chef Schedule**:
  - `getChefSchedule(chefId: string)` — find kitchen by chefId, get schedule. Return { schedule: Schedule }.
  - `updateChefSchedule(chefId: string, schedule: DayScheduleInput[])` — validate 7 entries, validate openTime < closeTime for open days, update db.schedules, also update kitchen.isOpen based on current day/time, persist. Return { success: true, schedule }.

  **Chef Stats**:
  - `getChefStats(chefId: string)` — find kitchen by chefId, compute from orders: weeklyIncome (sum of kitchenTotal from sub-orders in last 7 days where this chefId matches), weeklyOrders (count), repeatCustomerPercent (% of customers with 2+ orders), topDish (most ordered dish by quantity). Return ChefStats.

- [ ] T017 Add `withLatency()` helper to `src/api/mock-server.ts` — At the top of mock-server.ts, define `async function withLatency(): Promise<void>` that returns a Promise resolving after a random delay between 200-900ms. Use `Math.random()` to pick the delay. Every exported mock server function MUST call `await withLatency()` as its first line. This simulates network latency.
- [ ] T018 Add `shouldInjectError()` helper and `VALID_TRANSITIONS` map to `src/api/mock-server.ts` — (1) Define `function shouldInjectError(): boolean` that reads `devErrorInjection` from settingsStore: `useSettingsStore.getState().devErrorInjection`. If false, return false. If true, return `Math.random() < 0.15` (15% chance of error). When true, the calling function should return `{ success: false, error: { code: 'INJECTED_ERROR' } }`. Add this check after `withLatency()` in every function. (2) Define `const VALID_TRANSITIONS: Record<string, OrderStatus[]>` mapping each status to its valid next statuses: pending → ['confirmed', 'cancelled'], confirmed → ['preparing', 'cancelled'], preparing → ['cooking', 'cancelled'], cooking → ['ready', 'cancelled'], ready → ['on_the_way', 'cancelled'], on_the_way → ['delivered'], delivered → [] (terminal), cancelled → [] (terminal). Used by updateOrderStatus for validation.
- [ ] T019 Add `computeOverallStatus()` helper to `src/api/mock-server.ts` — Define `function computeOverallStatus(subOrders: SubOrder[]): OrderStatus` that: (1) Filters out cancelled sub-orders if any non-cancelled sub-orders remain. (2) Returns 'cancelled' if ALL sub-orders are cancelled. (3) Among the remaining active sub-orders, returns the least advanced status using the pipeline order: pending < confirmed < preparing < cooking < ready < on_the_way < delivered. Use an array index comparison to determine which status is "least advanced".
- [ ] T020 Create `src/stores/cart-store.ts` — Create a persisted Zustand store following the exact pattern from session-store.ts (import AsyncStorage, create, persist, createJSONStorage). Define interface `CartState` with: kitchenGroups (CartKitchenGroup[]), schedule (SchedulePreference, default 'asap'), instructions (string, default ''), deliveryFee (number, constant 25). Define actions: addItem(item: { dishId, dishName, price, kitchenId, kitchenName }) — if a CartKitchenGroup for this kitchenId already exists, add item to it (or increment quantity if dishId already exists); otherwise create a new group. removeItem(kitchenId, dishId) — remove item from group; if group becomes empty, remove the group. updateQuantity(kitchenId, dishId, quantity) — if quantity < 1, remove the item instead. setSchedule(schedule: SchedulePreference). setInstructions(instructions: string). clearCart() — reset to initial state. clearOnLogout() — same as clearCart (called from mock-server logout). Also export computed helpers: getTotal() — sum of all items' price \* quantity across all groups; getSubtotal() — same as getTotal; getGrandTotal() — getSubtotal() + deliveryFee; getItemCount() — sum of all quantities. Use persist with key `nafas-cart`. Add hydrated flag and onRehydrateStorage pattern matching session-store.ts. Export `cartStore` (the raw store) and `useCartStore` (the hook).
- [ ] T021 Update `src/hooks/use-auth.ts` — Change `login` to pass both `phone` and `otp` (hardcode `'123456'` for now — the OTP screen doesn't exist yet). Change `login` call from `mockLogin(phone)` to `await mockLogin(phone, '123456')`. Change `logout` to `await mockLogout()`. Both are now async. Return types should reflect this.
- [ ] T022 Create `src/lib/payment.ts` — Export `simulatePayment(method: PaymentMethod): Promise<{ success: boolean; status: PaymentStatus }>` that simulates a payment: for 'cash' → always return { success: true, status: 'pending' } (cash on delivery). For 'vodafone_cash' and 'instapay' → 80% chance return { success: true, status: 'paid' }, 20% chance return { success: false, status: 'failed' }. Add a 500-1500ms delay to simulate payment processing. This will be used by the checkout flow but is defined here as infrastructure.

**Checkpoint**: Mock server compiles. `npx tsc --noEmit` passes. Can import and call mock server functions manually in a test or console.

---

## Phase 3: User Story 1 — Customer places an order that the chef receives (Priority: P1) MVP

**Goal**: A customer can place an order (via mock server + hooks) and the chef can see it in their orders list. This validates the entire data pipeline from customer action to chef visibility.

**Independent Test**: Call `createOrder` with a customer's items → call `getChefOrders` with the chef's ID → verify the order appears with correct details.

### Tests for User Story 1

- [ ] T023 Create `__tests__/order-pipeline.test.ts` — Test the order creation and chef visibility flow: (1) Call initializeDB(). (2) Create an order via mock-server createOrder with items from kitchen-1, customer customer-0110000001, deliveryAddress 'Test Address', paymentMethod 'cash'. (3) Call getChefOrders with chefId for kitchen-1's chef. (4) Assert the order appears in the chef's orders list. (5) Assert the order has status 'pending'. (6) Assert the sub-order contains the correct items with correct quantities and prices. (7) Call getOrders for the customer. (8) Assert the order appears in the customer's orders list. (9) Test that a multi-kitchen order (items from kitchen-1 and kitchen-2) creates a single order with 2 sub-orders, and each chef sees only their sub-order.

### Implementation for User Story 1

- [ ] T024 [US1] Create `src/hooks/use-kitchens.ts` — Export: `useKitchens(filters?: KitchenFilters)` using useQuery with key `['kitchens', filters]` calling `mockServer.getKitchens(filters)`. `useKitchenDetail(id: string)` using useQuery with key `['kitchen', id]` calling `mockServer.getKitchenDetail(id)`. `useSearchKitchens(query: string)` using useQuery with key `['search', query]` calling `mockServer.searchKitchens(query)`, enabled only when query length > 0. Import useQuery from @tanstack/react-query. Import mock server functions from @/api/mock-server.
- [ ] T025 [US1] Create `src/hooks/use-orders.ts` — Export: `useCreateOrder()` using useMutation calling `mockServer.createOrder(input)`, on success invalidate `['orders']` and `['chef-orders']` query keys. `useOrders(userId: string, filters?)` using useQuery with key `['orders', userId, filters]` calling `mockServer.getOrders(userId, filters)`. `useOrderDetail(orderId: string)` using useQuery with key `['order', orderId]` calling `mockServer.getOrderDetail(orderId)`. `useReorder(orderId: string)` using useMutation calling `mockServer.reorder(orderId)`, on success add returned `addedItems` to cartStore and invalidate `['orders']`. Import useMutation/useQuery/useQueryClient from @tanstack/react-query. Import cartStore from @/stores/cart-store.
- [ ] T026 [US1] Create `src/hooks/use-chef-orders.ts` — Export: `useChefOrders(chefId: string, filters?: ChefOrderFilters)` using useQuery with key `['chef-orders', chefId, filters]` calling `mockServer.getChefOrders(chefId, filters)`. `useUpdateOrderStatus()` using useMutation calling `mockServer.updateOrderStatus(orderId, subOrderId, status)`, on success invalidate `['orders']`, `['order', orderId]`, `['chef-orders']`. `useAcceptOrder()` using useMutation calling `mockServer.acceptOrder(orderId, subOrderId)`, on success same invalidation. `useRejectOrder()` using useMutation calling `mockServer.rejectOrder(orderId, subOrderId)`, on success same invalidation.
- [ ] T027 [US1] Create `src/hooks/use-favorites.ts` — Export: `useFavorites(userId: string)` using useQuery with key `['favorites', userId]` calling `mockServer.getFavorites(userId)`. `useFollowKitchen()` using useMutation calling `mockServer.followKitchen(userId, kitchenId)`, on success invalidate `['favorites', userId]`. `useUnfollowKitchen()` using useMutation calling `mockServer.unfollowKitchen(userId, kitchenId)`, on success invalidate `['favorites', userId]`.

**Checkpoint**: Order creation works end-to-end. Customer can create an order → chef can see it. Run `npx jest __tests__/order-pipeline.test.ts` to verify.

---

## Phase 4: User Story 2 — Chef updates order status and customer sees it reflected (Priority: P2)

**Goal**: Chef can accept/reject orders and advance their status through the pipeline. Customer sees status changes reflected via React Query invalidation.

**Independent Test**: Create an order → chef accepts it → customer query returns 'confirmed' status. Chef advances to 'preparing' → customer sees 'preparing'.

### Tests for User Story 2

- [ ] T028 Add status transition tests to `__tests__/order-pipeline.test.ts` — Add tests: (1) Create an order (from T023 setup). (2) Chef calls acceptOrder → assert sub-order status is 'confirmed' and overall order status is 'confirmed'. (3) Chef calls updateOrderStatus to advance to 'preparing' → assert status is 'preparing'. (4) Continue advancing through the full pipeline: preparing → cooking → ready → on_the_way → delivered. (5) Assert each transition works and the overall status matches. (6) Test invalid transition: try advancing from 'confirmed' directly to 'ready' → assert it returns an error. (7) Test reject: create another order, chef calls rejectOrder → assert sub-order status is 'cancelled'. (8) Test multi-kitchen: create order with 2 kitchens, chef A accepts → overall status remains 'pending' (chef B hasn't accepted). Chef B accepts → overall status becomes 'confirmed'. Chef A advances to 'preparing' → overall status is 'confirmed' (least advanced is B's 'confirmed').

### Implementation for User Story 2

- [ ] T029 [US2] The hooks from T026 (`useAcceptOrder`, `useRejectOrder`, `useUpdateOrderStatus`) already implement this user story. Verify they work by running the test from T028. If any issue is found, fix the mock server or hook implementation.

**Checkpoint**: Full order pipeline works with status transitions enforced. Run `npx jest __tests__/order-pipeline.test.ts` to verify.

---

## Phase 5: User Story 3 — App data persists across restarts (Priority: P2)

**Goal**: All data (session, cart, orders, menu changes) survives app restart. The mock DB rehydrates from AsyncStorage. The cart store and session store already persist via Zustand.

**Independent Test**: Place an order → call `resetDB()` to simulate in-memory state loss → call `initializeDB()` to rehydrate → verify order still exists.

### Tests for User Story 3

- [ ] T030 Create `__tests__/persistence.test.ts` — Test persistence cycle: (1) Call initializeDB(). (2) Create an order via createOrder. (3) Assert the order exists by calling getOrderDetail. (4) Simulate in-memory state loss by setting `db` to empty maps (call a test helper). (5) Call initializeDB() again (should reload from AsyncStorage). (6) Assert the order still exists after rehydration. (7) Test cart persistence: add items to cartStore, read them back, verify they persist. (8) Test session persistence: login with a user, verify session exists, call sessionStore rehydration, verify session is restored.

### Implementation for User Story 3

- [ ] T031 [US3] The mock DB persistence (T007) already implements this via AsyncStorage. The cart store (T020) already persists via Zustand. The session store already persists. The only additional work: verify that `initializeDB()` correctly rehydrates from AsyncStorage when called a second time (not just on first launch). If the current implementation has issues with rehydration, fix `mock-db.ts` to handle the case where AsyncStorage already has data. Add a `forceReload()` helper to mock-db.ts that clears the in-memory maps and calls the load-from-AsyncStorage path without calling resetToSeeds.

**Checkpoint**: Data survives simulated restart. Run `npx jest __tests__/persistence.test.ts` to verify.

---

## Phase 6: User Story 4 — Customer manages a cart across multiple kitchens (Priority: P3)

**Goal**: Cart store supports adding items from multiple kitchens, adjusting quantities, and calculating totals correctly. This is primarily about testing the cart store created in T020.

**Independent Test**: Add items from 2 kitchens → verify grouping → adjust quantity → verify total → clear cart → verify empty.

### Tests for User Story 4

- [ ] T032 Create `__tests__/cart-store.test.ts` — Test the cart store: (1) Create fresh cart store. (2) Add dish-1 from kitchen-1 (name: 'كشري', price: 65). Assert 1 group with 1 item. (3) Add dish-2 from kitchen-1 (name: 'شوربة', price: 40). Assert 1 group with 2 items. (4) Add dish-5 from kitchen-2 (name: 'مشويات', price: 120). Assert 2 groups. (5) Assert getSubtotal() = 225, deliveryFee = 25, getGrandTotal() = 250. (6) Update quantity of dish-1 to 3. Assert getSubtotal() = 355 (3×65 + 40 + 120), getGrandTotal() = 380. (7) Remove dish-2. Assert 1 item in kitchen-1 group, getSubtotal() = 315. (8) Set instructions to 'من غير شطة'. Assert instructions is set. (9) Set schedule to 'tomorrow'. Assert schedule is set. (10) Clear cart. Assert empty groups, default schedule, empty instructions. (11) Test clearOnLogout — same as clearCart. (12) Test adding same dish twice — should increment quantity, not create duplicate. (13) Test updateQuantity to 0 — should remove the item. (14) Test removing last item from a group — should remove the entire group.

### Implementation for User Story 4

- [ ] T033 [US4] The cart store (T020) already implements this. Run the test from T032. If any cart store behavior doesn't match the test expectations, fix `src/stores/cart-store.ts`. Common issues to watch for: duplicate items not being merged (should increment quantity), removing last item from a group not removing the group, total calculations off by one.

**Checkpoint**: Cart store works correctly for multi-kitchen scenarios. Run `npx jest __tests__/cart-store.test.ts` to verify.

---

## Phase 7: User Story 5 — Chef manages menu items (Priority: P3)

**Goal**: Chef can add, edit, delete dishes and toggle availability. Changes are immediately visible to customers through React Query invalidation.

**Independent Test**: Chef creates a dish → customer kitchen detail query returns the new dish. Chef toggles availability off → customer query no longer shows the dish. Chef edits price → customer sees updated price. Chef deletes → dish is gone.

### Implementation for User Story 5

- [ ] T034 [US5] Create `src/hooks/use-chef-menu.ts` — Export: `useChefMenu(chefId: string)` using useQuery with key `['chef-menu', chefId]` calling `mockServer.getChefMenu(chefId)`. `useCreateDish()` using useMutation calling `mockServer.createDish(chefId, input)`, on success invalidate `['chef-menu', chefId]` and `['kitchen', kitchenId]` and `['kitchens']`. `useUpdateDish()` using useMutation calling `mockServer.updateDish(dishId, input)`, on success invalidate `['chef-menu', chefId]`, `['kitchen', kitchenId]`, `['kitchens']`. `useDeleteDish()` using useMutation calling `mockServer.deleteDish(dishId)`, on success same invalidation. `useToggleAvailability()` using useMutation calling `mockServer.toggleDishAvailability(dishId)`, on success same invalidation. Note: for invalidation that needs kitchenId, the mutation's onSuccess should read the dish's kitchenId from the mock DB or accept it as a parameter.
- [ ] T035 [US5] Create `src/hooks/use-chef-schedule.ts` — Export: `useChefSchedule(chefId: string)` using useQuery with key `['chef-schedule', chefId]` calling `mockServer.getChefSchedule(chefId)`. `useUpdateChefSchedule()` using useMutation calling `mockServer.updateChefSchedule(chefId, schedule)`, on success invalidate `['chef-schedule', chefId]`, `['kitchen', kitchenId]`, `['kitchens']` (because isOpen status may change).
- [ ] T036 [US5] Create `src/hooks/use-chef-stats.ts` — Export: `useChefStats(chefId: string)` using useQuery with key `['chef-stats', chefId]` calling `mockServer.getChefStats(chefId)`. No mutations — stats are derived data.

**Checkpoint**: Chef can manage menu and schedule. Customer queries reflect changes. All hooks compile and have proper invalidation.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, reset-to-seeds, and final validation across all user stories.

- [ ] T037 Add `resetToSeeds` hook — In `src/hooks/use-auth.ts`, export a `useResetToSeeds()` function that returns a useMutation wrapping the `resetToSeeds()` function from mock-db.ts. On success, also call `queryClient.invalidateQueries()` to clear all React Query caches, and call `sessionStore.logout()` and `cartStore.clearCart()`. This fulfills FR-028.
- [ ] T038 Verify error injection works — In `__tests__/order-pipeline.test.ts`, add a test: enable `devErrorInjection` in settings store, call a mock server function 20 times, assert that at least 1 call returned `{ success: false, error: { code: 'INJECTED_ERROR' } }`. Then disable `devErrorInjection` and assert no more injected errors. Reset the setting to false after the test.
- [ ] T038b [P] Add seed data integrity test — In `__tests__/order-pipeline.test.ts`, add a test: after `initializeDB()`, assert db.kitchens.size >= 6, db.dishes.size >= 24 (4 per kitchen), db.reviews.size >= 18 (3 per kitchen), db.schedules.size === 6, db.orders.size >= 3. This validates SC-005.
- [ ] T038c [P] Add latency boundary test — In `__tests__/order-pipeline.test.ts`, add a test: call `withLatency()` 5 times, measure elapsed time for each call, assert all delays are between 200-900ms. This validates SC-007.
- [ ] T038d [US6] Add chef schedule and analytics test — In `__tests__/order-pipeline.test.ts`, add tests: (1) Chef calls getChefSchedule → assert 7 days returned. (2) Chef calls updateChefSchedule changing one day's hours → assert schedule updated and kitchen isOpen reflects the change. (3) Chef calls getChefStats → assert weeklyIncome, weeklyOrders, repeatCustomerPercent, and topDish are computed correctly from seed orders.
- [ ] T039 Run `npx tsc --noEmit` and fix any type errors across all new files.
- [ ] T040 Run `npm test` and ensure all tests pass (smoke, cart-store, order-pipeline, persistence).
- [ ] T041 Run `npm run lint` and fix any linting issues.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (types + mock DB must exist)
- **User Stories (Phase 3-7)**: All depend on Phase 2 (mock server + cart store + latency)
  - US1 (Phase 3): Depends on Phase 2. No dependency on other stories.
  - US2 (Phase 4): Depends on US1 (needs order creation to test status updates)
  - US3 (Phase 5): Depends on Phase 2. No dependency on other stories.
  - US4 (Phase 6): Depends on Phase 2 (cart store). No dependency on other stories.
  - US5 (Phase 7): Depends on Phase 2. No dependency on other stories.
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Depends on Phase 2 only. Can start immediately after foundational phase.
- **US2 (P2)**: Depends on US1 (needs order creation to test status pipeline). Can be tested independently but uses orders from US1.
- **US3 (P2)**: Depends on Phase 2 only. Independent of US1/US2.
- **US4 (P3)**: Depends on Phase 2 only. Independent of other stories.
- **US5 (P3)**: Depends on Phase 2 only. Independent of other stories.
- **US6 (P4)**: Implemented within US5 phase (schedule and analytics hooks are part of chef functionality).

### Parallel Opportunities

Within Phase 1: T001, T002, T003, T004 can run in parallel (all type files, different files).
Within Phase 1: T008, T009, T010, T011, T012 can run in parallel (all seed files, different files).
After Phase 2: US3, US4, US5 can run in parallel with US1 (different concerns, different files).

---

## Parallel Example: Phase 1

```bash
# Launch all type definitions together:
Task: "Create src/types/kitchen.ts"
Task: "Create src/types/dish.ts"
Task: "Create src/types/order.ts"
Task: "Update src/types/user.ts"

# Then launch all seed files together:
Task: "Create src/api/seeds/kitchens.ts"
Task: "Create src/api/seeds/dishes.ts"
Task: "Create src/api/seeds/reviews.ts"
Task: "Create src/api/seeds/schedules.ts"
Task: "Create src/api/seeds/orders.ts"
```

## Parallel Example: After Phase 2

```bash
# These user stories can be worked on simultaneously:
Developer A: "User Story 1 — order creation hooks (T024-T027)"
Developer B: "User Story 4 — cart store tests (T032-T033)"
Developer C: "User Story 5 — chef menu hooks (T034-T036)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (types + mock DB + seeds)
2. Complete Phase 2: Foundational (mock server + cart store + latency)
3. Complete Phase 3: User Story 1 (order creation + chef visibility)
4. **STOP and VALIDATE**: Run `npx jest __tests__/order-pipeline.test.ts`
5. At this point, the core data pipeline is proven

### Incremental Delivery

1. Setup + Foundational → Data layer ready
2. Add US1 → Order pipeline works → **MVP!**
3. Add US2 → Status transitions enforced
4. Add US3 → Data persists across restarts
5. Add US4 → Cart store verified
6. Add US5 → Chef menu management works
7. Polish → Error injection, reset, type checking, linting

---

## Notes

- All mock server functions are async (return Promises) even though they're local — this mirrors real API calls
- Every mutation must call `persistDB()` to survive restarts
- Every mutation hook must invalidate related query keys for cross-role consistency
- Cart store is client-state (Zustand), NOT in the mock DB
- The `devErrorInjection` setting is for development only — default OFF
- Seed IDs are fixed and deterministic; runtime IDs auto-increment
- `computeOverallStatus()` uses the "least advanced" rule for multi-kitchen orders
- When a user logs out: session clears, cart clears, all mock DB data is preserved
