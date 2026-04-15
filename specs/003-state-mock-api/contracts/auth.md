# Auth API Contract

## login(phone: string, otp: string)

Authenticates a user by phone number and OTP.

**Request**:

- `phone`: string (11 digits, Egyptian format)
- `otp`: string (6 digits, always `123456` for MVP)

**Response (success)**:

```typescript
{ success: true, user: User }
```

**Response (error)**:

```typescript
{ success: false, error: { code: 'INVALID_PHONE' | 'INVALID_OTP' | 'UNKNOWN_PHONE' } }
```

**Side effects**: On success, sets session in sessionStore. If user is a pre-seeded chef, role is `'chef'`.

**Implementation note**: The current codebase implements `login(phone)` without OTP validation (Phase 1). The `otp` parameter and `INVALID_OTP` error code are planned for Phase 2+ when the OTP screen is built. Currently any OTP is accepted.

---

## signup(name: string, area: string, phone: string)

Creates a new customer account.

**Request**:

- `name`: string (1-100 chars)
- `area`: string (must be one of 8 Cairo neighborhoods)
- `phone`: string (11 digits, not already registered)

**Response (success)**:

```typescript
{ success: true, user: User }
```

**Response (error)**:

```typescript
{ success: false, error: { code: 'INVALID_PHONE' | 'PHONE_EXISTS' | 'INVALID_NAME' | 'INVALID_AREA' } }
```

**Side effects**: Creates user in mock DB. Sets session in sessionStore. Always creates a customer role.

**Implementation note**: Signup is planned for Phase 2+. Not yet implemented in the current mock server.

---

## logout()

Clears session and cart. Preserves all other data.

**Request**: None

**Response**: `{ success: true }`

**Side effects**: Clears sessionStore. Clears cartStore.
