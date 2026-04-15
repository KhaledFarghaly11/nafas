# Orders API Contract

## createOrder(input: CreateOrderInput)

Creates a new combined order from the cart contents.

**Request**:

```typescript
interface CreateOrderInput {
  customerId: string;
  deliveryAddress: string;
  paymentMethod: 'cash' | 'vodafone_cash' | 'instapay';
  instructions?: string;
  schedule: 'asap' | 'today' | 'tomorrow';
  deliveryFee: number;
  items: {
    kitchenId: string;
    items: {
      dishId: string;
      quantity: number;
    }[];
  }[];
}
```

**Response (success)**:

```typescript
{
  order: Order;
}
```

**Response (error)**:

```typescript
{ success: false, error: { code: 'INVALID_ITEMS' | 'KITCHEN_CLOSED' | 'DISH_UNAVAILABLE' } }
```

**Side effects**: Creates order in mock DB with all sub-orders. Each sub-order starts as `pending`. Clears the cart.

**Validation**: All dishes must exist and be available. All kitchens must be open. At least one item required.

---

## getOrders(userId: string, filters?: OrderFilters)

Lists orders for a user.

**Request**:

```typescript
interface OrderFilters {
  status?: 'active' | 'past';
}
```

- `active`: orders with status in `['pending','confirmed','preparing','cooking','ready','on_the_way']`
- `past`: orders with status in `['delivered','cancelled']`

**Response**:

```typescript
{ orders: Order[] }
```

---

## getOrderDetail(orderId: string)

Gets full details for a single order.

**Request**: `orderId`: string

**Response (success)**:

```typescript
{
  order: Order;
}
```

**Response (error)**:

```typescript
{ success: false, error: { code: 'NOT_FOUND' } }
```

---

## reorder(orderId: string)

Adds available items from a past order back to the cart. Skips unavailable items.

**Request**: `orderId`: string

**Response (success)**:

```typescript
{ addedItems: CartItem[], skippedItems: { dishId: string, dishName: string, reason: 'unavailable' | 'deleted' }[] }
```

**Response (error)**:

```typescript
{ success: false, error: { code: 'NOT_FOUND' } }
```

**Side effects**: Adds available items to cartStore. Does NOT clear existing cart items — items are appended/merged.

**Validation**: Order must exist and be in `delivered` or `cancelled` status.
