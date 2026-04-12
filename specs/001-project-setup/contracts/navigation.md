# Navigation Contract

**Feature**: 001-project-setup
**Version**: 1.0.0
**Date**: 2026-04-12

## Overview

Defines the route structure, guard behavior, and deep link handling for the Nafas app. All navigation follows Expo Router's file-based routing convention.

## Route Map

### Auth Group (`/auth/`)

Unauthenticated screens. No tab navigation. Accessible only when no session exists.

| Route                 | Screen        | Description                                   |
| --------------------- | ------------- | --------------------------------------------- |
| `/auth/welcome`       | Welcome       | App branding + phone number input (mock auth) |
| `/auth/phone`         | Phone         | Phone entry placeholder (Phase 4)             |
| `/auth/otp`           | OTP           | OTP verification placeholder (Phase 4)        |
| `/auth/profile-setup` | Profile Setup | Name + area placeholder (Phase 4)             |

### Customer Group (`/(customer)/`)

Authenticated customer screens. 4-tab bottom navigation. Light theme.

| Route                           | Tab       | Screen         | Description                                       |
| ------------------------------- | --------- | -------------- | ------------------------------------------------- |
| `/(customer)/home`              | Home      | Home           | Placeholder: area selector, search, kitchen cards |
| `/(customer)/home/kitchen/[id]` | Home      | Kitchen Detail | Placeholder: kitchen info + menu                  |
| `/(customer)/favorites`         | Favorites | Favorites      | Placeholder: followed kitchens                    |
| `/(customer)/cart`              | Cart      | Cart           | Placeholder: cart items + totals                  |
| `/(customer)/checkout`          | Cart      | Checkout       | Placeholder: address + payment                    |
| `/(customer)/orders`            | Orders    | Orders         | Placeholder: active/past orders                   |
| `/(customer)/orders/[id]`       | Orders    | Order Detail   | Placeholder: timeline + items                     |
| `/(customer)/profile`           | Profile   | Profile        | Placeholder: name, phone, area, logout            |

### Chef Group (`/(chef)/`)

Authenticated chef screens. 5-tab bottom navigation. Dark theme.

| Route                        | Tab       | Screen       | Description                              |
| ---------------------------- | --------- | ------------ | ---------------------------------------- |
| `/(chef)/dashboard`          | Dashboard | Dashboard    | Placeholder: today's summary             |
| `/(chef)/orders`             | Orders    | Orders       | Placeholder: incoming + active orders    |
| `/(chef)/orders/[id]`        | Orders    | Order Detail | Placeholder: full order + status actions |
| `/(chef)/menu`               | Menu      | Menu         | Placeholder: dish list + availability    |
| `/(chef)/menu/edit/[dishId]` | Menu      | Edit Dish    | Placeholder: dish form                   |
| `/(chef)/schedule`           | Schedule  | Schedule     | Placeholder: weekly schedule             |
| `/(chef)/stats`              | Stats     | Stats        | Placeholder: analytics                   |

### Deep Link Routes

| Route             | Scheme                                              | Description                          |
| ----------------- | --------------------------------------------------- | ------------------------------------ |
| `/payment-return` | `nafas://payment-return?status=success&orderId=XYZ` | Payment return handler (placeholder) |

## Route Guards

### Auth Guard (Root Layout)

Executes on every navigation event. Priority: auth check → role check → render.

```
IF no session exists:
  → redirect to /auth/welcome
  → prevent access to any (customer)/ or (chef)/ route

IF session exists with role 'customer':
  → allow access to (customer)/ routes
  → redirect any (chef)/ route to /(customer)/home

IF session exists with role 'chef':
  → allow access to (chef)/ routes
  → redirect any (customer)/ route to /(chef)/dashboard
```

### Initial Routing

After successful authentication:

```
IF role === 'customer':
  → navigate to /(customer)/home (replace, not push)

IF role === 'chef':
  → navigate to /(chef)/dashboard (replace, not push)
```

### Session Restoration

On app launch with persisted session:

```
IF valid session exists:
  → skip /auth/welcome
  → navigate directly to role-matched shell home

IF session is null, corrupted, or partial:
  → navigate to /auth/welcome
  → clear any invalid session data
```

## Tab Navigation

### Customer Tabs (Bottom Navigation)

| Index | Label (EN) | Label (AR) | Icon      | Route                   |
| ----- | ---------- | ---------- | --------- | ----------------------- |
| 0     | Home       | الرئيسية   | home      | `/(customer)/home`      |
| 1     | Favorites  | المفضلة    | heart     | `/(customer)/favorites` |
| 2     | Orders     | الطلبات    | clipboard | `/(customer)/orders`    |
| 3     | Profile    | الحساب     | user      | `/(customer)/profile`   |

### Chef Tabs (Bottom Navigation)

| Index | Label (EN) | Label (AR)  | Icon      | Route               |
| ----- | ---------- | ----------- | --------- | ------------------- |
| 0     | Dashboard  | لوحة التحكم | grid      | `/(chef)/dashboard` |
| 1     | Orders     | الطلبات     | clipboard | `/(chef)/orders`    |
| 2     | Menu       | القائمة     | book      | `/(chef)/menu`      |
| 3     | Schedule   | الجدول      | calendar  | `/(chef)/schedule`  |
| 4     | Stats      | الإحصائيات  | bar-chart | `/(chef)/stats`     |

## Deep Link Validation

Per Constitution Principle VI, deep link routes must be validated against the current session before navigation proceeds.

```
nafas://payment-return:
  IF no session → redirect to /auth/welcome
  IF customer session → allow (for future payment flow)
  IF chef session → redirect to /(chef)/dashboard (chefs don't make payments)
```
