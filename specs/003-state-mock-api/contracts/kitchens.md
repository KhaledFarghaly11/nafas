# Kitchens API Contract

## getKitchens(filters?: KitchenFilters)

Lists kitchens with optional filters.

**Request**:

```typescript
interface KitchenFilters {
  area?: string;
  isOpen?: boolean;
  cuisineTag?: string;
  minRating?: number;
  isVerified?: boolean;
  search?: string;
}
```

**Response**:

```typescript
{ kitchens: Kitchen[], total: number }
```

**Notes**: `search` matches against kitchen name (AR/EN) and dish names (AR/EN) in that kitchen. `isOpen` is derived from the kitchen's schedule and current time.

**Pagination**: Deferred to real backend integration. MVP returns all matching results. The `total` field is included in the response shape to support future pagination without contract changes.

---

## getKitchenDetail(id: string)

Gets full details for a single kitchen, including its dishes, reviews, and schedule.

**Request**: `id`: Kitchen ID

**Response (success)**:

```typescript
{ kitchen: Kitchen, dishes: Dish[], reviews: Review[], schedule: Schedule }
```

**Response (error)**:

```typescript
{ success: false, error: { code: 'NOT_FOUND' } }
```

---

## searchKitchens(query: string)

Searches kitchens and dishes by name.

**Request**: `query`: string (min 1 char)

**Response**:

```typescript
{ kitchens: Kitchen[], dishes: Dish[] }
```

**Notes**: Returns matching kitchens and matching dishes (with their kitchen reference). Searches both Arabic and English name fields.
