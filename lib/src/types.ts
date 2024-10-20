import { z } from "zod";


// ----------------------------//
//                             //
//       SOFIA DIET TYPES      //
//                             //
// ----------------------------//

export const FoodSchema = z.object({
  name: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  sodium: z.number(),
  sugar: z.number(),
  cost: z.number(),
  amount: z.number(),
  vendor: z.string(),
});

export const RecipeSchema = z.object({
  name: z.string(),
  ingredients: z.array(FoodSchema),
  notes: z.string(),
  tasteScore : z.number(),
});

export enum MealType {
  BREAKFAST = "breakfast",
  LUNCH = "lunch",
  SNACK = "snack",
  DINNER = "dinner",
}

export const MealSchema = z.object({
  name: z.string(),
  recipe: RecipeSchema,
  type: z.enum(["breakfast", "lunch", "snack", "dinner"]),
});

export enum Weekday {
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
  SUNDAY = "sunday",
}

export const DietSchema = z.object({
  name: z.string(),
  weekday: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
  meals: z.array(MealSchema),
});


// ----------------------------//
//                             //
//       HTTP MESSAGE TYPES    //
//                             //
// ----------------------------//

export const NoSQLDbServiceResourceSchema = z.object({
  resourceName: z.string(), 
  resourceContent: z.string(),
});

export const NoSQLDbServiceParamSchema = z.object({
  topic: z.string(),
  resourceName: z.string().optional(),
});

// ------------------------ //
//                          //
//       EXPORTS            //
//                          //
// -------------------------//

export type NoSQLDbServiceResourceType = z.infer<
  typeof NoSQLDbServiceResourceSchema
>;
export type NoSQLDbServiceParamType = z.infer<typeof NoSQLDbServiceParamSchema>;
