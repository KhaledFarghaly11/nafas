# Nafas Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-12

## Active Technologies

- TypeScript 5.x (strict mode) + Expo SDK 54, Expo Router v6, TanStack React Query v5, Zustand v5 (001-project-setup)
- AsyncStorage (001-project-setup)
- i18next + react-i18next, expo-font, expo-updates, @expo/vector-icons/Feather (002-design-system-i18n)

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
- 002-design-system-i18n: Added i18next + react-i18next, expo-font, expo-updates, @expo/vector-icons/Feather

<!-- MANUAL ADDITIONS START -->

## Design Context

### Brand Personality

**Warm, honest, homemade** — inviting like a friend's kitchen, straightforward and real, celebrating imperfection and personality over corporate polish.

### Users

- **Customers**: Egyptians wanting homemade food. Browse when hungry. Trust the cook personally — relationship, not transaction.
- **Chefs (Homemakers)**: Egyptian women cooking from their own kitchens. May not be tech-savvy. Need clarity, simplicity, respect. Dark mode (evening kitchen context).

### Emotional Goals

- **Primary**: Hungry and curious — appetite appeal is the #1 design priority
- **Secondary**: Comforted and connected — trustworthy, personal, rooted in Egyptian food culture

### Anti-References

- NOT like Talabat/Uber Eats — no corporate, transactional, blue/white delivery app feel

### Design Principles

1. **Appetite First** — Every screen should make you hungrier. Food imagery, warm colors, generous spacing.
2. **People Over Businesses** — Always surface the cook behind the food. Names, faces, stories.
3. **Honest Warmth** — No decorative UI that doesn't serve the user. No stock patterns. Kitchen feel, not boardroom.
4. **Bilingual by Nature** — Arabic-first, then verify English. RTL is the primary layout direction.
5. **Two Worlds, One Brand** — Customer (light) and chef (dark) share the same soul but adapt to context. Unified through shared tokens.

### Color Philosophy

- Clay (#C1714F) = brand — CTAs and key interactions
- Saffron (#E8A838) = spice — highlights, badges, attention
- Cream (#FAF3E8) = tablecloth — warm inviting background
- Mint (#7DADA0) & Rose (#D4927A) = garnish — use sparingly for status/variety
<!-- MANUAL ADDITIONS END -->
