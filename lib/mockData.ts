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
  },
  {
    id: "bitterleaf-soup",
    name: "Bitterleaf Soup",
    shortDescription: "A savory, slightly bitter and highly nutritious soup.",
    description: "Bitterleaf soup is a popular traditional dish across West Africa, known for its unique flavor profile combining the slight bitterness of washed leaves with rich meats, fish, and cocoyam paste acting as a thickener.",
    image: "/Bitterleaf soup.jpeg",
    category: "Soup",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["High-Fiber", "Low-Carb"],
    suitableFor: ["Digestive Health", "Immune Support"],
    ingredients: ["Washed bitter leaves", "Assorted meats", "Smoked fish", "Cocoyam (thickener)", "Crayfish", "Palm oil"],
    preparationSteps: [
      "Boil meats and stockfish until tender.",
      "Add palm oil and blended cocoyam to thicken the broth.",
      "Stir in washed bitter leaves and simmer gently.",
      "Season with crayfish and spices, cooking until flavors meld."
    ],
    nutrition: { calories: 450, protein: 35, carbs: 15, fat: 28, fiber: 12 }
  },
  {
    id: "egusi-soup",
    name: "Egusi Soup",
    shortDescription: "Rich, nutty soup made with ground melon seeds.",
    description: "Egusi soup is a beloved West African classic. Ground melon seeds are cooked with palm oil, leafy greens, and a variety of meats or fish to create a hearty, protein-packed soup that's incredibly satisfying.",
    image: "/Egusi soup.jpeg",
    category: "Soup",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["High-Protein", "Keto-Friendly"],
    suitableFor: ["Muscle Building", "Low Carb Diets"],
    ingredients: ["Ground Egusi (melon seeds)", "Palm oil", "Spinach or bitter leaves", "Assorted meats", "Stockfish", "Crayfish"],
    preparationSteps: [
      "Boil the meats and fish to create a flavorful stock.",
      "Toast or fry the ground egusi in palm oil.",
      "Combine the egusi with the meat stock and simmer.",
      "Add leafy greens and final seasonings, cooking until wilted."
    ],
    nutrition: { calories: 550, protein: 42, carbs: 12, fat: 40, fiber: 8 }
  },
  {
    id: "garri-okro",
    name: "Garri and Okro",
    shortDescription: "A comforting combo of fermented cassava and slippery okro soup.",
    description: "A quick, satisfying, and deeply traditional meal. Garri (cassava flakes) is prepared as a swallow and served with Okro soup, famous for its thick, viscous texture and savory taste.",
    image: "/Garri and Okro.jpeg",
    category: "Traditional",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["Dairy-Free", "High-Fiber"],
    suitableFor: ["Digestive Health", "Quick Meals"],
    ingredients: ["Garri (cassava flakes)", "Fresh okro", "Palm oil", "Fish or meat", "Crayfish"],
    preparationSteps: [
      "Pour hot water over garri and stir to form a firm dough.",
      "Chop or grate the okro.",
      "Cook meats and make a light broth with palm oil.",
      "Add the okro and simmer briefly to retain its crunch and viscosity."
    ],
    nutrition: { calories: 400, protein: 20, carbs: 65, fat: 12, fiber: 10 }
  },
  {
    id: "mbongo-tchobi",
    name: "Mbongo Tchobi",
    shortDescription: "A dark, aromatic, and spicy tomato-based fish stew.",
    description: "Mbongo Tchobi is a signature dish from the coastal regions of Cameroon. Its striking dark color comes from the burnt mbongo spice. It's an intensely flavorful, earthy stew often made with white fish and served with plantains.",
    image: "/Mbongo Tchobi.jpeg",
    category: "Traditional",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["Pescatarian", "High-Protein", "Dairy-Free"],
    suitableFor: ["Heart Health", "Flavor Enthusiasts"],
    ingredients: ["White fish (Catfish or similar)", "Mbongo spice blend", "Tomatoes", "Onions", "Garlic and ginger", "Peanut oil"],
    preparationSteps: [
      "Clean the fish and set aside.",
      "Blend tomatoes, onions, garlic, ginger, and the dark mbongo spice.",
      "Fry the blended mixture in oil until fragrant and thickened.",
      "Gently add the fish, simmer until cooked through."
    ],
    nutrition: { calories: 420, protein: 38, carbs: 18, fat: 22, fiber: 5 }
  },
  {
    id: "njangsa-soup",
    name: "Njangsa Soup",
    shortDescription: "A nutty, spicy, and fragrant soup made with Njangsa seeds.",
    description: "Njangsa soup uses the uniquely aromatic crushed seeds of the Njangsa tree, which naturally thickens the broth and imparts a distinctive, slightly nutty flavor. Often paired with fresh fish and ripe plantains.",
    image: "/Njangsa soup & ripe plantain.jpeg",
    category: "Soup",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["Pescatarian", "Low-Carb"],
    suitableFor: ["Bone Health", "Immune Support"],
    ingredients: ["Fresh fish", "Njangsa seeds", "Tomatoes", "Onions", "Spices", "Oil"],
    preparationSteps: [
      "Toast and grind the njangsa seeds.",
      "Blend tomatoes, onions, and the ground njangsa.",
      "Cook the mixture to form a rich sauce.",
      "Add the fresh fish and simmer until the fish is tender and the sauce is perfectly combined."
    ],
    nutrition: { calories: 380, protein: 35, carbs: 12, fat: 20, fiber: 4 }
  },
  {
    id: "plantain-porridge",
    name: "Plantain Porridge",
    shortDescription: "A hearty, one-pot dish of simmered plantains and vegetables.",
    description: "Plantain porridge is a comforting, rustic meal where unripe or semi-ripe plantains are cooked down in a flavorful broth with palm oil, leafy greens, and dried fish, resulting in a rich, thick stew.",
    image: "/Plaintain Porridge.jpeg",
    category: "Traditional",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["High-Iron", "Dairy-Free"],
    suitableFor: ["Energy Boost", "Anemia Prevention"],
    ingredients: ["Unripe or semi-ripe plantains", "Palm oil", "Leafy greens", "Dried fish", "Crayfish"],
    preparationSteps: [
      "Peel and dice the plantains.",
      "Boil the plantains with water, dried fish, and seasonings.",
      "Add palm oil and allow the starch from the plantains to thicken the broth.",
      "Stir in leafy greens at the end and simmer briefly."
    ],
    nutrition: { calories: 450, protein: 18, carbs: 75, fat: 15, fiber: 9 }
  },
  {
    id: "puff-puff-beans",
    name: "Puff Puff and Beans",
    shortDescription: "A sweet and savory classic street food combination.",
    description: "A beloved Cameroonian breakfast and street food! It combines the fluffy, sweet, deep-fried dough balls known as Puff Puff with savory, warmly spiced stewed beans. The contrast of flavors and textures is irresistible.",
    image: "/Puff Puff and Beans_ CAMEROONIAN Food_.jpg",
    category: "Breakfast",
    mealType: ["Breakfast", "Snack"],
    dietaryLabels: ["Vegetarian", "High-Calorie"],
    suitableFor: ["Quick Energy", "Comfort Eating"],
    ingredients: ["Flour", "Yeast", "Sugar", "Beans", "Palm oil or vegetable oil", "Onions"],
    preparationSteps: [
      "Mix flour, yeast, sugar, and water into a batter and let it rise.",
      "Deep fry spoonfuls of the batter until golden brown to make Puff Puff.",
      "Boil beans until tender and fry with onions, tomatoes, and spices to make the bean stew.",
      "Serve the hot Puff Puff alongside the savory beans."
    ],
    nutrition: { calories: 580, protein: 16, carbs: 85, fat: 22, fiber: 10 }
  },
  {
    id: "kati-kati",
    name: "Kati Kati",
    shortDescription: "Roasted chicken sautéed in a spicy, palm oil-rich sauce.",
    description: "Kati Kati is a delicacy from the Northwest region of Cameroon. It involves roasting chicken over an open flame, then chopping and simmering it in a rich, spicy palm oil sauce. Best enjoyed with fufu corn.",
    image: "/Kati kati and Cameroonian Style Turnip greens  – AFROVITALITYEATS.jpg",
    category: "Protein",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["High-Protein", "Keto-Friendly"],
    suitableFor: ["Muscle Recovery", "Flavor Enthusiasts"],
    ingredients: ["Hard chicken (free-range)", "Palm oil", "Tomatoes", "Habanero peppers", "Traditional spices"],
    preparationSteps: [
      "Roast the whole chicken over an open fire until slightly charred, then chop into pieces.",
      "Sauté tomatoes and intense peppers in palm oil.",
      "Add the roasted chicken pieces and traditional spices.",
      "Simmer until the chicken absorbs the spicy, smoky flavors."
    ],
    nutrition: { calories: 420, protein: 45, carbs: 8, fat: 25, fiber: 3 }
  },
  {
    id: "suya",
    name: "Suya",
    shortDescription: "Spicy, grilled meat skewers coated in a peanut-based rub.",
    description: "A wildly popular West African street food. Thinly sliced beef or chicken is heavily coated in 'yaji'—a complex, spicy peanut spice blend—and grilled over open coals. It's smoky, nutty, and fiery.",
    image: "/dish-suya.png",
    category: "Snack",
    mealType: ["Snack", "Dinner"],
    dietaryLabels: ["High-Protein", "Low-Carb"],
    suitableFor: ["Quick Snacks", "Muscle Building"],
    ingredients: ["Beef or Chicken", "Suya spice (Yaji: peanuts, ginger, pepper, etc.)", "Vegetable oil", "Onions for garnish"],
    preparationSteps: [
      "Thinly slice the meat and thread onto skewers.",
      "Generously coat the meat in the suya spice blend and drizzle with oil.",
      "Grill over hot coals until charred and cooked through.",
      "Serve hot with sliced raw onions and extra spice."
    ],
    nutrition: { calories: 300, protein: 35, carbs: 5, fat: 18, fiber: 2 }
  },
  {
    id: "moi-moi",
    name: "Moi Moi",
    shortDescription: "Savory, steamed bean pudding rich in protein.",
    description: "Moi Moi is a deeply flavorful, protein-rich steamed pudding made from blended black-eyed peas, peppers, onions, and oil. It can be studded with hard-boiled eggs, fish, or corned beef.",
    image: "/dish-moi-moi.png",
    category: "Protein",
    mealType: ["Breakfast", "Lunch", "Snack"],
    dietaryLabels: ["High-Protein", "Gluten-Free", "Vegetarian-Option"],
    suitableFor: ["Muscle Building", "Healthy Snacking"],
    ingredients: ["Black-eyed peas", "Red bell peppers", "Onions", "Vegetable oil or Palm oil", "Hard-boiled eggs or fish"],
    preparationSteps: [
      "Soak and peel the black-eyed peas.",
      "Blend the peeled beans with peppers, onions, and water into a smooth batter.",
      "Mix in oil, seasonings, and add-ins like eggs or flaked fish.",
      "Pour into containers or leaves and steam until set."
    ],
    nutrition: { calories: 320, protein: 18, carbs: 35, fat: 14, fiber: 8 }
  },
  {
    id: "white-bean-stew",
    name: "White Bean Stew",
    shortDescription: "A hearty and creamy white bean stew.",
    description: "A comforting stew made with white beans, perfectly cooked until creamy and tender, seasoned with local spices and rich oils for a deep, savory flavor profile.",
    image: "/WHITE BEAN STEW.jpg",
    category: "Protein",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["High-Protein", "High-Fiber", "Vegan-Option"],
    suitableFor: ["Digestive Health", "Sustained Energy"],
    ingredients: ["White beans", "Onions", "Tomatoes", "Vegetable oil", "Spices"],
    preparationSteps: [
      "Soak white beans to reduce cooking time.",
      "Boil until soft and creamy.",
      "Prepare a flavorful tomato and onion base.",
      "Combine and simmer until the flavors meld."
    ],
    nutrition: { calories: 410, protein: 22, carbs: 60, fat: 10, fiber: 15 }
  },
  {
    id: "stewed-irish-porridge",
    name: "Stewed Irish Porridge",
    shortDescription: "A robust one-pot potato porridge.",
    description: "A satisfying one-pot dish where Irish potatoes are stewed down in a rich tomato and meat broth, absorbing all the robust flavors while naturally thickening the sauce.",
    image: "/Stewed Irish Porridge.jpeg",
    category: "Traditional",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["High-Carb", "Dairy-Free"],
    suitableFor: ["Energy Boost", "Comfort Eating"],
    ingredients: ["Irish potatoes", "Tomatoes", "Beef or chicken", "Spices", "Carrots"],
    preparationSteps: [
      "Peel and cube the Irish potatoes.",
      "Brown the meat and create a savory stew base.",
      "Add potatoes and broth, simmering until tender and the sauce is thick."
    ],
    nutrition: { calories: 450, protein: 15, carbs: 55, fat: 18, fiber: 6 }
  },
  {
    id: "mbongo-tchobi-plantain",
    name: "Mbongo Tchobi & Ripe Plantains",
    shortDescription: "Dark spicy stew served with sweet ripe plantains.",
    description: "The classic pairing of the earthy, dark, and intensely spiced Mbongo Tchobi fish stew with perfectly sweet and soft boiled or fried ripe plantains.",
    image: "/Mbongo Tchobi & ripe plantains.jpeg",
    category: "Traditional",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["Pescatarian", "Dairy-Free"],
    suitableFor: ["Heart Health", "Flavor Enthusiasts"],
    ingredients: ["Fish", "Mbongo spice", "Tomatoes", "Ripe plantains", "Oil"],
    preparationSteps: [
      "Prepare the Mbongo Tchobi stew by frying the dark spice blend with tomatoes.",
      "Simmer the fish gently in the dark sauce.",
      "Boil or fry the ripe plantains and serve alongside."
    ],
    nutrition: { calories: 510, protein: 35, carbs: 60, fat: 20, fiber: 7 }
  },
  {
    id: "porridge-irish-potatoes",
    name: "Porridge Irish Potatoes",
    shortDescription: "Irish potatoes cooked down into a rich porridge.",
    description: "A hearty porridge made by cooking Irish potatoes with palm oil, crayfish, and leafy greens, resulting in a savory, thick, and highly comforting meal.",
    image: "/PorridgedIrish Potatoes.jpeg",
    category: "Traditional",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["High-Carb", "Dairy-Free"],
    suitableFor: ["Energy Boost", "Comfort Eating"],
    ingredients: ["Irish potatoes", "Palm oil", "Crayfish", "Smoked fish", "Leafy greens"],
    preparationSteps: [
      "Peel and cut the potatoes.",
      "Boil with smoked fish, crayfish, and seasonings.",
      "Stir in palm oil and let it thicken naturally.",
      "Add greens at the end."
    ],
    nutrition: { calories: 480, protein: 14, carbs: 65, fat: 20, fiber: 8 }
  },
  {
    id: "okongobong-calaba-yam",
    name: "Okongobong and Calaba Yam",
    shortDescription: "A traditional pairing of vegetable stew and root yam.",
    description: "A cherished meal featuring Okongobong (pumpkin leaves) deliciously stewed with meats and crayfish, served alongside deeply earthy and starchy Calaba yam.",
    image: "/Okongobong and Calaba yam.jpeg",
    category: "Traditional",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["High-Fiber", "High-Carb"],
    suitableFor: ["Sustained Energy", "Digestive Health"],
    ingredients: ["Calaba yam", "Okongobong (pumpkin leaves)", "Palm oil", "Smoked meat", "Spices"],
    preparationSteps: [
      "Boil the Calaba yam until tender.",
      "Prepare a rich base with palm oil and meats.",
      "Add the chopped Okongobong and simmer briefly to retain nutrients."
    ],
    nutrition: { calories: 520, protein: 18, carbs: 70, fat: 22, fiber: 12 }
  },
  {
    id: "groundnut-paste-cassava",
    name: "Groundnut Paste and Cassava",
    shortDescription: "Boiled cassava served with a rich peanut sauce.",
    description: "A simple, highly nutritious, and satisfying meal consisting of tender boiled cassava dipped into a savory, creamy, and slightly spicy groundnut (peanut) paste.",
    image: "/Groundnut paste and cassava.jpeg",
    category: "Traditional",
    mealType: ["Breakfast", "Snack", "Lunch"],
    dietaryLabels: ["Vegan-Option", "Gluten-Free"],
    suitableFor: ["Energy Boost", "Plant-based Diets"],
    ingredients: ["Cassava tubers", "Roasted groundnuts", "Garlic", "Ginger", "Pepper"],
    preparationSteps: [
      "Peel and boil the cassava until completely tender.",
      "Blend roasted groundnuts with garlic, ginger, pepper, and water.",
      "Cook the paste slightly to release the oils, and serve as a dip."
    ],
    nutrition: { calories: 460, protein: 12, carbs: 68, fat: 20, fiber: 9 }
  },
  {
    id: "garri-eru",
    name: "Garri & Eru",
    shortDescription: "A classic combination of cassava swallow and wild leaf soup.",
    description: "The ultimate pairing for Eru lovers—served with hot, smoothly prepared Garri (cassava swallow) that perfectly complements the rich, palm-oil heavy Eru soup.",
    image: "/Garri & Eru.jpeg",
    category: "Traditional",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["High-Fiber", "High-Calorie"],
    suitableFor: ["Sustained Energy"],
    ingredients: ["Garri", "Eru leaves", "Waterleaf", "Palm oil", "Assorted meats"],
    preparationSteps: [
      "Prepare the Eru soup with palm oil, waterleaf, and meats.",
      "Boil water and stir in Garri until a firm dough forms.",
      "Serve the hot swallow with the rich soup."
    ],
    nutrition: { calories: 610, protein: 32, carbs: 65, fat: 30, fiber: 14 }
  },
  {
    id: "fufu-egusi",
    name: "Fufu & Egusi Soup",
    shortDescription: "Soft fufu served with hearty melon seed soup.",
    description: "A match made in heaven. The pillowy softness of Fufu acts as the perfect vehicle for scooping up the textured, nutty, and highly savory Egusi soup.",
    image: "/Fufu & Egusi soup.jpeg",
    category: "Traditional",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["High-Protein", "High-Calorie"],
    suitableFor: ["Muscle Building", "Comfort Eating"],
    ingredients: ["Cassava fufu", "Ground egusi", "Palm oil", "Meats", "Leafy greens"],
    preparationSteps: [
      "Prepare the Egusi soup with a rich meat stock and palm oil.",
      "Cook the fufu dough until smooth and elastic.",
      "Serve together."
    ],
    nutrition: { calories: 680, protein: 40, carbs: 75, fat: 35, fiber: 10 }
  },
  {
    id: "ekwang-authentic",
    name: "Ekwang",
    shortDescription: "Grated cocoyam wrapped in leaves and stewed with meats.",
    description: "A revered labor-of-love dish from the Bafaw/Oroko people. It consists of freshly grated taro (cocoyam) carefully tied in tiny cocoyam leaf bundles, and simmered slowly in a rich broth of palm oil, smoked fish, and periwinkles.",
    image: "/Ekwang.jpeg",
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
    id: "ekwang-special",
    name: "Special Ekwang",
    shortDescription: "Grated cocoyam wrapped in leaves and stewed with meats.",
    description: "A revered labor-of-love dish from the Bafaw/Oroko people. It consists of freshly grated taro (cocoyam) carefully tied in tiny cocoyam leaf bundles, and simmered slowly in a rich broth of palm oil, smoked fish, and periwinkles.",
    image: "/Ekwang2.jpeg",
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
    id: "cornchaff-2",
    name: "Classic Cornchaff",
    shortDescription: "A savory mix of corn and beans.",
    description: "Another excellent presentation of Cornchaff, showcasing the perfect marriage of sweet corn kernels and earthy beans, deeply stewed with palm oil and smoked flavors.",
    image: "/CornChaff.jpeg",
    category: "Traditional",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["High-Fiber", "High-Protein"],
    suitableFor: ["Heart Health", "Muscle Building"],
    ingredients: ["Corn kernels", "Beans", "Palm oil", "Smoked fish", "Onions"],
    preparationSteps: [
      "Boil corn and beans together.",
      "Fry a base of palm oil, onions, and fish.",
      "Combine and simmer to a stew-like consistency."
    ],
    nutrition: { calories: 480, protein: 22, carbs: 65, fat: 18, fiber: 15 }
  },
  {
    id: "kwacoco-bible",
    name: "Kwacoco Bible",
    shortDescription: "Steamed cocoyam pudding packed with spinach and fish.",
    description: "A beloved dish from the Bakweri people. Grated cocoyam is mixed with palm oil, spinach, smoked fish, and spices, wrapped tightly in plantain leaves, and steamed until firm.",
    image: "/Kwacoco Bible.jpg",
    category: "Traditional",
    mealType: ["Lunch", "Dinner"],
    dietaryLabels: ["Gluten-Free", "High-Fiber"],
    suitableFor: ["Plant-based Diets", "Digestive Health"],
    ingredients: ["Grated cocoyam", "Spinach", "Palm oil", "Smoked fish", "Plantain leaves"],
    preparationSteps: [
      "Grate the cocoyam and mix with palm oil and spices.",
      "Fold in chopped spinach and flaked smoked fish.",
      "Wrap portions in warmed plantain leaves and steam until cooked through."
    ],
    nutrition: { calories: 450, protein: 18, carbs: 55, fat: 20, fiber: 10 }
  },
  {
    id: "egusi-pudding",
    name: "Egusi Pudding",
    shortDescription: "A steamed, savory cake made from melon seeds.",
    description: "A delicious, protein-dense steamed pudding made by blending Egusi (melon seeds) with meats or fish, bound together and steamed in banana leaves. It has a beautiful spongy texture.",
    image: "/Egusi Pudding.jpg",
    category: "Protein",
    mealType: ["Lunch", "Snack"],
    dietaryLabels: ["High-Protein", "Keto-Friendly"],
    suitableFor: ["Muscle Recovery", "Low Carb Diets"],
    ingredients: ["Ground Egusi", "Meats or fish", "Spices", "Water", "Banana leaves"],
    preparationSteps: [
      "Blend egusi into a paste with water and spices.",
      "Mix in chopped cooked meats or fish.",
      "Wrap in banana leaves and steam until firm and cake-like."
    ],
    nutrition: { calories: 410, protein: 35, carbs: 10, fat: 28, fiber: 6 }
  },
  {
    id: "spaghetti-omelette",
    name: "Spaghetti Omelette",
    shortDescription: "A deliciously satisfying fusion of pasta and eggs.",
    description: "Spaghetti Omelette is a popular fusion dish combining boiled spaghetti with seasoned beaten eggs. It is pan-fried to form a thick, golden, crispy-edged cake, making it perfect for breakfast or a hearty snack.",
    image: "/Spaghetti Omelette Recipe.jpg",
    category: "Breakfast",
    mealType: ["Breakfast", "Snack"],
    dietaryLabels: ["Vegetarian", "High-Carb", "High-Protein"],
    suitableFor: ["Quick Meals", "Energy Boost"],
    ingredients: ["Spaghetti", "Eggs", "Onions", "Tomatoes", "Vegetable oil", "Spices"],
    preparationSteps: [
      "Boil spaghetti until al dente and drain.",
      "Whisk eggs with chopped onions, tomatoes, and spices.",
      "Mix the spaghetti into the beaten eggs.",
      "Pan-fry the mixture in a skillet until golden brown on both sides."
    ],
    nutrition: { calories: 450, protein: 18, carbs: 50, fat: 20, fiber: 3 }
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
  "bitterleaf-soup": "Highly nutritious with detoxifying properties and rich in fiber.",
  "egusi-soup": "Packed with healthy fats and protein for sustained energy and muscle support.",
  "garri-okro": "A great source of dietary fiber that promotes digestive health.",
  "mbongo-tchobi": "A flavorful pescatarian option packed with lean protein and distinct spices.",
  "njangsa-soup": "Nutrient-dense with unique aromatic spices that support overall wellness.",
  "plantain-porridge": "Loaded with complex carbohydrates and iron for lasting vitality.",
  "puff-puff-beans": "A classic sweet and savory combo providing an excellent energy boost.",
  "kati-kati": "A high-protein, smoky delight perfect for keto and low-carb diets.",
  suya: "A low-carb, protein-packed snack with a satisfying, nutty crunch.",
  "moi-moi": "An excellent gluten-free source of plant-based protein and fiber.",
  "white-bean-stew": "A comforting, high-fiber meal that promotes digestive wellness.",
  "stewed-irish-porridge": "Provides excellent complex carbs and warmth for sustained energy.",
  "mbongo-tchobi-plantain": "A flavor-packed pescatarian combo with great potassium from plantains.",
  "porridge-irish-potatoes": "A thick, deeply satisfying stew that offers a great energy boost.",
  "okongobong-calaba-yam": "Rich in essential vitamins from pumpkin leaves and starchy energy.",
  "groundnut-paste-cassava": "A nutrient-dense pairing offering healthy fats and gluten-free carbs.",
  "garri-eru": "A deeply traditional, high-fiber powerhouse that keeps you full for hours.",
  "fufu-egusi": "A highly satiating, protein-rich combination perfect for muscle recovery.",
  "ekwang-authentic": "A labor of love that delivers incredible traditional flavors and fiber.",
  "ekwang-special": "An elevated, protein-packed variant of the beloved cocoyam classic.",
  "cornchaff-2": "A fantastic plant-based protein and fiber mix for heart health.",
  "kwacoco-bible": "A wonderful steamed dish packed with iron-rich spinach and healthy fats.",
  "egusi-pudding": "A keto-friendly, high-protein steamed delicacy that is highly satisfying.",
  "spaghetti-omelette": "A quick, satisfying, and energy-packed meal combining complex carbs and healthy proteins.",
};
