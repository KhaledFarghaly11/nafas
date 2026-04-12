# Quickstart: Project Setup

**Feature**: 001-project-setup
**Date**: 2026-04-12

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- iOS Simulator (Xcode 15+) or Android Emulator (Android Studio)
- Expo Go app on physical device (optional, for testing)

## Setup Steps

### 1. Initialize the Project

```bash
npx create-expo-app nafas --template blank-typescript
cd nafas
```

### 2. Install Core Dependencies

```bash
# Navigation
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar

# State Management
npx expo install @react-native-async-storage/async-storage
npm install zustand @tanstack/react-query

# Developer Tooling
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react-native eslint-plugin-import prettier husky @commitlint/cli @commitlint/config-conventional jest @testing-library/react-native @testing-library/jest-dom
```

### 3. Configure Expo Router

Update `package.json`:

```json
{
  "main": "expo-router/entry"
}
```

Update `app.config.ts`:

```typescript
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Nafas',
  slug: 'nafas',
  scheme: 'nafas',
  version: '1.0.0',
  orientation: 'default',
  icon: './assets/icon.png',
  splash: { image: './assets/splash.png', resizeMode: 'contain', backgroundColor: '#ffffff' },
  ios: { supportsTablet: false, bundleIdentifier: 'com.nafas.app' },
  android: {
    adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#ffffff' },
    package: 'com.nafas.app',
  },
  plugins: ['expo-router'],
});
```

### 4. Create Directory Structure

```bash
# Route groups
mkdir -p app/auth app/(customer)/home app/(customer)/favorites app/(customer)/cart app/(customer)/checkout app/(customer)/orders app/(customer)/profile
mkdir -p app/(chef)/dashboard app/(chef)/orders app/(chef)/menu/edit app/(chef)/schedule app/(chef)/stats

# Source modules
mkdir -p src/api/seeds src/components/primitives src/components/feedback src/components/layout src/components/domain
mkdir -p src/design src/hooks src/stores src/i18n/ar src/i18n/en src/lib src/types

# Tests
mkdir -p __tests__

# GitHub
mkdir -p .github
```

### 5. Configure Developer Tooling

Create `.eslintrc.js`, `.prettierrc.js`, `jest.config.js`, `commitlint.config.js`, and run:

```bash
npx husky init
# Add commitlint hook
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

### 6. Start Development Server

```bash
npx expo start
```

## Verification Checklist

After setup, verify each item:

- [ ] `npx expo start` launches without errors
- [ ] App renders on iOS Simulator or Android Emulator
- [ ] `npm run lint` executes without configuration errors
- [ ] `npm test` runs the smoke test successfully
- [ ] `git commit -m "test: invalid"` is rejected by commitlint (after initial commit)
- [ ] Welcome screen appears when no session exists
- [ ] Entering a pre-seeded chef phone number (e.g., `0100000001`) routes to chef shell
- [ ] Entering any other phone number routes to customer shell
- [ ] Customer shell shows 4 tabs with light theme
- [ ] Chef shell shows 5 tabs with dark theme
- [ ] Closing and reopening the app restores the session (no re-auth required)
- [ ] All placeholder screens display their section name

## Key Files to Create

| Priority | File                               | Purpose                                     |
| -------- | ---------------------------------- | ------------------------------------------- |
| P1       | `app/_layout.tsx`                  | Root layout with auth gate + theme provider |
| P1       | `app/auth/welcome.tsx`             | Welcome screen with phone input             |
| P1       | `app/(customer)/_layout.tsx`       | Customer tab navigator (light theme)        |
| P1       | `app/(chef)/_layout.tsx`           | Chef tab navigator (dark theme)             |
| P1       | `src/stores/session-store.ts`      | Zustand persisted session store             |
| P1       | `src/api/mock-server.ts`           | Mock auth function                          |
| P1       | `src/api/seeds/users.ts`           | Pre-seeded chef accounts                    |
| P2       | All placeholder screen files       | Tab content with section name               |
| P2       | `src/hooks/use-auth.ts`            | React Query auth hook                       |
| P2       | `app.config.ts`                    | App configuration with scheme               |
| P2       | `__tests__/smoke.test.ts`          | Smoke test                                  |
| P3       | `.eslintrc.js`                     | Lint configuration                          |
| P3       | `.prettierrc.js`                   | Format configuration                        |
| P3       | `commitlint.config.js`             | Commit message rules                        |
| P3       | `.github/pull_request_template.md` | PR template                                 |
