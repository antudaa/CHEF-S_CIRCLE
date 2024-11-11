import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import { RecipeServices } from "./recipe.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import mongoose, { Types } from "mongoose";
import { TComment } from "./recipe.interface";

// Create a new recipe
const createNewRecipe: RequestHandler = catchAsync(async (req, res) => {
    const result = await RecipeServices.createNewRecipe(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Recipe added successfully",
        data: result,
    });
});

// Update an existing recipe
const updateRecipe: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await RecipeServices.updateRecipe(new Types.ObjectId(id), req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Recipe updated successfully",
        data: result,
    });
});

// Soft delete a recipe
const softDeleteRecipe: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await RecipeServices.softDeleteRecipe(new Types.ObjectId(id));

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Recipe soft deleted successfully",
        data: result,
    });
});

// Find a recipe by ID
const findRecipeById: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await RecipeServices.findRecipeById(new Types.ObjectId(id));

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Recipe found",
        data: result,
    });
});

// Get all published recipes
const findPublishedRecipes: RequestHandler = catchAsync(async (req, res) => {
    const query = req.query || {};
    const { recipes, totalCount } = await RecipeServices.findPublishedRecipes(query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Published recipes retrieved successfully",
        data: {
            recipes,
            totalCount,
        },
    });
});

const findRecipesByAuthor: RequestHandler = catchAsync(async (req, res) => {
    const { authorId } = req.params; 

    // Call the service function that retrieves recipes by author
    const result = await RecipeServices.findRecipesByAuthor(new Types.ObjectId(authorId));

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Recipes retrieved for author with ID: ${authorId}`,
        data: result,
    });
});

// Get recipes by category with query support
const findRecipesByCategory: RequestHandler = catchAsync(async (req, res) => {
    const { category } = req.params;
    const query = req.query;
    
    const { recipes, totalCount } = await RecipeServices.findRecipesByCategory(category as any, query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Recipes retrieved in category: ${category}`,
        data: {
            recipes,
            totalCount,
        },
    });
});

// Add a comment to a recipe
const addCommentToRecipe: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await RecipeServices.addCommentToRecipe(new Types.ObjectId(id), req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Comment added successfully",
        data: result,
    });
});

// Controller method to reply to a comment
const replyToComment: RequestHandler = catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    const replyData: TComment = req.body;

    const result = await RecipeServices.addReplyToComment(new Types.ObjectId(id), new Types.ObjectId(commentId), replyData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Reply added successfully",
        data: result,
    });
});

const updateComment: RequestHandler = catchAsync(async (req, res) => {
    const { recipeId, commentId } = req.params;
    const updatedCommentData: Partial<TComment> = req.body;

    const result = await RecipeServices.updateComment(new Types.ObjectId(recipeId), new Types.ObjectId(commentId), updatedCommentData);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Comment updated successfully",
        data: result,
    });
});

// Soft delete a comment
const deleteComment: RequestHandler = catchAsync(async (req, res) => {
    const { recipeId, commentId } = req.params;

    const result = await RecipeServices.deleteComment(new Types.ObjectId(recipeId), new Types.ObjectId(commentId));

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Comment deleted successfully",
        data: result,
    });
});

// Get all comments for a specific recipe
const getCommentsForRecipe: RequestHandler = catchAsync(async (req, res) => {
    const { recipeId } = req.params;

    const result = await RecipeServices.getCommentsForRecipe(new Types.ObjectId(recipeId));

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Comments retrieved successfully",
        data: result,
    });
});

// Update recipe rating
const updateRecipeRating: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
    const result = await RecipeServices.updateRecipeRating(new Types.ObjectId(id), rating);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Recipe rating updated",
        data: result,
    });
});

// Add a like to a recipe
const addLikeToRecipe: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await RecipeServices.addLikeToRecipe(new Types.ObjectId(id));

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Recipe liked",
        data: result,
    });
});

// Add to favourites
const addToFavourites: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await RecipeServices.addToFavourites(new Types.ObjectId(id));

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Recipe added to favourites",
        data: result,
    });
});

// Remove from favourites
const removeFromFavourites: RequestHandler = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await RecipeServices.removeFromFavourites(new Types.ObjectId(id));

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Recipe removed from favourites",
        data: result,
    });
});

// Upvote Recipe
const upVoteRecipe: RequestHandler = catchAsync(async (req, res) => {
    const { recipeId } = req.params;
    const convertedRecipeId = new mongoose.Types.ObjectId(recipeId);
    const result = await RecipeServices.upVoteRecipe(convertedRecipeId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Recipe upvoted successfully",
        data: result,
    });
});

// Downvote Recipe
const downVoteRecipe: RequestHandler = catchAsync(async (req, res) => {
    const { recipeId } = req.params;
    const convertedRecipeId = new mongoose.Types.ObjectId(recipeId);
    const result = await RecipeServices.downVoteRecipe(convertedRecipeId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Recipe downvoted successfully",
        data: result,
    });
});

const publishRecipe: RequestHandler = async (req, res) => {
    const { recipeId } = req.params;
    const convertedRecipeId = new mongoose.Types.ObjectId(recipeId);

    const result = await RecipeServices.publishRecipe(convertedRecipeId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Recipe published successfully",
        data: result,
    });
};

// Unpublish a Recipe
const unpublishRecipe: RequestHandler = async (req, res) => {
    const { recipeId } = req.params;
    const convertedRecipeId = new mongoose.Types.ObjectId(recipeId);

    const result = await RecipeServices.unpublishRecipe(convertedRecipeId);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Recipe unpublished successfully",
        data: result,
    });
};


export const RecipeControllers = {
    createNewRecipe,
    updateRecipe,
    softDeleteRecipe,
    findRecipeById,
    findRecipesByAuthor,
    findPublishedRecipes,
    findRecipesByCategory,
    addCommentToRecipe,
    replyToComment,
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
