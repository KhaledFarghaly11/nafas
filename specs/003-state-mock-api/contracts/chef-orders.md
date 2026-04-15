# Chef Orders API Contract

## getChefOrders(chefId: string, filters?: ChefOrderFilters)

Lists orders containing sub-orders for this chef's kitchen.

**Request**:

```typescript
interface ChefOrderFilters {
  status?: 'pending' | 'active' | 'completed';
}
```

- `pending`: sub-orders with status `pending` (awaiting accept/reject)
- `active`: sub-orders with status in `['confirmed','preparing','cooking','ready','on_the_way']`
- `completed`: sub-orders with status in `['delivered','cancelled']`

**Response**:

```typescript
{ orders: Order[] }
```

**Notes**: Returns full Order objects but each only includes the sub-order relevant to this chef's kitchen.

**Pagination**: Deferred to real backend integration. MVP returns all matching results.

---

## updateOrderStatus(orderId: string, subOrderId: string, status: OrderStatus)

Advances a sub-order's status.

**Request**: `orderId`, `subOrderId` (kitchenId of the sub-order), `status` (next valid status in pipeline)

**Response (success)**:

```typescript
{ success: true, order: Order }
```

**Response (error)**:

```typescript
{ success: false, error: { code: 'INVALID_TRANSITION' | 'NOT_FOUND' } }
```

**Validation**: Status must be the next valid step in the pipeline (see data-model.md). `cancelled` is allowed only from statuses up through `ready` (not from `on_the_way` or `delivered`).

**Implementation note**: `subOrderId` uses the `kitchenId` to identify the sub-order within an Order, since SubOrders are keyed by kitchenId. A future iteration may add an explicit `id` field to SubOrder.

**Side effects**: Updates mock DB. Invalidates related queries.

---

## acceptOrder(orderId: string, subOrderId: string)

Accepts a pending sub-order (sets status to `confirmed`).

**Request**: `orderId`, `subOrderId`

**Response (success)**:

```typescript
{ success: true, order: Order }
```

**Response (error)**:

```typescript
{ success: false, error: { code: 'NOT_PENDING' | 'NOT_FOUND' } }
```

---

## rejectOrder(orderId: string, subOrderId: string)

Rejects a pending sub-order (sets status to `cancelled`).

**Request**: `orderId`, `subOrderId`

**Response (success)**:

```typescript
{ success: true, order: Order }
```

**Response (error)**:

```typescript
{ success: false, error: { code: 'NOT_PENDING' | 'NOT_FOUND' } }
```
