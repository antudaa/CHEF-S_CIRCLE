export enum IngredientCategory {
    SPICES = 'Spices',
    VEGETABLES = 'Vegetables',
    FRUITS = 'Fruits',
    DAIRY = 'Dairy',
    GRAINS = 'Grains',
    PROTEINS = 'Proteins',
    OILS_AND_FATS = 'Oils & Fats', // Changed for consistency
    SWEETENERS = 'Sweeteners',
    HERBS = 'Herbs',
    BEVERAGES = 'Beverages',
    SEAFOOD = 'Seafood',
    BAKING = 'Baking',
    NUTS_AND_SEEDS = 'Nuts & Seeds', // Grouped Nuts and Seeds together
    CONDIMENTS = 'Condiments',
}

export enum RecipeCategory {
    Biryani = "Biryani",
    VEGETARIAN = 'Vegetarian',
    VEGAN = 'Vegan',
    GLUTEN_FREE = 'Gluten-Free',
    PALEO = 'Paleo',
    KETO = 'Keto',
    DESSERT = 'Dessert',
    SOUPS = 'Soups',
    RICE = "Rice",
    SALAD = 'Salad',
    GRILLED = 'Grilled',
    BREAKFAST = 'Breakfast',
    DINNER = 'Dinner',
    LUNCH = 'Lunch',
    SNACKS = 'Snacks',
    DRINKS = 'Drinks',
    APPETIZER = 'Appetizer',
    MAIN_COURSE = 'Main Course',
    SIDE_DISH = 'Side Dish',
    PIZZA = 'Pizza',
    PASTA = 'Pasta',
    CURRY = 'Curry'
}

export enum Unit {
    GRAMS = 'g',
    KILOGRAMS = 'kg',
    MILLILITERS = 'ml',
    LITERS = 'l',
    OUNCES = 'oz',
    POUNDS = 'lb',
    TEASPOON = 'teaspoon',
    TABLESPOON = 'tablespoon',
    CUP = 'cup',
    PINCH = 'pinch',
    DASH = 'dash',
    PIECE = 'piece',
    SLICE = 'slice',
    LEAVES = 'leaves',
    Bunch = "bunch",
    Clove = "clove"
}

export enum IngredientName {

    // Spices & Seasonings
    SALT = 'Salt',
    PEPPER = 'Pepper',
    CINNAMON = 'Cinnamon',
    CUMIN = 'Cumin',
    PAPRIKA = 'Paprika',
    TURMERIC = 'Turmeric',
    CHILI_POWDER = 'Chili Powder',
    CORIANDER = 'Coriander',
    CLOVES = 'Cloves',
    NUTMEG = 'Nutmeg',
    SAFFRON = 'Saffron',
    BAY_LEAVES = 'Bay Leaves',
    OREGANO = 'Oregano',
    THYME = 'Thyme',
    ROSEMARY = 'Rosemary',
    CARDAMOM = 'Cardamom',
    FENNEL = 'Fennel',

    // Vegetables
    GARLIC = 'Garlic',
    ONION = 'Onion',
    TOMATO = 'Tomato',
    POTATO = 'Potato',
    CARROT = 'Carrot',
    BROCCOLI = 'Broccoli',
    SPINACH = 'Spinach',
    CAULIFLOWER = 'Cauliflower',
    ZUCCHINI = 'Zucchini',
    CUCUMBER = 'Cucumber',
    BELL_PEPPER = 'Bell Pepper',
    LETTUCE = 'Lettuce',
    PEAS = 'Peas',
    MUSHROOM = 'Mushroom',
    AVOCADO = 'Avocado',
    EGGPLANT = 'Eggplant',

    // Fruits
    BANANA = 'Banana',
    APPLE = 'Apple',
    ORANGE = 'Orange',
    LEMON = 'Lemon',
    LIME = 'Lime',
    STRAWBERRY = 'Strawberry',
    BLUEBERRY = 'Blueberry',
    MANGO = 'Mango',
    PINEAPPLE = 'Pineapple',
    PEAR = 'Pear',
    PEACH = 'Peach',
    GRAPE = 'Grape',
    KIWI = 'Kiwi',

    // Proteins
    CHICKEN = 'Chicken',
    BEEF = 'Beef',
    PORK = 'Pork',
    LAMB = 'Lamb',
    FISH = 'Fish',
    TOFU = 'Tofu',
    TEMPEH = 'Tempeh',
    EGG = 'Egg',
    BACON = 'Bacon',

    // Dairy
    MILK = 'Milk',
    BUTTER = 'Butter',
    CREAM = 'Cream',
    YOGURT = 'Yogurt',
    CHEESE = 'Cheese',
    COTTAGE_CHEESE = 'Cottage Cheese',
    CREAM_CHEESE = 'Cream Cheese',

    // Grains & Legumes
    RICE = 'Rice',
    PASTA = 'Pasta',
    BREAD = 'Bread',
    QUINOA = 'Quinoa',
    OATS = 'Oats',
    LENTILS = 'Lentils',
    CHICKPEAS = 'Chickpeas',
    BEANS = 'Beans',
    CORN = 'Corn',

    // Oils & Fats
    OLIVE_OIL = 'Olive Oil',
    BUTTER_FAT = 'Butter', // Keep this to avoid conflict, but consider how it's represented
    COCONUT_OIL = 'Coconut Oil',
    VEGETABLE_OIL = 'Vegetable Oil',
    GHEE = 'Ghee',

    // Sweeteners
    SUGAR = 'Sugar',
    HONEY = 'Honey',
    MAPLE_SYRUP = 'Maple Syrup',
    BROWN_SUGAR = 'Brown Sugar',
    AGAVE_SYRUP = 'Agave Syrup',

    // Baking & Flour
    FLOUR = 'Flour',
    BAKING_POWDER = 'Baking Powder',
    BAKING_SODA = 'Baking Soda',
    YEAST = 'Yeast',
    CORNSTARCH = 'Cornstarch',
    COCOA_POWDER = 'Cocoa Powder',
    VANILLA_EXTRACT = 'Vanilla Extract',

    // Herbs
    BASIL = 'Basil',
    PARSLEY = 'Parsley',
    DILL = 'Dill',
    MINT = 'Mint',
    CILANTRO = 'Cilantro',
    SAGE = 'Sage',
    CHIVES = 'Chives',

    // Seafood
    SALMON = 'Salmon',
    TUNA = 'Tuna',
    SHRIMP = 'Shrimp',
    CRAB = 'Crab',
    LOBSTER = 'Lobster',

    // Nuts & Seeds
    ALMONDS = 'Almonds',
    WALNUTS = 'Walnuts',
    CASHEWS = 'Cashews',
    PEANUTS = 'Peanuts',
    SUNFLOWER_SEEDS = 'Sunflower Seeds',
    CHIA_SEEDS = 'Chia Seeds',
    FLAXSEEDS = 'Flaxseeds',
    PUMPKIN_SEEDS = 'Pumpkin Seeds',

    // Condiments & Sauces
    KETCHUP = 'Ketchup',
    MUSTARD = 'Mustard',
    SOY_SAUCE = 'Soy Sauce',
    MAYONNAISE = 'Mayonnaise',
    HOT_SAUCE = 'Hot Sauce',
    WORCESTERSHIRE_SAUCE = 'Worcestershire Sauce',
    VINEGAR = 'Vinegar',
    BBQ_SAUCE = 'BBQ Sauce',

    // Beverages
    WATER = 'Water',
    MILK_BEVERAGE = 'Milk',
    COFFEE = 'Coffee',
    TEA = 'Tea',
    JUICE = 'Juice',
    SODA = 'Soda',
    WINE = 'Wine',
    BEER = 'Beer'
}