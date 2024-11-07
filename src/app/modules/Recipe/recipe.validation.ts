import { z } from 'zod';
import { IngredientName, IngredientCategory, RecipeCategory, Unit } from './enums';

// Zod validation for TIngredient
const ingredientSchema = z.object({
    name: z.nativeEnum(IngredientName),
    category: z.nativeEnum(IngredientCategory),
    quantity: z.number().min(0.01),
    unit: z.nativeEnum(Unit),
});

// Zod validation for TStep
const stepSchema = z.object({
    instructions: z.string().min(5),
    duration: z.number().optional(),
    tips: z.array(z.string()).optional(),
});

// Zod validation for TComment
const commentSchema = z.object({
    userId: z.string(),
    userName: z.string().min(1),
    comment: z.string().min(1),
    rating: z.number().min(1).max(5),
    date: z.date().default(new Date()),
});

// Zod validation for TNutration
const nutrationSchema = z.object({
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fats: z.number(),
}).optional();

// Zod validation for TRecipe
export const recipeValidationSchema = z.object({
    name: z.string().min(3),
    author: z.string(),
    description: z.string().min(10),
    rating: z.number().min(1).max(5).optional(),
    steps: z.array(stepSchema),
    images: z.array(z.string()).optional(),
    category: z.nativeEnum(RecipeCategory),
    ingredients: z.array(ingredientSchema),
    cookingTime: z.number().min(1),
    preppingTime: z.number().min(1),
    servings: z.number().min(1),
    isPremium: z.boolean().default(false),
    isTrending: z.boolean().default(false),
    publishStatus: z.enum(['publish', 'unpublish']),
    comments: z.array(commentSchema).optional(),
    likes: z.number().default(0),
    favourites: z.number().default(0),
    nutrations: nutrationSchema,
    createdAt: z.date().default(new Date()),
    updatedAt: z.date().default(new Date()),
    isDeleted: z.boolean().default(false),
});