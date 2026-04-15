# Chef Stats API Contract

## getChefStats(chefId: string)

Returns analytics for the chef's kitchen.

**Request**: `chefId`: string

**Response (success)**:

```typescript
interface ChefStats {
  weeklyIncome: number;
  weeklyOrders: number;
  repeatCustomerPercent: number;
  topDish: { id: string; name: string; nameEn: string; orderCount: number } | null;
}
```

**Response (error)**:

```typescript
{ success: false, error: { code: 'NOT_FOUND' | 'INVALID_INPUT' } }
```

**Notes**: All values are derived from existing orders in the mock DB. `weeklyIncome` is the sum of kitchen totals from the past 7 days. `weeklyOrders` is the count of sub-orders in the past 7 days. `repeatCustomerPercent` = (unique customers with >1 order in past 7 days) / (total unique customers with ≥1 order in same window) × 100, rounded to nearest integer. `topDish` is the dish with the most units sold (sum of item quantities across all orders); null if no orders exist. Ties broken by dish ID (lowest first).
