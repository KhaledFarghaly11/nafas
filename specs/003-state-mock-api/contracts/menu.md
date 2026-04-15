# Menu API Contract

## getMenu(kitchenId: string)

Lists all available dishes for a kitchen.

**Request**: `kitchenId`: string

**Response**:

```typescript
{ dishes: Dish[] }
```

**Notes**: Only returns dishes where `available === true`. Chef menu management uses `getChefMenu` instead.

---

## getReviews(kitchenId: string)

Lists reviews for a kitchen.

**Request**: `kitchenId`: string

**Response**:

```typescript
{ reviews: Review[], averageRating: number, totalCount: number }
```
