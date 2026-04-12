# Data Model: Project Setup

**Feature**: 001-project-setup
**Date**: 2026-04-12

## Entities

### UserSession

Represents the authenticated state of a user. Persisted via Zustand + AsyncStorage.

| Field           | Type                           | Required         | Default | Constraints                                                                 |
| --------------- | ------------------------------ | ---------------- | ------- | --------------------------------------------------------------------------- |
| userId          | `string`                       | Yes (after auth) | `null`  | Non-empty string when authenticated                                         |
| role            | `'customer' \| 'chef' \| null` | Yes              | `null`  | Determined by phone number lookup at auth time                              |
| phone           | `string`                       | Yes (after auth) | `null`  | Egyptian phone format (matches pre-seeded chef numbers or any other number) |
| authenticatedAt | `number`                       | Yes (after auth) | `null`  | Unix timestamp of session creation                                          |

**Lifecycle**:

- `null` → User opens app with no stored session → lands on welcome screen
- `authenticated` → User enters phone number → mock auth creates session with role → routed to shell
- `cleared` → User signs out or session data corrupted → session reset to null → lands on welcome screen

**Validation Rules**:

- `role` is derived: if `phone` matches a pre-seeded chef number → `chef`; otherwise → `customer`
- Session must not exist without `userId`, `role`, and `phone` all present (partial = invalid → clear session)
- `role` is immutable within a session (cannot switch roles without sign-out + re-auth)

### ChefPhoneNumber (Seed Data)

Pre-seeded phone numbers that map to chef accounts. Used by mock auth to determine routing.

| Field     | Type     | Required | Description                              |
| --------- | -------- | -------- | ---------------------------------------- |
| phone     | `string` | Yes      | Chef's phone number (e.g., `0100000001`) |
| name      | `string` | Yes      | Chef's display name (e.g., `أم سمية`)    |
| kitchenId | `string` | Yes      | Associated kitchen identifier            |

**Seed Records** (from implementation plan):

- `0100000001` → أم سمية → Umm Samia's Kitchen
- `0100000002` → حاج محمد → Haj Mohamed's Kitchen
- `0100000003` → ست نونه → Sit Nona's Kitchen

### UserRole

Enumeration of possible user roles. Not a persisted entity — a derived attribute of UserSession.

| Value      | Description                        | Shell                                                           | Theme |
| ---------- | ---------------------------------- | --------------------------------------------------------------- | ----- |
| `customer` | End user ordering food             | `(customer)/` tab layout (Home, Favorites, Orders, Profile)     | Light |
| `chef`     | Homemaker cooking and selling food | `(chef)/` tab layout (Dashboard, Orders, Menu, Schedule, Stats) | Dark  |

## Relationships

```
UserSession 1──1 UserRole (derived, not stored separately)
UserRole 1──1 Shell (determines which route group and tab layout)
ChefPhoneNumber *──1 UserSession (lookup: phone match → chef role)
```

## State Transitions

### UserSession

```
[No Session] ──phone entry + mock auth──→ [Authenticated]
[Authenticated] ──sign out──→ [No Session]
[Authenticated] ──corrupted data──→ [No Session] (auto-clear)
[No Session] ──app launch──→ Welcome Screen
[Authenticated] ──app launch──→ Role-matched Shell
```

### Route Guarding

```
Customer Session + Chef Route → Redirect to /(customer)/home
Chef Session + Customer Route → Redirect to /(chef)/dashboard
No Session + Any Route → Redirect to /auth/welcome
```

## Storage

- **Persistence layer**: AsyncStorage via Zustand persist middleware
- **Storage key**: `nafas-session` (namespaced to avoid conflicts)
- **Hydration**: Synchronous on app launch; root layout reads store state before rendering
- **Clear on**: Explicit sign-out, corrupted/unparseable data, partial session (missing required fields)
