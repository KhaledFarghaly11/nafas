# Nafas Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-12

## Active Technologies

- TypeScript 5.x (strict mode) + Expo SDK 54, Expo Router v6, TanStack React Query v5, Zustand v5 (001-project-setup)
- AsyncStorage (001-project-setup)

## Project Structure

```text
app/                          # Expo Router file-based routing
├── _layout.tsx               # Root layout: auth gate + theme provider
├── auth/                     # Auth shell (no tabs)
├── (customer)/               # Customer shell (tab layout, light theme)
└── (chef)/                   # Chef shell (tab layout, dark theme)

src/
├── api/                      # Mock API layer
├── components/               # Shared UI components
├── design/                   # Design system tokens/theme
├── hooks/                    # React Query hooks
├── stores/                   # Zustand stores
├── i18n/                     # Internationalization
├── lib/                      # Utilities
└── types/                    # Shared TypeScript types

__tests__/                    # Test files
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.x: Follow standard conventions

## Recent Changes

- 001-project-setup: Added TypeScript 5.x (strict mode) + Expo SDK 54, Expo Router v6, TanStack React Query v5, Zustand v5, React Native 0.81

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
