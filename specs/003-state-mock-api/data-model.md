# Data Model: State Architecture + Mock API

**Feature**: 003-state-mock-api | **Date**: 2026-04-15

_Identity rule: Seed data uses fixed IDs with entity prefix (e.g., `kitchen-1`); runtime-created records use auto-incrementing integers with the same prefix pattern._

## Entities

### User

Represents a customer or chef.

| Field     | Type         | Required       | Notes                                                                              |
| --------- | ------------ | -------------- | ---------------------------------------------------------------------------------- |
| id        | string       | yes            | Fixed for seeds (e.g., `chef-0100000001`, `customer-0110000001`); auto for runtime |
| name      | string       | yes            | Arabic display name                                                                |
| phone     | string       | yes            | Egyptian format (11 digits)                                                        |
| role      | UserRole     | yes            | `'customer'` or `'chef'`                                                           |
| area      | string       | customers only | Cairo neighborhood                                                                 |
| kitchenId | string       | chefs only     | References Kitchen.id                                                              |
| createdAt | string (ISO) | yes            | Auto-set                                                                           |

**Validation**: Phone must be 11 digits. Role must be one of the enum values. Chef users must have a kitchenId.

**Relationships**: A chef User has one Kitchen (via kitchenId). A customer User has many Orders.

---

### Kitchen

Represents a homemaker's kitchen.

| Field       | Type         | Required | Notes                               |
| ----------- | ------------ | -------- | ----------------------------------- |
| id          | string       | yes      | Fixed for seeds (e.g., `kitchen-1`) |
| chefId      | string       | yes      | References User.id                  |
| name        | string       | yes      | Arabic + English names              |
| nameEn      | string       | yes      | English name                        |
| bio         | string       | yes      | Short description                   |
| bioEn       | string       | yes      | English bio                         |
| cuisineTags | string[]     | yes      | e.g., ['مصري', 'شامي']              |
| area        | string       | yes      | Cairo neighborhood                  |
| rating      | number       | yes      | Average 1.0-5.0                     |
| reviewCount | number       | yes      | Derived from reviews                |
| isVerified  | boolean      | yes      | Verification badge                  |
| coverImage  | string       | yes      | Placeholder URL/key                 |
| isOpen      | boolean      | yes      | Derived from schedule               |
| createdAt   | string (ISO) | yes      | Auto-set                            |

**Validation**: Area must be one of the 8 Cairo neighborhoods. Rating is computed average.

**Relationships**: Belongs to one User (chef). Has many Dishes, Reviews, one Schedule.

---

### Dish

Represents a menu item.

| Field         | Type         | Required | Notes                            |
| ------------- | ------------ | -------- | -------------------------------- |
| id            | string       | yes      | Fixed for seeds (e.g., `dish-1`) |
| kitchenId     | string       | yes      | References Kitchen.id            |
| name          | string       | yes      | Arabic name                      |
| nameEn        | string       | yes      | English name                     |
| description   | string       | yes      | Arabic description               |
| descriptionEn | string       | yes      | English description              |
| price         | number       | yes      | In EGP                           |
| category      | string       | yes      | e.g., 'مشويات', 'حلويات'         |
| categoryEn    | string       | yes      | English category                 |
| prepTime      | number       | yes      | Minutes                          |
| maxPortions   | number       | yes      | Max servings per day             |
| available     | boolean      | yes      | Toggle by chef                   |
| imageUrl      | string       | no       | Placeholder                      |
| createdAt     | string (ISO) | yes      | Auto-set                         |

**Validation**: Price > 0. PrepTime > 0. MaxPortions > 0.

**Relationships**: Belongs to one Kitchen.

---

### Review

Represents customer feedback (read-only in MVP).

| Field     | Type         | Required | Notes                              |
| --------- | ------------ | -------- | ---------------------------------- |
| id        | string       | yes      | Fixed for seeds (e.g., `review-1`) |
| kitchenId | string       | yes      | References Kitchen.id              |
| userId    | string       | yes      | References User.id                 |
| rating    | number       | yes      | 1-5                                |
| text      | string       | yes      | Arabic review text                 |
| createdAt | string (ISO) | yes      | Auto-set                           |

**Validation**: Rating 1-5. Text non-empty.

**Relationships**: Belongs to one Kitchen and one User.

---

### Schedule

Represents a kitchen's weekly availability.

| Field     | Type          | Required | Notes                       |
| --------- | ------------- | -------- | --------------------------- |
| kitchenId | string        | yes      | References Kitchen.id (1:1) |
| days      | DaySchedule[] | yes      | 7 entries (Sat-Fri)         |

**DaySchedule**:

| Field     | Type    | Required  | Notes                                     |
| --------- | ------- | --------- | ----------------------------------------- |
| day       | string  | yes       | 'sat','sun','mon','tue','wed','thu','fri' |
| isOpen    | boolean | yes       |                                           |
| openTime  | string  | if isOpen | e.g., '10:00'                             |
| closeTime | string  | if isOpen | e.g., '22:00'                             |

**Validation**: openTime < closeTime. If isOpen is false, times are ignored.

**Relationships**: Belongs to one Kitchen (1:1).

---

### Order

Represents a customer's combined order with kitchen-grouped sub-orders.

| Field           | Type               | Required | Notes                                    |
| --------------- | ------------------ | -------- | ---------------------------------------- |
| id              | string             | yes      | Auto-increment (e.g., `order-1`)         |
| customerId      | string             | yes      | References User.id                       |
| subOrders       | SubOrder[]         | yes      | One per kitchen in the order             |
| status          | OrderStatus        | yes      | Derived: least advanced sub-order status |
| deliveryAddress | string             | yes      | Manual entry                             |
| paymentMethod   | PaymentMethod      | yes      | 'cash','vodafone_cash','instapay'        |
| paymentStatus   | PaymentStatus      | yes      | 'pending','paid','failed'                |
| deliveryFee     | number             | yes      | Flat fee per order                       |
| instructions    | string             | no       | Special delivery instructions            |
| schedule        | SchedulePreference | yes      | 'asap','today','tomorrow'                |
| createdAt       | string (ISO)       | yes      | Auto-set                                 |
| updatedAt       | string (ISO)       | yes      | Auto-set on status changes               |

**SubOrder**:

| Field        | Type        | Required | Notes                             |
| ------------ | ----------- | -------- | --------------------------------- |
| kitchenId    | string      | yes      | References Kitchen.id             |
| chefId       | string      | yes      | References User.id (denormalized) |
| status       | OrderStatus | yes      | Independent per kitchen           |
| items        | OrderItem[] | yes      |                                   |
| kitchenTotal | number      | yes      | Sum of item prices                |

**OrderItem**:

| Field     | Type   | Required | Notes                  |
| --------- | ------ | -------- | ---------------------- |
| dishId    | string | yes      | References Dish.id     |
| dishName  | string | yes      | Snapshot at order time |
| quantity  | number | yes      | > 0                    |
| unitPrice | number | yes      | Snapshot at order time |

**OrderStatus**: `'pending' | 'confirmed' | 'preparing' | 'cooking' | 'ready' | 'on_the_way' | 'delivered' | 'cancelled'`

**PaymentMethod**: `'cash' | 'vodafone_cash' | 'instapay'`

**PaymentStatus**: `'pending' | 'paid' | 'failed'`

**SchedulePreference**: `'asap' | 'today' | 'tomorrow'`

**State Transitions (per sub-order)**:

```
pending → confirmed → preparing → cooking → ready → on_the_way → delivered
pending → cancelled (chef rejects)
confirmed → cancelled
preparing → cancelled
cooking → cancelled
ready → cancelled
```

Invalid transitions return an error.

**Overall order status** = least advanced sub-order status. If any sub-order is cancelled but others remain, the overall status reflects the remaining active sub-orders. If all sub-orders are cancelled, overall status is cancelled.

**Validation**: At least one sub-order required. At least one item per sub-order. deliveryFee >= 0.

**Relationships**: Belongs to one User (customer). Contains SubOrders referencing Kitchens and Dishes.

---

### Cart (Zustand Store — Client State)

Represents a customer's in-progress order. NOT stored in the mock DB.

| Field         | Type               | Required | Notes                    |
| ------------- | ------------------ | -------- | ------------------------ |
| kitchenGroups | CartKitchenGroup[] | yes      | Items grouped by kitchen |
| schedule      | SchedulePreference | yes      | Default 'asap'           |
| instructions  | string             | no       | Delivery instructions    |
| deliveryFee   | number             | yes      | Flat fee constant        |

**CartKitchenGroup**:

| Field       | Type       | Required | Notes                    |
| ----------- | ---------- | -------- | ------------------------ |
| kitchenId   | string     | yes      |                          |
| kitchenName | string     | yes      | Denormalized for display |
| items       | CartItem[] | yes      |                          |

**CartItem**:

| Field    | Type   | Required | Notes |
| -------- | ------ | -------- | ----- |
| dishId   | string | yes      |       |
| dishName | string | yes      |       |
| price    | number | yes      |       |
| quantity | number | yes      | >= 1  |

**Actions**: addItem, removeItem, updateQuantity, setSchedule, setInstructions, clearCart, clearOnLogout

**Persistence**: Zustand persist to AsyncStorage (key: `nafas-cart`). Cleared on logout.

---

### Session (Zustand Store — Client State)

Already exists in `src/stores/session-store.ts`. No schema changes needed.

---

### Settings (Zustand Store — Client State)

Already exists in `src/stores/settings-store.ts`. Will add `devErrorInjection` boolean flag for error injection toggle.

| New Field         | Type    | Default | Notes                         |
| ----------------- | ------- | ------- | ----------------------------- |
| devErrorInjection | boolean | false   | Toggle random error injection |
