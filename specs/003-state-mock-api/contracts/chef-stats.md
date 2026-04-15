# Chef Stats API Contract

## getChefStats(chefId: string)

Returns analytics for the chef's kitchen.

**Request**: `chefId`: string

**Response**:

```typescript
interface ChefStats {
  weeklyIncome: number;
  weeklyOrders: number;
  repeatCustomerPercent: number;
  topDish: { id: string; name: string; nameEn: string; orderCount: number } | null;
}
```

**Notes**: All values are derived from existing orders in the mock DB. `weeklyIncome` is the sum of kitchen totals from the past 7 days. `weeklyOrders` is the count of sub-orders in the past 7 days. `repeatCustomerPercent` is the percentage of customers who ordered more than once. `topDish` is the dish with the most orders; null if no orders exist.
