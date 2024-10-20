import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { NoSQLDbServiceParamSchema, NoSQLDbServiceResourceSchema } from "@lib/types";
import "./customLogger";
import RedisDBAdapter from "./infrastructure/db/no_sql/redisNoSQLDbAdapter";
import { safeParse } from "@lib/utils";

// ---------------------- //
//                        //
//    App Configuration   //
//                        //
// ---------------------- //

const noSQLDb = new RedisDBAdapter();

const app = express();
app.use(express.json());
app.use(cors());

// -------------------------------------//
//                                      //
//     CRUD ENDPOINTS FOR RESOURCES     //
//                                      //
// -------------------------------------//

app.post(
  "/resources/:topic",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { topic } = NoSQLDbServiceParamSchema.parse(req.params);
      const { resourceName, resourceContent } = NoSQLDbServiceResourceSchema.parse(
        req.body
      );
      const result = await noSQLDb.putResource(
        topic,
        resourceName,
        JSON.parse(resourceContent)
      );
      res.status(201).json(result);
    } catch (error: any) {
      next(error);
    }
  }
);

app.get(
  "/resources/:topic/:resourceName",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { topic, resourceName } = NoSQLDbServiceParamSchema.parse(req.params);
      const resource = await noSQLDb.getResource(topic, resourceName as string);
      if (resource) {
        res.json(resource);
      } else {
        res.status(404).json({ message: "Resource not found" });
      }
    } catch (error: any) {
      next(error);
    }
  }
);

app.get(
  "/resources/:topic",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { topic } = req.params;
      const resources = await noSQLDb.getResources(topic);
      res.json(resources);
    } catch (error: any) {
      next(error);
    }
  }
);

app.put(
  "/resources/:topic/:resourceName",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { topic, resourceName } = req.params;
      const { content } = req.body;

      // check if the resource already exists.
      const existingResource = await noSQLDb.getResource(topic, resourceName);

      if (!existingResource) {
        res.status(404).json({ message: "Resource not found" });
        return;
      }

      const parsedContent = JSON.parse(content);

      // if the name of the resource changes since it is used as the key in the database.
      if (resourceName !== parsedContent.name) {
        await noSQLDb.deleteResource(topic, resourceName);
      }

      const result = await noSQLDb.putResource(topic, resourceName, parsedContent);
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }
);

app.delete(
  "/resources/:topic/:resourceName",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { topic, resourceName } = req.params;
      const result = await noSQLDb.deleteResource(topic, resourceName);
      res.json(result);
    } catch (error: any) {
      next(error);
    }
  }
);

// ---------------------- //
//                        //
//     Server Startup     //
//                        //
// ---------------------- //

// Global error handler
app.use((err: any, res: Response) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.info(`Server is running on port ${port}`);
});
