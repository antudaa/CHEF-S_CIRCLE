import express from "express";
import { RecipeControllers } from "./recipe.controller";
import { authenticateUser, authorizeAdmin } from "../../middlewares/auth";

const router = express.Router();

// Add Recipe Route
router.post('/',
    authenticateUser,
    RecipeControllers.createNewRecipe,
);
// Update Recipe Route 
router.patch('/:id',
    authenticateUser,
    RecipeControllers.updateRecipe,
);
// Soft Delete Recipe
router.delete('/:id',
    authenticateUser,
    RecipeControllers.softDeleteRecipe,
);
// Find Single Recipe
router.get('/:id',
    // authenticateUser,
    RecipeControllers.findRecipeById,
);
router.get('/author/:authorId',
    authenticateUser,
    RecipeControllers.findRecipesByAuthor,
);
// Find Published Recipes
router.get('/',
    // authenticateUser,
    RecipeControllers.findPublishedRecipes,
);
// Find Recipes By Category
router.get('/category/:category',
    authenticateUser,
    RecipeControllers.findRecipesByCategory,
);
// Add Comment Route
router.post('/:id/comment',
    authenticateUser,
    RecipeControllers.addCommentToRecipe,
);
// Route to handle replying to a comment
router.post('/:id/comment/:commentId/reply', 
    authenticateUser,
    RecipeControllers.replyToComment,
);
// Give Rating Route
router.patch('/:id/rate',
    authenticateUser,
    RecipeControllers.updateRecipeRating,
);
// Add Like Route
router.patch('/:id/like',
    authenticateUser,
    RecipeControllers.addLikeToRecipe,
);
// Add Favourite Route
router.patch('/:id/favourite',
    authenticateUser,
    RecipeControllers.addToFavourites,
);
// Unfavourite Route
router.patch('/:id/unfavourite',
    authenticateUser,
    RecipeControllers.removeFromFavourites,
);
// Up-vote Recipe Route
router.patch('/upvote/:recipeId',
    authenticateUser,
    RecipeControllers.upVoteRecipe,
);
// Down-vote Recipe Route
router.patch('/downvote/:recipeId',
    authenticateUser,
    RecipeControllers.downVoteRecipe,
);
// Publish Recipe By Admin Route 
router.patch('/publish/:recipeId',
    authenticateUser,
    authorizeAdmin,
    RecipeControllers.publishRecipe,
);
// Unpublish Recipe By Admin Route
router.patch('/unpublish/:recipeId',
    authenticateUser,
    authorizeAdmin,
    RecipeControllers.unpublishRecipe,
);

export const RecipeRoutes = router;
