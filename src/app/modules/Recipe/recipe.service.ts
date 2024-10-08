import { Document, Schema, Types } from "mongoose";
import { TComment, TRecipe } from "./recipe.interface";
import { Recipe } from "./recipe.model";
import { RecipeCategory } from "./enums";
import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../Errors/AppError";
import httpStatus from "http-status";

const createNewRecipe = async (payload: TRecipe) => {
    const result = await Recipe.create(payload);
    return result;
};

const updateRecipe = async (id: Types.ObjectId, payload: Partial<TRecipe>) => {
    const result = await Recipe.findByIdAndUpdate(
        id,
        payload,
        { new: true },
    );
    return result;
};

const softDeleteRecipe = async (id: Types.ObjectId) => {
    const isRecipeExists = await Recipe.findRecipeById(id);
    if (!isRecipeExists) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Recipe not exists')
    }
    const result = await Recipe.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
    );
    return result;
};

const findRecipeById = async (id: Types.ObjectId) => {
    const result = await Recipe.findRecipeById(id);
    return result;
};

const findPublishedRecipes = async (query: Record<string, unknown>) => {
    let modelQuery = Recipe.find({ publishStatus: 'publish' });

    // Apply QueryBuilder for dynamic search, filter, sort, paginate
    const queryBuilder = new QueryBuilder<TRecipe>(modelQuery, query);
    queryBuilder.search(['name', 'description', 'category'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const recipes = await queryBuilder.modelQuery.exec();
    const totalCount = await queryBuilder.getTotalCount();

    return { recipes, totalCount };
};

const findRecipesByCategory = async (category: RecipeCategory, query: Record<string, unknown>) => {
    let modelQuery = Recipe.find({ category, publishStatus: 'publish' });

    // Apply QueryBuilder for dynamic search, filter, sort, paginate
    const queryBuilder = new QueryBuilder<TRecipe>(modelQuery, query);
    queryBuilder.search(['name', 'description'])
        .filter()
        .sort()
        .paginate()
        .fields();

    const recipes = await queryBuilder.modelQuery.exec();
    const totalCount = await queryBuilder.getTotalCount();

    return { recipes, totalCount };
};

const addCommentToRecipe = async (recipeId: Types.ObjectId, comment: TComment) => {
    const result = await Recipe.addComment(recipeId, comment);
    return result;
};

const addReplyToComment = async (recipeId: Types.ObjectId, commentId: Types.ObjectId, reply: TComment) => {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
        throw new AppError(httpStatus.NOT_FOUND, "Recipe not found");
    }

    // Check if the comments field exists, otherwise initialize it
    if (!recipe.comments) {
        recipe.comments = [];
    }

    console.log(commentId);
    console.log(recipe.comments.find(comment => comment._id))
    const comment = recipe.comments.find(comment => comment._id.equals(commentId));
    if (!comment) {
        throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
    }

    // Add the reply to the comment
    if (!comment.replies) {
        comment.replies = [];  // Initialize replies if not present
    }
    comment.replies.push(reply);

    // Save the updated recipe
    await recipe.save();

    return recipe;  // Return the full recipe with the updated comment and replies
};

// Update an existing comment
const updateComment = async (recipeId: Types.ObjectId, commentId: Types.ObjectId, updatedComment: Partial<TComment>) => {
    const recipe = await Recipe.findById(recipeId) as Document<unknown, {}, TRecipe> & TRecipe & { _id: Types.ObjectId };
    if (!recipe) {
        throw new AppError(httpStatus.NOT_FOUND, "Recipe not found");
    }

    // Ensure comments exist and are not empty
    if (!recipe.comments || recipe.comments.length === 0) {
        throw new AppError(httpStatus.NOT_FOUND, "No comments found for this recipe");
    }

    // Ensure commentId and comment._id are ObjectIds and compare them properly
    const commentIndex = recipe.comments.findIndex(comment => comment._id.equals(commentId));
    if (commentIndex === -1) {
        throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
    }

    // Update the comment with new data, including updatedAt
    recipe.comments[commentIndex] = {
        ...recipe.comments[commentIndex],
        ...updatedComment,
        updatedAt: new Date() as unknown as Schema.Types.Date,  // Cast to Schema.Types.Date via unknown
    };

    // Save the updated recipe document
    await recipe.save();
    
    // Return the updated comment
    return recipe.comments[commentIndex];
};

// Delete a comment (soft delete by setting 'deleted' to true)
const deleteComment = async (recipeId: Types.ObjectId, commentId: Types.ObjectId) => {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
        throw new AppError(httpStatus.NOT_FOUND, "Recipe not found");
    }

    if (!recipe.comments || recipe.comments.length === 0) {
        throw new AppError(httpStatus.NOT_FOUND, "No comments found for this recipe");
    }

    const comment = recipe.comments.find(comment => comment._id.equals(commentId));
    if (!comment) {
        throw new AppError(httpStatus.NOT_FOUND, "Comment not found");
    }

    comment.deleted = true; // Soft delete the comment
    await recipe.save();
    return comment;
};

// Get all comments for a specific recipe
const getCommentsForRecipe = async (recipeId: Types.ObjectId) => {
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
        throw new AppError(httpStatus.NOT_FOUND, "Recipe not found");
    }
    return recipe.comments;
};

const updateRecipeRating = async (recipiId: Types.ObjectId, rating: number) => {
    const result = await Recipe.updateRecipeRating(recipiId, rating);
    return result;
};

const addLikeToRecipe = async (recipeId: Types.ObjectId) => {
    const result = await Recipe.addLike(recipeId);
    return result;
};

const addToFavourites = async (recipeId: Types.ObjectId) => {
    const result = await Recipe.addToFavourites(recipeId);
    return result;
};

const removeFromFavourites = async (recipeId: Types.ObjectId) => {
    const result = await Recipe.removeFromFavourites(recipeId);
    return result;
};

const upVoteRecipe = async (recipeId: Types.ObjectId) => {
    const result = await Recipe.upvoteRecipe(recipeId);
    return result;
};

const downVoteRecipe = async (recipeId: Types.ObjectId) => {
    const result = await Recipe.downvoteRecipe(recipeId);
    return result;
};

const publishRecipe = async (recipeId: Types.ObjectId) => {
    const result = await Recipe.publishRecipe(recipeId);
    return result;
};

const unpublishRecipe = async (recipeId: Types.ObjectId) => {
    const result = await Recipe.unpublishRecipe(recipeId);
    return result;
};

export const RecipeServices = {
    createNewRecipe,
    updateRecipe,
    softDeleteRecipe,
    findRecipeById,
    findPublishedRecipes,
    findRecipesByCategory,
    addCommentToRecipe,
    addReplyToComment,
    updateComment,
    deleteComment,
    getCommentsForRecipe,
    updateRecipeRating,
    addLikeToRecipe,
    addToFavourites,
    removeFromFavourites,
    upVoteRecipe,
    downVoteRecipe,
    publishRecipe,
    unpublishRecipe,
};