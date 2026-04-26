export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Dish {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  image: string;
  category: "Traditional" | "Soup" | "Protein" | "Breakfast" | "Light" | "Snack" | "All";
  mealType: ("Breakfast" | "Lunch" | "Dinner" | "All")[];
  dietaryLabels: string[];
  suitableFor: string[];
  ingredients: string[];
  preparationSteps: string[];
  nutrition: NutritionInfo;
}

export const dishes: Dish[] = [
  {
    id: "achu",
    name: "Achu",
    shortDescription: "Pounded cocoyam served with distinctive yellow soup.",
    description: "Achu is a traditional Cameroonian dish from the Northwest region. It features pounded taro (cocoyam) served with a vibrant, spicy, and earthy yellow soup made from palm oil, limestone, and traditional spices, usually accompanied by assorted meats.",
    image: "/achu3.jpeg",
    category: "Traditional",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["Gluten-Free", "High-Calorie"],
    suitableFor: ["Weight Gain", "Energy Boost"],
    ingredients: ["Taro (Cocoyam)", "Palm oil", "Limestone (Akanwu)", "Assorted meats", "Achu spices"],
    preparationSteps: [
      "Boil and pound the cocoyam until extremely smooth.",
      "Prepare the yellow soup by mixing palm oil with limestone water to emulsify.",
      "Add traditional spaces, cooked meat, and bouillon.",
      "Serve the soup alongside the pounded taro."
    ],
    nutrition: { calories: 650, protein: 30, carbs: 75, fat: 28, fiber: 8 }
  },
  {
    id: "cornchaff",
    name: "Cornchaff",
    shortDescription: "A hearty stew of corn and beans.",
    description: "Cornchaff is a savory and thick one-pot meal uniting boiled corn kernels and beans. Cooked with palm oil, smoked fish, and aromatic spices, it's a staple comfort food known for its high fiber and protein content.",
    image: "/Cornchaff (Adalu) (2).jpg",
    category: "Traditional",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["High-Fiber", "High-Protein", "Dairy-Free"],
    suitableFor: ["Heart Health", "Muscle Building", "Digestive Health"],
    ingredients: ["Whole corn kernels", "Red or black beans", "Palm oil", "Smoked fish or meat", "Onions", "Spices"],
    preparationSteps: [
      "Boil the corn and beans until deeply tender.",
      "In a separate pot, sauté onions and smoked fish in palm oil.",
      "Mix the cooked corn and beans into the palm oil base.",
      "Simmer together until the flavors meld into a thick stew."
    ],
    nutrition: { calories: 480, protein: 22, carbs: 65, fat: 18, fiber: 15 }
  },
  {
    id: "eru",
    name: "Eru",
    shortDescription: "Rich vegetable soup made from finely shredded eru leaves and waterleaf.",
    description: "Eru is a delicacy originating from the Bayangi people of the Southwest region. A rich and hearty mix of finely sliced wild Gnetum africanum (Eru) leaves, waterleaf, palm oil, and smoked meats, usually eaten with water fufu or garri.",
    image: "/water fufu and eru2.jpeg",
    category: "Soup",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["Low-Carb", "Keto-Friendly", "High-Fiber"],
    suitableFor: ["Weight Loss", "Blood Sugar Control"],
    ingredients: ["Eru leaves", "Waterleaf or Spinach", "Palm oil", "Smoked fish", "Cow skin (Canda)", "Crayfish"],
    preparationSteps: [
      "Wash and soak the shredded eru leaves to soften.",
      "Boil meats, smoked fish, and canda until tender.",
      "Add chopped waterleaf to the boiling meats and let it cook down.",
      "Add the softened eru leaves, crayfish, and palm oil, simmering until ready."
    ],
    nutrition: { calories: 550, protein: 35, carbs: 12, fat: 42, fiber: 10 }
  },
  {
    id: "fufu-corn-njama-njama",
    name: "Fufu Corn and Njama Njama",
    shortDescription: "Cornmeal swallow served with savory huckleberry leaves.",
    description: "A staple from the Northwest region of Cameroon, featuring a smooth, dough-like swallow made from corn flour (fufu corn) paired with Njama njama (huckleberry leaves) perfectly sautéed with tomatoes and onions.",
    image: "/Cameroonian Finest Fufu and Njama Njama_Khati Khati.jpg",
    category: "Traditional",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["Vegetarian-Option", "Gluten-Free", "Rich in Iron"],
    suitableFor: ["Anemia Prevention", "Digestive Health"],
    ingredients: ["Corn flour", "Njama njama (Huckleberry leaves)", "Tomatoes", "Onions", "Vegetable oil", "Maggi cubes"],
    preparationSteps: [
      "Stir corn flour continuously into boiling water until it forms a thick, smooth dough.",
      "Wash and blanch the huckleberry leaves.",
      "Sauté chopped onions and tomatoes in oil.",
      "Add the blanched leaves to the sauce and simmer shortly."
    ],
    nutrition: { calories: 450, protein: 12, carbs: 70, fat: 16, fiber: 9 }
  },
  {
    id: "koki",
    name: "Koki",
    shortDescription: "Steamed black-eyed pea pudding with palm oil.",
    description: "Koki (or Koki corn/beans) is a beautifully vibrant, orange-red steamed pudding. Made from coarsely blended black-eyed peas, generous amounts of warm palm oil, and cocoyam leaves, steamed in banana leaves to trap the earthy flavors.",
    image: "/koki19.jpeg",
    category: "Traditional",
    mealType: ["Lunch", "Snack"],
    dietaryLabels: ["Vegan", "High-Protein", "Gluten-Free"],
    suitableFor: ["Plant-based Diets", "Muscle Recovery"],
    ingredients: ["Black-eyed peas", "Warm palm oil", "Water", "Salt", "Banana leaves for wrapping"],
    preparationSteps: [
      "Soak, peel, and coarsely blend the black-eyed peas.",
      "Gradually mix in warm palm oil and a bit of water to form a fluffy batter.",
      "Wrap portions of the batter in warmed banana leaves.",
      "Steam for about an hour until set and cooked through."
    ],
    nutrition: { calories: 380, protein: 18, carbs: 45, fat: 15, fiber: 12 }
  },
  {
    id: "kondre",
    name: "Kondre",
    shortDescription: "A rich, slow-cooked plantain and meat stew.",
    description: "Kondre is a ceremonial dish from the Bamiléké people of Western Cameroon. It's an incredibly flavorful, slow-cooked one-pot meal combining unripe or semi-ripe plantains with beef, palm oil, and traditional spices.",
    image: "/Kondrè11.jpeg",
    category: "Traditional",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["High-Potassium", "Dairy-Free"],
    suitableFor: ["Energy Boost", "Heart Health"],
    ingredients: ["Plantains", "Beef or goat meat", "Palm oil", "Tomatoes", "Ginger, Garlic", "Aromatic spices"],
    preparationSteps: [
      "Brown the seasoned meat in a large pot.",
      "Blend tomatoes, onions, garlic, and ginger, and add to the meat.",
      "Peel the plantains and add them whole or halved into the pot.",
      "Add palm oil and water, and simmer gently until the plantains are ultra-tender and the sauce thickens."
    ],
    nutrition: { calories: 590, protein: 28, carbs: 80, fat: 22, fiber: 8 }
  },
  {
    id: "ndole",
    name: "Ndole",
    shortDescription: "Cameroon's national dish consisting of bitterleaf and peanut stew.",
    description: "Widely regarded as the national dish of Cameroon, Ndole is a creamy, highly nutritious stew made from boiled bitter leaves, a rich peanut paste, crayfish, and beef, usually topped with hot oil and shrimp.",
    image: "/Cameroon Ndole! This rich , creamy casserole-like dish is a delicacy even in Cameroon_ chopped bitter leaves cooked in a creamy peanut sauce_.jpg",
    category: "Soup",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["High-Protein", "Keto-Friendly Option", "Gluten-Free"],
    suitableFor: ["Muscle Building", "Low Carb Diets"],
    ingredients: ["Washed bitter leaves", "Raw peanuts", "Beef", "Dried crayfish", "Fresh shrimp", "Vegetable oil"],
    preparationSteps: [
      "Boil and thoroughly wash bitter leaves to remove excess bitterness.",
      "Boil peanuts and blend them into a smooth paste.",
      "Cook beef until tender, then add the peanut paste.",
      "Stir in the bitter leaves and simmer. Garnish with separately sautéed onions and shrimp."
    ],
    nutrition: { calories: 620, protein: 40, carbs: 15, fat: 48, fiber: 11 }
  },
  {
    id: "pepper-soup",
    name: "Pepper Soup",
    shortDescription: "A light, intensely spicy and aromatic broth.",
    description: "Cameroonian pepper soup is a bold, intensely spicy, and deeply aromatic broth featuring assorted chunks of meat or fresh fish. It is packed with medicinal spices like country onion, njangsa, and ginger.",
    image: "/Catfish pepper soup.jpg",
    category: "Light",
    mealType: ["Lunch", "Dinner", "Snack"],
    dietaryLabels: ["Low-Calorie", "Low-Carb", "High-Protein"],
    suitableFor: ["Weight Control", "Cold Recovery"],
    ingredients: ["Fish, goat, or beef", "Pepper soup spices mix", "Habanero peppers", "Garlic and ginger", "Scent leaves"],
    preparationSteps: [
      "Clean and cut the protein into bite-sized pieces.",
      "Boil the meat/fish with garlic, ginger, and salt.",
      "Add the roasted and blended traditional spices and fresh peppers.",
      "Simmer until the flavors are intensely infused and finish with scent leaves."
    ],
    nutrition: { calories: 250, protein: 35, carbs: 5, fat: 10, fiber: 2 }
  },
  {
    id: "poulet-dg",
    name: "Poulet DG",
    shortDescription: "Elegant chicken and ripe plantain stir-fry.",
    description: "Poulet DG (Directeur Général) is a vibrant and luxurious dish originally reserved for VIPs. It's an elevated stir-fry of fried chicken, sweet ripe plantains, bell peppers, carrots, and green beans in a rich tomato-based sauce.",
    image: "/Cameroonian Poulet DG_ Chicken DG Recipe_ Super Delicious and Tasty.jpg",
    category: "Protein",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["High-Protein"],
    suitableFor: ["General Health", "Energy Boost"],
    ingredients: ["Chicken segments", "Ripe plantains", "Bell peppers", "Carrots", "Tomatoes", "Onions"],
    preparationSteps: [
      "Season and fry or roast the chicken pieces until golden.",
      "Dice and fry the ripe plantains.",
      "In a separate pan, prepare a rich sauce with tomatoes, onions, and sliced vegetables.",
      "Toss the chicken and plantains into the sauce, allowing everything to meld."
    ],
    nutrition: { calories: 680, protein: 42, carbs: 75, fat: 26, fiber: 6 }
  },
  {
    id: "rice-and-stew",
    name: "Rice and Stew",
    shortDescription: "Classic white rice served with a robust tomato stew.",
    description: "A beloved classic across Cameroon, featuring perfectly cooked fluffy white rice paired with a deeply savory, slow-cooked tomato and onion stew, loaded with fried chicken, beef, or fish.",
    image: "/rice and stew9.jpeg",
    category: "Traditional",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["Dairy-Free"],
    suitableFor: ["Energy Maintenance", "Picky Eaters"],
    ingredients: ["White rice", "Fresh tomatoes", "Onions", "Vegetable oil", "Chicken or Beef", "Spices"],
    preparationSteps: [
      "Boil the rice until tender and fluffy.",
      "Blend tomatoes and boil them down to remove excess water.",
      "Fry onions in oil, add the tomato puree, and fry until the sour taste is gone.",
      "Add pre-cooked meat/fish and broth, simmering until oil floats to the top."
    ],
    nutrition: { calories: 520, protein: 25, carbs: 75, fat: 14, fiber: 3 }
  },
  {
    id: "roasted-fish",
    name: "Roasted Fish",
    shortDescription: "Spiced, street-style whole grilled fish.",
    description: "A wildly popular evening meal, featuring whole fresh fish (like mackerel or tilapia) marinated in a pungent, garlicky, ginger-heavy spice blend and perfectly grilled over charcoal. Often eaten with miondo, bobolo, or plantains.",
    image: "/Roasted fish with miondo.jpg",
    category: "Protein",
    mealType: ["Dinner", "Light"],
    dietaryLabels: ["High-Protein", "Low-Carb", "Keto-Friendly", "Pescatarian"],
    suitableFor: ["Weight Management", "Muscle Building", "Heart Health"],
    ingredients: ["Whole fish (Croaker or Tilapia)", "Garlic & Ginger", "White pepper", "Njangsa", "Vegetable oil", "Lime"],
    preparationSteps: [
      "Clean and score the whole fish.",
      "Blend garlic, ginger, njangsa, pepper, and oil into a thick marinade.",
      "Coat the fish generously inside and out.",
      "Grill slowly over hot coals, basting occasionally, until flaky with a charred crust."
    ],
    nutrition: { calories: 350, protein: 45, carbs: 2, fat: 18, fiber: 0 }
  },
  {
    id: "beans",
    name: "Beans (with Rice or Plantains)",
    shortDescription: "Richly stewed beans served with complementary carbs.",
    description: "A daily staple that provides immense energy and nutrition. Deeply stewed red or black beans cooked in palm or vegetable oil, seasoned with crayfish, and paired interchangeably with boiled rice or fried plantains.",
    image: "/rice and beans (3).jpg",
    category: "Protein",
    mealType: ["Breakfast", "Lunch", "Dinner"],
    dietaryLabels: ["High-Protein", "High-Fiber", "Vegetarian-Option"],
    suitableFor: ["Digestive Health", "Sustained Energy", "Heart Health"],
    ingredients: ["Beans", "Palm oil or Vegetable oil", "Onions", "Crayfish", "Rice or Plantains for serving"],
    preparationSteps: [
      "Boil beans until very soft.",
      "Fry onions and tomatoes lightly, then fold in the beans.",
      "Season heavily with crayfish and bouillon, allowing it to thicken.",
      "Serve alongside separately boiled rice or fried plantain slices."
    ],
    nutrition: { calories: 510, protein: 20, carbs: 80, fat: 14, fiber: 16 }
  },
  {
    id: "ekwang",
    name: "Ekwang",
    shortDescription: "Grated cocoyam wrapped in leaves and stewed with meats.",
    description: "A revered labor-of-love dish from the Bafaw/Oroko people. It consists of freshly grated taro (cocoyam) carefully tied in tiny cocoyam leaf bundles, and simmered slowly in a rich broth of palm oil, smoked fish, and periwinkles.",
    image: "/hero-food.png",
    category: "Traditional",
    mealType: ["Dinner", "Lunch"],
    dietaryLabels: ["Gluten-Free", "High-Fiber", "High-Calorie"],
    suitableFor: ["Special Occasions", "Sustained Energy"],
    ingredients: ["Grated cocoyam", "Cocoyam leaves (or collard greens)", "Palm oil", "Smoked fish", "Periwinkles", "Crayfish"],
    preparationSteps: [
      "Peel, wash, and manually grate the cocoyam.",
      "Place small amounts of the grated mix onto torn leaves and roll tightly.",
      "Layer the bottom of a pot with periwinkles or plantain stalks.",
      "Stack the rolls, add water, smoked fish, and palm oil, then simmer without stirring."
    ],
    nutrition: { calories: 600, protein: 25, carbs: 65, fat: 28, fiber: 11 }
  },
  {
    id: "jellof-rice",
    name: "Jellof Rice (Cameroonian)",
    shortDescription: "Spiced, vibrant one-pot tomato rice.",
    description: "Cameroonian Jellof Rice is a stunning one-pot dish where rice is cooked directly in a richly spiced tomato, onion, and pepper base. Accompanying meats and vegetables like carrots and green beans are often mixed right in.",
    image: "/Tasty Fried Rice and Grilled Chicken Recipe.jpg",
    category: "Traditional",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["Dairy-Free"],
    suitableFor: ["Energy Maintenance", "Picky Eaters"],
    ingredients: ["Rice", "Tomatoes", "Onions", "Bell peppers", "Vegetable oil", "Beef or Chicken broth"],
    preparationSteps: [
      "Blend tomatoes, onions, and peppers into a smooth puree.",
      "Fry the puree in oil until thick and the tanginess is eliminated.",
      "Add seasoned meat broth and bring to a rolling boil.",
      "Stir in washed rice, cover tightly, and steam on low heat until the liquid is absorbed."
    ],
    nutrition: { calories: 450, protein: 12, carbs: 75, fat: 12, fiber: 4 }
  }
];

export const recommendationReasons: Record<string, string> = {
  achu: "High in energy-yielding carbohydrates and rich in traditional spices.",
  cornchaff: "Excellent source of plant-based protein and dietary fiber.",
  eru: "Packed with vitamins, fiber, and healthy proteins for sustained wellness.",
  "fufu-corn-njama-njama": "Rich in iron from huckleberry leaves with gluten-free energy.",
  koki: "A perfect vegan protein source with healthy fats from palm oil.",
  kondre: "Loaded with potassium and slow-releasing energy from plantains.",
  ndole: "Highly nutritious with powerful antioxidants from bitter leaves and rich protein.",
  "pepper-soup": "Low in carbohydrates, highly restorative, and great for metabolism.",
  "poulet-dg": "A balanced, high-protein meal loaded with colorful vitamins.",
  "rice-and-stew": "A comforting, balanced source of dairy-free energy and protein.",
  "roasted-fish": "Heart-healthy, low-carb, and rich in omega-3 fatty acids.",
  beans: "Incredible source of fiber and heart-healthy plant protein.",
  ekwang: "Nutrient-dense with high fiber and essential minerals from periwinkles.",
  "jellof-rice": "A satisfying one-pot meal that provides lasting energy.",
};
