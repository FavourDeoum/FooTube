You are a backend engineer building the backend for a Next.js food recommendation app. The frontend already has modes for personalized, quick, and explore recommendations and uses Clerk for auth. The backend should be implemented using Supabase for database and auth, with future support for Supabase Edge Functions or Next.js API routes.

Your tasks:

1. Set up Supabase with environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```
2. Design the database schema:
   - `users` / `profiles`: name, age, gender, preferences JSON.
   - `dishes`: id, name, description, ingredients JSON, nutritional_info JSON, category, meal_type array, image_url, etc.
   - `recommendations`: user_id, dish_id, reason, score, created_at.
   - `user_preferences`: user_id, health_conditions array, dietary_preference, food_allergies array, activity_level, meal_category.
   - `chat_messages`: user_id, message, role (user/assistant), timestamp.
3. Add authentication integration and RLS policies so users can only access their own data.

Core API endpoints to implement:

- `GET /api/dishes`: Return all dishes, with support for optional filtering by category and meal type.
- `GET /api/dishes/[id]`: Return a single dish by ID.
- `POST /api/recommendations/quick`: Input `{ mealType, foodCategory }`; query dishes where `meal_type` includes `mealType` and `category` matches `foodCategory`; return top 4-6 dishes.
- `POST /api/recommendations/personalized`: Input full personalized profile data; save or update user preferences in the database; filter dishes by `meal_category`, `dietary_preference`, and exclude allergens; score matches by health conditions and activity level; return top 4 dishes with recommendation reasons.
- `GET /api/user/profile`: Return saved user preferences.
- `POST /api/user/profile`: Save or update user preferences.

Advanced features to add later:

- `POST /api/chat`: Accept `{ messages: ChatMessage[] }`, integrate OpenAI or similar to generate assistant responses using stored user preferences, and persist conversation history.
- `GET /api/explore`: Return random or trending dishes, with optional popularity / rating filters.
- Analytics: track recommendation clicks/views and collect user feedback to refine scoring.

Testing and deployment:

- Add unit tests for backend logic.
- Add integration tests covering API routes and frontend interactions.
- Deploy the frontend to Vercel/Netlify and use Supabase for the backend.
- Set up CI/CD for backend API updates.

Tools and dependencies:
- Supabase for database and auth.
- OpenAI API for chat and advanced recommendation reasoning.
- Zod for request validation.
- Supabase client or Prisma for database access.

Constraints:
- Maintain privacy for health data.
- Keep initial implementation simple with mock fallback behavior during development.
- Optimize database queries later as usage grows.

Write the backend implementation plan and API definitions based on these requirements.