# Implementation Plan: Design System + i18n

**Branch**: `001-design-system-i18n` | **Date**: 2026-04-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-design-system-i18n/spec.md`

## Summary

Build the complete design system foundation for Nafas: design tokens (light/dark palettes + spacing/typography/radius/shadows), a theme provider with manual override support, bilingual i18n (Arabic RTL / English LTR) with full-app-reload on language switch, and a library of themed, direction-aware primitive and feedback components. This is Phase 2 of the implementation plan — the foundation that all subsequent feature screens depend on.

## Technical Context

**Language/Version**: TypeScript 5.9 (strict mode)
**Primary Dependencies**: Expo SDK 54, Expo Router 6, React Native 0.81, Zustand 5, i18next + react-i18next (new), expo-font (new), expo-updates (new)
**Storage**: AsyncStorage (persist settings via Zustand persist middleware)
**Testing**: Jest 29 + React Native Testing Library 12
**Target Platform**: iOS / Android (Expo managed workflow)
**Project Type**: Mobile app (React Native / Expo)
**Performance Goals**: Language switch + reload < 5s; component render < 16ms (60fps)
**Constraints**: RTL/LTR requires full app restart; no CSS hacks for direction
**Scale/Scope**: ~20 new component files, 2 locale files, 3 store/theme modifications

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                                    | Status            | Notes                                                                                                                                                                                      |
| -------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| I. Frontend-Only, Backend-Ready              | ✅ PASS           | No backend changes; design system is purely frontend                                                                                                                                       |
| II. Single Source of Truth                   | ✅ PASS           | Theme tokens in context; language in settings-store; no duplication                                                                                                                        |
| III. Role Separation Without App Duplication | ✅ PASS (amended) | Constitution v1.1.0 amended to allow theme override. Principle III now: "Theme defaults to role but MAY be overridden by explicit user preference." See Complexity Tracking for rationale. |
| IV. RTL/LTR Correctness Is Not Optional      | ✅ PASS           | Full i18n with I18nManager, confirmation dialog before reload, RTL verification pass planned                                                                                               |
| V. Design Tokens, Not Hardcoded Styles       | ✅ PASS           | This feature IS the token system; all components consume tokens exclusively                                                                                                                |
| VI. Predictable Navigation with Route Guards | ✅ PASS           | No navigation changes; route guards from Phase 1 remain intact                                                                                                                             |

### Post-Design Re-check

| Principle                                    | Status            | Notes                                                                                     |
| -------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------- |
| I. Frontend-Only, Backend-Ready              | ✅ PASS           | No change                                                                                 |
| II. Single Source of Truth                   | ✅ PASS           | Settings-store owns theme preference + language; ThemeProvider derives active tokens      |
| III. Role Separation Without App Duplication | ✅ PASS (amended) | Constitution v1.1.0 allows override; stored in settings-store, defaults remain role-based |
| IV. RTL/LTR Correctness Is Not Optional      | ✅ PASS           | All components direction-aware; verification pass explicitly planned                      |
| V. Design Tokens, Not Hardcoded Styles       | ✅ PASS           | Token system implemented; no hardcoded values in any component                            |
| VI. Predictable Navigation with Route Guards | ✅ PASS           | No change                                                                                 |

## Project Structure

### Documentation (this feature)

```text
specs/001-design-system-i18n/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── component-contracts.md  # Component API contracts
├── checklists/
│   └── requirements.md  # Quality checklist
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── design/
│   ├── tokens.ts            # MODIFY: expand to full token set
│   ├── theme.tsx            # MODIFY: add override support
│   └── typography.ts        # CREATE: font definitions
├── components/
│   ├── primitives/
│   │   ├── Button.tsx       # CREATE
│   │   ├── Input.tsx        # CREATE
│   │   ├── Text.tsx         # CREATE
│   │   ├── Card.tsx         # CREATE
│   │   ├── Badge.tsx        # CREATE
│   │   ├── Divider.tsx      # CREATE
│   │   └── Icon.tsx         # CREATE
│   ├── layout/
│   │   └── ScreenContainer.tsx  # CREATE
│   ├── feedback/
│   │   ├── Skeleton.tsx     # CREATE
│   │   ├── EmptyState.tsx    # CREATE
│   │   ├── ErrorState.tsx   # CREATE
│   │   └── Toast.tsx        # CREATE (component + provider + hook)
│   └── domain/              # NOT in this feature
├── stores/
│   └── settings-store.ts    # MODIFY: add persistence + themeOverride
├── i18n/
│   ├── index.ts             # CREATE: i18next init
│   ├── ar/
│   │   └── common.json      # CREATE
│   └── en/
│       └── common.json      # CREATE
├── lib/
│   ├── rtl.ts               # CREATE: useRTL hook + utilities
│   └── query-client.ts      # NO CHANGE
└── types/                    # NO CHANGE

app/
└── _layout.tsx              # MODIFY: add font loading, i18n init, ToastProvider
```

**Structure Decision**: Follows the existing project structure from Phase 1. New files added within established directories. No structural changes needed.

## Complexity Tracking

| Violation                                                                                           | Why Needed                                                                                                                                        | Simpler Alternative Rejected Because                                                                                                                            |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Theme override (Constitution III: theme defaults to role and is not intended to be user-toggleable) | Accessibility: chefs in bright environments need light mode; users with visual preferences need choice. Spec clarification explicitly chose this. | Role-locked theme would exclude users who need the opposite theme for accessibility or environmental reasons; modern mobile apps universally offer theme choice |
