# Chef Schedule API Contract

## getChefSchedule(chefId: string)

Gets the weekly schedule for the chef's kitchen.

**Request**: `chefId`: string

**Response**:

```typescript
{
  schedule: Schedule;
}
```

---

## updateChefSchedule(chefId: string, schedule: DayScheduleInput[])

Updates the weekly schedule for the chef's kitchen.

**Request**:

```typescript
interface DayScheduleInput {
  day: 'sat' | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri';
  isOpen: boolean;
  openTime?: string;
  closeTime?: string;
}
```

**Response (success)**:

```typescript
{ success: true, schedule: Schedule }
```

**Response (error)**:

```typescript
{ success: false, error: { code: 'INVALID_INPUT' | 'NOT_FOUND' | 'INVALID_TIMES' } }
```

**Validation**: Must provide exactly 7 day entries. If `isOpen`, `openTime` and `closeTime` are required and `openTime < closeTime`.

**Side effects**: Updates mock DB. Invalidates kitchen detail queries (isOpen status may change).
