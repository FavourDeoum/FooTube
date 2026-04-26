# Frontend Implementation Status

This document summarizes what has been implemented so far in the frontend of the `food-recommendation` app.

## Pages

### Home (`app/page.tsx`)
- Hero section with marketing copy and call-to-action buttons.
- Mode cards for:
  - Personalized recommendations
  - Quick recommendations
  - Explore dishes
- Feature strip highlighting AI-driven, health-aware, chat, and mobile-ready capabilities.
- CTA banner linking to personalized recommendations.

### Quick Recommendations (`app/quick/page.tsx`)
- Two-step selection UI for meal type and food category.
- Validates required selections.
- Calls `getQuickRecommendations` from `lib/api.ts`.
- Shows recommendation results with `RecommendationCard` components.
- Supports reset and retry.
- Includes loading and error states.

### Explore Dishes (`app/explore/page.tsx`)
- Fetches dish data via `fetchDishes()` from `lib/api.ts`.
- Search input for dish name and description.
- Filters by category and meal type.
- Displays results using `DishCard` components.
- Includes loading, empty state, and result count.

### Personalized Recommendations (`app/personalized/page.tsx`)
- Uses Clerk auth with `useUser()` for login state.
- Supports authenticated-only access for the personalized experience.
- Multi-step form collecting:
  - Full name, age, gender
  - Health conditions
  - Dietary preference, allergies, activity level, meal category
- Renders progress UI and step navigation.
- Saves profile data to Supabase via `supabase.from("profiles").upsert(...)`.
- Calls `getPersonalizedRecommendations()` to fetch recommendations.
- Shows a dashboard with personalized dish cards and profile edit flow.
- Includes loading, unauthorized, and error states.

## Components

### `app/components/ChatbotWidget.tsx`
- Floating chat button that opens a chat drawer.
- Sends messages using `sendChatMessage()` from `lib/api.ts`.
- Displays assistant and user message bubbles.
- Only renders when the user is signed in.

### `app/components/RecommendationCard.tsx`
- Card UI for recommended dishes.
- Shows image, category badge, reason text, nutrition highlights, and suitability tags.
- Includes a link to the dish details page.

### `app/components/DishCard.tsx`
- Card UI for dishes in the explore grid.
- Shows image, category badge, description, nutrition facts, and dietary labels.
- Includes a details link.

### `app/components/ModeCard.tsx`
- Mode selection card used on the home page.

### `app/components/ui/LoadingSpinner.tsx`
- Reusable loading spinner component.

## API / Data Layer

### `lib/api.ts`
- `fetchDishes()`: returns all dishes, with fallback to mock data if no backend URL is configured.
- `fetchDishById(id)`: returns a single dish by id.
- `getQuickRecommendations(input)`: returns quick recommendation results using mock filtering.
- `getPersonalizedRecommendations(input)`: returns personalized recommendation results using mock filtering by meal category.
- `sendChatMessage(messages)`: returns a chat reply, using either a backend endpoint or a mock reply list.
- Includes interfaces for `QuickRecommendationInput`, `PersonalizedInput`, and `ChatMessage`.

## Overall Implementation Notes

- The frontend is fully styled with inline React style objects and uses a combination of Lucide icons and Next.js `Image` components.
- There is a working flow for mode selection, quick recommendations, dish exploration, and personalized recommendations.
- Personalized mode includes user authentication gating and profile persistence to Supabase.
- The current data integration is designed to support a backend service if `NEXT_PUBLIC_API_URL` is configured, otherwise it falls back to local mock behavior.
