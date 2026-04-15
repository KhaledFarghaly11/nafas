# Chef Menu API Contract

## getChefMenu(chefId: string)

Lists ALL dishes for the chef's kitchen, including unavailable ones.

**Request**: `chefId`: string

**Response**:

```typescript
{ dishes: Dish[] }
```

**Notes**: Unlike `getMenu` (customer-facing), this returns dishes regardless of `available` status.

---

## createDish(chefId: string, input: CreateDishInput)

Adds a new dish to the chef's kitchen.

**Request**:

```typescript
interface CreateDishInput {
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  category: string;
  categoryEn: string;
  prepTime: number;
  maxPortions: number;
  available?: boolean;
}
```

**Response (success)**:

```typescript
{ success: true, dish: Dish }
```

**Response (error)**:

```typescript
{ success: false, error: { code: 'INVALID_INPUT' | 'NOT_FOUND' } }
```

**Side effects**: Creates dish in mock DB with auto-incremented ID. Invalidates chef menu and kitchen detail queries.

---

## updateDish(dishId: string, input: Partial<CreateDishInput>)

Updates an existing dish's details.

**Request**: `dishId`, partial update fields

**Response (success)**:

```typescript
{ success: true, dish: Dish }
```

**Response (error)**:

```typescript
{ success: false, error: { code: 'NOT_FOUND' | 'INVALID_INPUT' } }
```

---

## deleteDish(dishId: string)

Deletes a dish from the chef's menu.

**Request**: `dishId`: string

**Response (success)**:

```typescript
{
  success: true;
}
```

**Response (error)**:

```typescript
{ success: false, error: { code: 'NOT_FOUND' } }
```

**Side effects**: Removes dish from mock DB. Invalidates related queries.

---

## toggleDishAvailability(dishId: string)

Toggles a dish's `available` boolean.

**Request**: `dishId`: string

**Response (success)**:

```typescript
{ success: true, dish: Dish }
```

**Response (error)**:

```typescript
{ success: false, error: { code: 'NOT_FOUND' } }
```
