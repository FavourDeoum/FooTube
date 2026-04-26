# Frontend Implementation Plan  
## AI-Powered Food Recommendation and Exploration System

---

# Overview

The frontend of the AI-Powered Food Recommendation and Exploration System is designed to provide an interactive and user-friendly interface that enables users to explore local dishes, receive personalized meal recommendations, and can interact with an intelligent chatbot.

The frontend communicates with the backend API (implemented using FastAPI) to send user inputs, retrieve recommendations, and display dish-related information.

The system is structured around multiple recommendation modes to support different user needs and interaction styles.

---

# Frontend Objectives

The frontend is designed to:

- Provide intuitive navigation across different recommendation modes
- Collect relevant user information for personalized food recommendations
- Display recommended dishes dynamically
- Allow users to explore available dishes
- Support chatbot-based interaction
- Enable smooth communication with backend APIs
- Provide responsive design for mobile and desktop users

---

# Core Frontend Features

The frontend consists of the following core functional features:

1. Multi-Mode Recommendation Interface  
2. Personalized Recommendation Mode  
3. Quick Recommendation Mode  
4. Explore Dishes Mode  
5. Chatbot Interaction Interface  
6. Dish Details Viewer  
7. Recommendation Results Display  
8. Error Handling and Feedback System

---

# System Navigation Flow

The frontend navigation follows a structured flow that allows users to select how they want to interact with the system.

## Main Navigation Options

When users access the system, they are presented with three primary modes:

1. Personalized Recommendation Mode  
2. Quick Recommendation Mode  
3. Explore Dishes Mode  

This multi-mode design improves flexibility and user experience.

---

# Mode 1: Personalized Recommendation Mode

## Description

The Personalized Recommendation Mode provides highly tailored meal suggestions based on detailed user information.

This mode collects structured user data for recommendations.

---

## Personalized Mode Workflow

1. User selects **Personalized Mode**
2. If user is not signed up, user should be navigated to sign up page. Then, user is navigated to the personalized user information mode form
3. User completes a **User Information Form**
4. User submits health and dietary preferences
5. System sends user data to backend
6. Backend generates personalized recommendations
7. Recommendations are displayed to the user

---

## User Information Fields Collected

The Personalized Mode collects the following information:

### Basic User Information

- Name
- Age
- Gender

### Health Information

- Health conditions  
  Example:
  - BP
  - Hypertension
  - Diabetes status
  - Allergies
  - Ulcer
  - Weight goals (lose, maintain or gain)
  - None

### Dietary Preferences

- Preferred food type  
  Example:
  - Protein-rich meals
  - Low-carb meals
  - Vegetarian meals

- Food allergies  
  Example:
  - Groundnuts
  - Seafood
  - None

### Lifestyle Information

- Activity level  
  Example:
  - Low activity
  - Moderate activity
  - High activity

### Meal Preferences

- Preferred meal category  
  Example:
  - Breakfast
  - Lunch
  - Dinner

---

# Chatbot Interface

## Description

Chat bot iterface should be available for all users, to be able to interact with it. Asking various questions about available meals or recommended meals

The chatbot helps users understand what the meal typically has by asking additional questions.

---

## Chatbot Features

The chatbot supports:

- Interactive question-response conversation
- Follow-up dietary questions
- Clarification of preferences
- Suggestion explanations
- Meal adjustment recommendations

---

## Chatbot Workflow

1. Chat interface loads
2. System displays greeting message
3. Chatbot asks follow-up questions
4. User responds through chat input
5. Messages are sent to backend
6. Backend processes conversation context
7. Response to questions are been returned

---

## Chat Interface Components

The chatbot interface includes:

- Message display window
- User input text box
- Send message button
- Typing indicator
- Chat history viewer

---

# Mode 2: Quick Recommendation Mode

## Description

The Quick Recommendation Mode provides fast suggestions using minimal input.

This mode is designed for users who need quick meal suggestions without detailed personalization.

---

## Quick Mode Workflow

1. User selects **Quick Recommendation Mode**
2. User selects simple preference options
3. Request is sent to backend
4. Recommendations are generated
5. Results are displayed

---

## Quick Mode Inputs

Typical inputs include:

- Meal type  
  Example:
  - Breakfast
  - Lunch
  - Dinner

- Food category  
  Example:
  - Traditional meals
  - Light meals
  - Protein meals

---

# Mode 3: Explore Dishes Mode

## Description

The Explore Mode allows users to browse all available dishes without requesting recommendations.

This mode supports discovery and learning about available meals.

---

## Explore Mode Workflow

1. User selects **Explore Mode**
2. System retrieves list of dishes
3. Dish cards are displayed
4. User clicks on a dish
5. Dish details page opens

---

# Dish Display System

Each dish is displayed using a card-based interface.

---

## Dish Card Components

Each dish card displays:

- Dish Name
- Dish Image
- Category
- Short Description
- View Details Button

---

# Dish Details Page

When a user selects a dish, the system displays detailed information.

---

## Dish Details Content

The dish details page includes:

- Dish name
- Ingredients list
- Nutritional information
- Preparation instructions
- Dietary suitability labels

Example Labels:

- High Protein
- Low Sodium
- Suitable for Diabetes

---

# Recommendation Results Display

After recommendations are generated, the system displays results using structured recommendation cards.

---

## Recommendation Card Content

Each recommendation card includes:

- Dish name
- Dish image
- Recommendation reason
- Nutritional highlights
- Suitability tags

---

# API Integration Layer

The frontend communicates with the backend through APIs.

---

## Primary API Endpoints

### Fetch All Dishes




