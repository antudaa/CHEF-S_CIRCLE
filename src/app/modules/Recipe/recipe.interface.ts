import { Date, Model, Schema, Types } from "mongoose";
import { IngredientCategory, IngredientName, RecipeCategory, Unit } from "./enums";

export type TIngredient = {
    name: string;
    category: string;
    quantity: number;
    unit: Unit;
}

export type TStep = {
    instructions: string;
    duration?: number;
    tips?: string[];
}

// Comment Interface
export type TComment = {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    userName: string;
    comment: string;
    date: Date;
    updatedAt?: Schema.Types.Date;
    deleted: boolean;
    likes: number;
    replies: TReply[];
};

// Reply Interface
export type TReply = {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    userName: string;
    comment: string;
    date: Date;
    deleted: boolean;
    likes: number;
    replies: TReply[];
};

export type TNutration = {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

export type TRecipe = {
    name: string;
    author: Types.ObjectId;
    description: string;
    rating?: number;
    steps: TStep[];
    images: string[];
    category: string;
    ingredients: TIngredient[];
    cookingTime: number;
    preppingTime: number;
    servings: number;
    isPremium: boolean;
    isTrending: boolean;
    publishStatus: 'publish' | 'unpublish';
    comments?: TComment[];
    likes?: number;
    favourites?: number;
    upvotes: number;
    downvotes: number;
    nutrations?: TNutration;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
}

export interface RecipeModel extends Model<TRecipe> {

    // Recipe CRUD operations
    createRecipe(recipeData: Partial<TRecipe>): Promise<TRecipe>;
    findRecipeById(recipeId: Types.ObjectId): Promise<TRecipe | null>;
    updateRecipeById(recipeId: Types.ObjectId, updateData: Partial<TRecipe>): Promise<TRecipe | null>;
    softDeleteRecipe(recipeId: Types.ObjectId): Promise<TRecipe | null>;
    findPublishedRecipes(): Promise<TRecipe[]>;
    findRecipesByCategory(category: RecipeCategory): Promise<TRecipe[]>;

    // Comment functionality
    addComment(recipeId: Types.ObjectId, commentData: TComment): Promise<TRecipe | null>;
    addReplyToComment(recipeId: Types.ObjectId, commentId: Types.ObjectId, replyData: TReply): Promise<TRecipe | null>;
    deleteComment(commentId: Types.ObjectId): Promise<TRecipe | null>;
    softDeleteComment(commentId: Types.ObjectId): Promise<TRecipe | null>;
    likeComment(commentId: Types.ObjectId): Promise<TRecipe | null>;

    // Recipe rating and voting
    updateRecipeRating(recipeId: Types.ObjectId, rating: number): Promise<TRecipe | null>;
    addLike(recipeId: Types.ObjectId): Promise<TRecipe | null>;
    addToFavourites(recipeId: Types.ObjectId): Promise<TRecipe | null>;
    removeFromFavourites(recipeId: Types.ObjectId): Promise<TRecipe | null>;
    upvoteRecipe(recipeId: Types.ObjectId): Promise<TRecipe | null>;
    downvoteRecipe(recipeId: Types.ObjectId): Promise<TRecipe | null>;

    // Recipe publish/unpublish functionality
    publishRecipe(recipeId: Types.ObjectId): Promise<TRecipe | null>;
    unpublishRecipe(recipeId: Types.ObjectId): Promise<TRecipe | null>;
}