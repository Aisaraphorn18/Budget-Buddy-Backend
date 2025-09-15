import { Elysia } from "elysia";
import { CategoryController } from "../controllers/category.controller";

const categoryController = new CategoryController();

export const categoryRoutes = new Elysia({ prefix: "/api/v1/categories" })
  .get("/", 
    async (context) => await categoryController.getAllCategories(context),
    {
      detail: {
        tags: ["Categories"],
        summary: "Get all categories",
        description: "Retrieve all available categories (10 fixed categories)"
      }
    }
  )
  .get("/:id", 
    async (context) => await categoryController.getCategoryById(context),
    {
      detail: {
        tags: ["Categories"],
        summary: "Get category by ID",
        description: "Retrieve a specific category by its ID"
      }
    }
  );