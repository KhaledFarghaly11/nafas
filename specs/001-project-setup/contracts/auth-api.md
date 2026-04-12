# Auth API Contract

**Feature**: 001-project-setup
**Version**: 1.0.0
**Date**: 2026-04-12

## Overview

This contract defines the mock authentication API for Phase 1. The API boundary follows Constitution Principle I — swapping the mock implementation for a real backend must require zero changes to UI or state-management code.

## Endpoints

### `login(phone: string): AuthResult`

Authenticates a user by phone number. In Phase 1 (mock), this is a simple lookup against pre-seeded data. In production, this would initiate an OTP flow.

**Request**:
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| phone | `string` | Yes | Non-empty, numeric characters only |

**Response** (`AuthResult`):
| Field | Type | Description |
|-------|------|-------------|
| success | `boolean` | Whether authentication succeeded |
| user | `User \| null` | User object on success, null on failure |
| error | `AuthError \| null` | Error details on failure, null on success |

**User**:
| Field | Type | Description |
|-------|------|-------------|
| id | `string` | Unique user identifier |
| phone | `string` | User's phone number |
| role | `'customer' \| 'chef'` | Determined by phone number lookup |
| name | `string` | Display name (pre-seeded for chefs, placeholder for customers) |

**AuthError**:
| Field | Type | Description |
|-------|------|-------------|
| code | `string` | Error code (e.g., `INVALID_PHONE`, `AUTH_FAILED`) |
| message | `string` | Human-readable error description |

**Mock Behavior** (Phase 1):

- If `phone` matches a pre-seeded chef number → return `success: true` with `role: 'chef'`
- If `phone` is any other non-empty string → return `success: true` with `role: 'customer'` (auto-create customer)
- If `phone` is empty or non-numeric → return `success: false` with `INVALID_PHONE` error

### `logout(): void`

Clears the current session. No request body. No response data (void).

**Behavior**: Removes session from persisted store. Next app launch or navigation event will redirect to welcome screen.

### `getSession(): UserSession | null`

Reads the current session from the store. Used by the auth gate on app launch.

**Response**:
| Field | Type | Description |
|-------|------|-------------|
| userId | `string \| null` | User identifier if authenticated |
| role | `'customer' \| 'chef' \| null` | User role if authenticated |
| phone | `string \| null` | Phone number if authenticated |
| authenticatedAt | `number \| null` | Timestamp if authenticated |

**Mock Behavior** (Phase 1):

- Returns stored session from Zustand (persisted in AsyncStorage)
- Returns `null` if no session or session data is corrupted/unparseable

## Error Codes

| Code                | HTTP Equivalent | Description                          | Recovery                                |
| ------------------- | --------------- | ------------------------------------ | --------------------------------------- |
| `INVALID_PHONE`     | 400             | Phone number is empty or non-numeric | Show validation message on input        |
| `AUTH_FAILED`       | 401             | Authentication failed                | Show error, allow retry                 |
| `SESSION_EXPIRED`   | 401             | Session is no longer valid           | Clear session, redirect to welcome      |
| `SESSION_CORRUPTED` | 500             | Stored session data is unreadable    | Auto-clear session, redirect to welcome |

## Future Contract (Phase 4 — Not Implemented in Phase 1)

The following endpoints will be added when real OTP auth is implemented:

- `sendOtp(phone: string): OtpResult` — Send OTP to phone number
- `verifyOtp(phone: string, code: string): AuthResult` — Verify OTP code
- `signup(name: string, area: string, phone: string): AuthResult` — Create new customer account

Phase 1's `login(phone)` is a simplified stand-in for this flow. The `AuthResult` shape is identical, ensuring a clean swap.
