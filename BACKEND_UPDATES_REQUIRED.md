# Backend Updates Required for New Features

This document outlines the new backend requirements based on recent frontend changes.

## 1. User Location Field

### Database Schema Update
Add `location` column to the `profiles` table:

```sql
ALTER TABLE profiles ADD COLUMN location TEXT;
```

### API Endpoint Changes
The existing `/api/user/profile` endpoints should now handle the new `location` field:

**POST /api/user/profile** (save/update profile)
- Input: Include `location` field
- Expected fields:
  - `id` (user_id)
  - `name`
  - `age`
  - `gender`
  - `location` (NEW - country or region)
  - `health_conditions`
  - `dietary_preference`
  - `food_allergies`
  - `activity_level`
  - `meal_category`

**GET /api/user/profile** (fetch profile)
- Response should now include the `location` field

---

## 2. Dish Sentiment / Reviews System

### Database Schema Addition
Create a new `dish_sentiments` table:

```sql
CREATE TABLE dish_sentiments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dish_id TEXT NOT NULL,
  sentiment VARCHAR(10) NOT NULL CHECK (sentiment IN ('like', 'unlike')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, dish_id)
);

CREATE INDEX idx_dish_sentiments_user_id ON dish_sentiments(user_id);
CREATE INDEX idx_dish_sentiments_dish_id ON dish_sentiments(dish_id);
```

### New API Endpoint
**POST /api/sentiments** (save/update sentiment)
- Input:
  ```json
  {
    "userId": "string",
    "dishId": "string",
    "sentiment": "like" | "unlike"
  }
  ```
- Behavior:
  - Insert new sentiment if user hasn't reviewed this dish
  - Update existing sentiment if user already reviewed this dish
  - Return success status

### Optional: Analytics Endpoint
**GET /api/dishes/:id/sentiment** (fetch sentiment statistics)
- Returns:
  - Total like count
  - Total unlike count
  - Like percentage
  - Recent sentiment from authenticated user (if applicable)

---

## 3. Row Level Security (RLS) Policies

### For `profiles` table:
- Users can only view/update their own profile

### For `dish_sentiments` table:
- Users can view all sentiments (public analytics)
- Users can only create/update sentiments on their own row
- Users cannot delete sentiments (soft update with null instead if needed)

---

## 4. Migration Priority

1. **High Priority**: Add `location` field to profiles table (affects user registration flow)
2. **High Priority**: Create `dish_sentiments` table and `/api/sentiments` endpoint (affects dish details page)
3. **Medium Priority**: Add sentiment analytics endpoints

---

## 5. Frontend Integration Notes

- All API calls include proper error handling with fallback to mock behavior
- Location field is validated as required (non-empty string)
- Sentiment updates are optimistic: UI updates immediately, then syncs with backend
- Sentiments are persisted per user per dish (unique constraint)
