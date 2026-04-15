# Favorites API Contract

## getFavorites(userId: string)

Lists kitchens followed by the user.

**Request**: `userId`: string

**Response**:

```typescript
{ kitchens: Kitchen[] }
```

**Notes**: Returns full Kitchen objects (not just IDs). Split into Open/Closed by the UI based on each kitchen's current schedule.

---

## followKitchen(userId: string, kitchenId: string)

Follows a kitchen.

**Request**: `userId`: string, `kitchenId`: string

**Response (success)**:

```typescript
{
  success: true;
}
```

**Response (error)**:

```typescript
{ success: false, error: { code: 'NOT_FOUND' | 'ALREADY_FOLLOWING' } }
```

**Side effects**: Adds follow record to mock DB.

---

## unfollowKitchen(userId: string, kitchenId: string)

Unfollows a kitchen.

**Request**: `userId`: string, `kitchenId`: string

**Response (success)**:

```typescript
{
  success: true;
}
```

**Response (error)**:

```typescript
{ success: false, error: { code: 'NOT_FOUND' | 'NOT_FOLLOWING' } }
```

**Side effects**: Removes follow record from mock DB.
