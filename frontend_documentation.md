# Sawa Food Project: Frontend Architecture & Implementation Guide

This document provides a comprehensive breakdown of the Next.js frontend for the Sawa Food Project. It outlines the core features, how they are technically implemented, the directory structure, and the user flows.

## Overview

The frontend is a modern, responsive web application built to provide users with personalized Cameroonian meal recommendations and an interactive AI culinary assistant (CamChef).

**Tech Stack:**
* **Framework**: Next.js (App Router)
* **UI Library**: React 19, TailwindCSS 4
* **Icons**: Lucide React
* **Authentication**: Clerk (`@clerk/nextjs`)
* **Database/Storage Client**: Supabase (`@supabase/supabase-js`)

---

## 1. What Has Been Implemented

The frontend encompasses several major functional areas:
1. **Landing Page**: An engaging entry point showcasing the platform's features (Personalized, Quick, Explore modes) with dynamic, responsive design.
2. **Personalized Health Profiling**: A multi-step form to collect user demographics, health conditions (Diabetes, BP, etc.), allergies, and dietary preferences.
3. **Admin Dashboard (SawaAdmin)**: A dedicated management interface for creating, editing, and deleting dishes, including image uploads to cloud storage.
4. **CamChef Chatbot Widget**: A globally accessible floating action button (FAB) that opens a chat drawer. It supports persistent session history, text-based chat, and meal identification via image uploads.
5. **API & Data Layer**: A robust networking layer that intelligently switches between local and production backends, with fallbacks to direct Supabase queries if the backend is unreachable.

---

## 2. Where & How It Was Implemented

### A. Core Configuration & API Layer
* **Location**: `lib/api.ts`, `lib/supabase.ts`
* **How it works**:
  * Initializes the Supabase client using environment variables.
  * **API Connectivity**: Defines the `BACKEND_URL` by checking if the app is running in a local dev environment (`127.0.0.1:8000`) or production (`Render`).
  * **Functions**: Wraps calls to the backend endpoints (e.g., `getPersonalizedRecommendations`, `getExploreFeed`, `sendChatMessage`, `identifyMealFromImage`). Includes a `fetchWithTimeout` wrapper to handle cold-start delays from the backend gracefully.

### B. The Landing Page
* **Location**: `app/page.tsx`, `app/components/ModeCard.tsx`
* **How it works**:
  * Uses a responsive grid layout to present the "Hero" section and the three "Modes" (Personalized, Quick, Explore).
  * Styled with a mix of TailwindCSS and specific inline CSS objects for precise, component-scoped styling (e.g., custom border radii, shadow transitions).

### C. The Personalized Recommendation Flow
* **Location**: `app/personalized/page.tsx`, `app/components/RecommendationCard.tsx`
* **How it works**:
  * **Authentication Gate**: Uses Clerk's `useUser()` hook. If a user is not authenticated, they are shown a locked screen with a `<SignInButton>`.
  * **State Management**: Uses a `step` variable (0, 1, 2) to paginate a form:
    1. *Basic Info*: Name, Age, Gender, Location.
    2. *Health*: Health conditions (multi-select ToggleChips).
    3. *Preferences*: Diet type, Allergies, Activity Level, Meal Category.
  * **Data Syncing**: On load, it fetches the user's existing profile from the Supabase `profiles` table. On submission, it performs an `upsert` to save the new profile data.
  * **Dashboard**: After submission, it calls `getPersonalizedRecommendations` and displays the fetched dishes using `RecommendationCard` components, factoring in the current time of day (e.g., greeting with "Good Morning" and showing "Breakfast" meals).

### D. The Admin Dashboard (SawaAdmin)
* **Location**: `app/admin/page.tsx`
* **How it works**:
  * Implements a responsive sidebar layout (collapsible on mobile).
  * **Menu Overview**: Fetches and lists all dishes in a table format with search filtering.
  * **Add/Edit Meal**: A comprehensive form capturing macros (calories, protein, carbs), dietary labels, ingredients, and preparation steps.
  * **Image Uploads**: Handles file selection, generates a unique file name, uploads the image to the Supabase `dish-images` storage bucket, retrieves the public URL, and saves it alongside the dish metadata in the database.

### E. CamChef Chatbot Widget
* **Location**: `app/components/ChatbotWidget.tsx`
* **How it works**:
  * Rendered as a floating button in the bottom right corner.
  * **State**: Manages `view` (chat vs. sessions list), `messages` array, and `imageFile` for uploads.
  * **Text Chat**: Takes user input, appends it to the local state, and calls `sendChatMessage`. Replaces markdown formatting (like `*smiles*` or `**bold**`) with emojis and HTML tags before rendering.
  * **Image Vision**: Includes a hidden `<input type="file">`. If an image is selected, it shows a preview strip. On send, it calls `identifyMealFromImage` using `FormData`.
  * **Session Management**: Can load previous sessions from the database, allowing users to resume past conversations.

---

## 3. The Flow of Work (System Interactions)

### Flow 1: User Onboarding & Profiling
1. User clicks "Get Personalized Recs" on the landing page.
2. If not signed in, Clerk prompts them to log in/sign up.
3. User completes the 3-step health profile form.
4. The frontend saves the profile to the Supabase `profiles` table.
5. The frontend calls the backend API (`/api/feed/{user_id}`) with the profile context.
6. The frontend receives the tailored meal list and transitions the UI from "form mode" to "dashboard mode", displaying the meals.

### Flow 2: Interacting with the CamChef AI
1. User clicks the FAB to open the chat drawer.
2. **Text Request**: User types a question. The UI updates immediately with the user's bubble and a typing indicator for the AI. The frontend hits `/api/chat`. The response is added to the UI.
3. **Image Request**: User clicks the image icon, selects a photo of a meal. A preview appears above the text input. User types an optional question and hits send. The frontend posts `multipart/form-data` to `/api/identify-meal`. The AI identifies the dish, and the response is rendered in the chat.
4. **History**: User clicks the "History" icon in the header. The frontend fetches past session IDs. Clicking a session loads the past messages into the chat window.

### Flow 3: Admin Content Management
1. Admin navigates to `/admin`.
2. To add a meal, they fill out the form and attach a photo.
3. On submit, the frontend uploads the photo to Supabase Storage.
4. Once the photo URL is returned, the frontend inserts a new row into the `dishes` table.
5. The UI shows a success banner and refreshes the "Overview" table to display the newly added dish.
