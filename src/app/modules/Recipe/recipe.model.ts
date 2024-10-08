import { Schema, model, Types } from 'mongoose';
import { IngredientCategory, RecipeCategory, Unit } from './enums';
import { RecipeModel, TRecipe } from './recipe.interface';

// Define TIngredient Schema
const ingredientSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        unit: {
            type: String,
            enum: Object.values(Unit),
            required: true,
        },
    },
    { _id: false }
);

// Define TStep Schema
const stepSchema = new Schema(
    {
        instructions: {
            type: String,
            required: true,
        },
        duration: Number, // Optional
        tips: [String], // Optional
    },
    { _id: false }
);

// Define TReply Schema
const replySchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },  // Track likes on a reply
    replies: [{ type: Types.ObjectId, ref: 'CommentReply' }],
}, { timestamps: true });

// Define TComment Schema
const commentSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
    replies: [replySchema],
}, { timestamps: true });

// Define TNutration Schema
const nutrationSchema = new Schema(
    {
        calories: Number,
        protein: Number,
        carbs: Number,
        fats: Number,
    },
    { _id: false },
);

// Define the TRecipe Schema
const recipeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    author: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 0,
    },
    steps: [stepSchema],
    images: [String],
    category: {
        type: String,
        required: true,
    },
    ingredients: [ingredientSchema],
    cookingTime: {
        type: Number,
        required: true,
    },
    publishStatus: {
        type: String,
        enum: ['publish', 'unpublish'],
        default: 'unpublish',
    },
    comments: [commentSchema],  // Array of comments with replies
    likes: {
        type: Number,
        default: 0,
    },
    favourites: {
        type: Number,
        default: 0,
    },
    upvotes: {
        type: Number,
        default: 0,
    },
    downvotes: {
        type: Number,
        default: 0,
    },
    nutrations: nutrationSchema,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
},
    {
        timestamps: true,
    }
);

// Methods Implementation
recipeSchema.statics.createRecipe = async function (recipeData) {
    const recipe = new this(recipeData);
    return recipe.save();
};

recipeSchema.statics.findRecipeById = async function (recipeId) {
    return (await this.findById(recipeId)) || false;
};

recipeSchema.statics.updateRecipeById = async function (recipeId, updateData) {
    return this.findByIdAndUpdate(recipeId, updateData, { new: true });
};

recipeSchema.statics.softDeleteRecipe = async function (recipeId) {
    return this.findByIdAndUpdate(recipeId, { isDeleted: true }, { new: true });
};

recipeSchema.statics.findPublishedRecipes = async function () {
    return this.find({ publishStatus: 'publish' });
};

recipeSchema.statics.findRecipesByCategory = async function (category) {
    return this.find({ category });
};

// Add a comment to the recipe
recipeSchema.statics.addComment = async function (recipeId, commentData) {
    return this.findByIdAndUpdate(
        recipeId,
        { $push: { comments: commentData } },
        { new: true }
    );
};

// Add a reply to a comment
recipeSchema.statics.addReplyToComment = async function (commentId, replyData) {
    return this.updateOne(
        { 'comments._id': commentId },
        { $push: { 'comments.$.replies': replyData } },
        { new: true }
    );
};

// Update Recipe Rating
recipeSchema.statics.updateRecipeRating = async function (recipeId, rating) {
    return this.findByIdAndUpdate(recipeId, { rating }, { new: true });
};

// Add Like to a Recipe
recipeSchema.statics.addLike = async function (recipeId) {
    return this.findByIdAndUpdate(recipeId, { $inc: { likes: 1 } }, { new: true });
};

// Add Recipe to Favourites
recipeSchema.statics.addToFavourites = async function (recipeId) {
    return this.findByIdAndUpdate(recipeId, { $inc: { favourites: 1 } }, { new: true });
};

// Remove Recipe from Favourites
recipeSchema.statics.removeFromFavourites = async function (recipeId) {
    return this.findByIdAndUpdate(recipeId, { $inc: { favourites: -1 } }, { new: true });
};

// Upvote Recipe
recipeSchema.statics.upvoteRecipe = async function (recipeId) {
    return this.findByIdAndUpdate(recipeId, { $inc: { upvotes: 1 } }, { new: true });
};

// Downvote Recipe
recipeSchema.statics.downvoteRecipe = async function (recipeId) {
    return this.findByIdAndUpdate(recipeId, { $inc: { downvotes: 1 } }, { new: true });
};

// Publish Recipe
recipeSchema.statics.publishRecipe = async function (recipeId) {
    return this.findByIdAndUpdate(recipeId, { publishStatus: 'publish' }, { new: true });
};

// Unpublish Recipe
recipeSchema.statics.unpublishRecipe = async function (recipeId) {
    return this.findByIdAndUpdate(recipeId, { publishStatus: 'unpublish' }, { new: true });
};

// Export the Recipe model with custom methods
export const Recipe = model<TRecipe, RecipeModel>('Recipe', recipeSchema);
