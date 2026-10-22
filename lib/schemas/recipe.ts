import * as z from "zod";


export const DifficultySchema = z.enum([
    "Easy",
    "Medium",
]);
export type Difficulty = z.infer<typeof DifficultySchema>;

export const RecipeSchema = z.object({
    "id": z.number(),
    "name": z.string(),
    "ingredients": z.array(z.string()),
    "instructions": z.array(z.string()),
    "prepTimeMinutes": z.number(),
    "cookTimeMinutes": z.number(),
    "servings": z.number(),
    "difficulty": DifficultySchema,
    "cuisine": z.string(),
    "caloriesPerServing": z.number(),
    "tags": z.array(z.string()),
    "userId": z.number(),
    "image": z.string(),
    "rating": z.number(),
    "reviewCount": z.number(),
    "mealType": z.array(z.string()),
});
export type Recipe = z.infer<typeof RecipeSchema>;

export const RecipeListResponseSchema = z.object({
    "recipes": z.array(RecipeSchema),
    "total": z.number(),
    "skip": z.number(),
    "limit": z.number(),
});
export type RecipeListResponse = z.infer<typeof RecipeListResponseSchema>;
