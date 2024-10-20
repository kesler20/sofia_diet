import { FileIO } from "../src/models";
import express, { NextFunction, Request, Response } from "express";
import { z } from "zod";
import cors from "cors";
import { CanvasSchema, SimulationResultsType } from "@lib/types";
import { CardDetail, evaluateOutput } from "./modelExecutionEngine";
import "./customLogger";
import { logObject } from "@lib/utils";

// Create a schema for the parameters
const paramsSchema = z.object({
  folder: z.string(),
  filename: z.string().optional(),
});

// ---------------------- //
//                        //
//    App Configuration   //
//                        //
// ---------------------- //

const app = express();
app.use(express.json());
app.use(cors());

// ---------------------------------------------------------------------------//
//                                                                            //
//      SPECIFIC CRUD FUNCTIONS TO EXPOSE THE FILE-SYSTEM TO THE FRONTEND     //
//                                                                            //
// ---------------------------------------------------------------------------//

export const resourceSchema = z.object({
  resourceName: z.string(),
  resourcePath: z.string(),
  resourceContent: z.string(),
});
export type ResourceType = z.infer<typeof resourceSchema>;

// Create endpoint
app.post("/files", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { resourceName, resourcePath, resourceContent } = resourceSchema.parse(
      req.body
    );
    const file = new FileIO(resourcePath);
    await file.createFileAsync(resourceName, resourceContent);
    res.status(201).json({ message: "File created successfully" });
  } catch (error: any) {
    next(error);
  }
});

// Read endpoint
app.get(
  "/files/:folder/:filename",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = paramsSchema.parse(req.params);
      const file = new FileIO(params.folder.replace(/__/g, " "));
      const fileContent = await file.readFileAsync(
        params.filename?.replace(/__/g, " ") as string
      );
      if (fileContent === undefined) {
        res.status(404).json({ message: "File not found" });
        return;
      }
      res.json(JSON.parse(fileContent));
    } catch (error: any) {
      next(error);
    }
  }
);

// Read all files in a folder
app.get(
  "/files/:folder",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { folder } = paramsSchema.parse(req.params);
      const file = new FileIO(folder);
      const filesInFolder = await file.readFilesAsync();
      const fileContentInFolderPromises = filesInFolder.map((fileName) =>
        file
          .readFileAsync(fileName)
          .then((content) => content && JSON.parse(content))
      );
      const fileContentInFolder = await Promise.all(fileContentInFolderPromises);
      res.json(fileContentInFolder);
    } catch (error: any) {
      next(error);
    }
  }
);

// Update endpoint
app.put("/files", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { resourceName, resourcePath, resourceContent } = resourceSchema.parse(
      req.body
    );
    const file = new FileIO(resourcePath);
    await file.updateFileAsync(resourceName, resourceContent);
    res.status(200).json({ message: "File updated successfully" });
  } catch (error: any) {
    next(error);
  }
});

// Delete endpoint
app.delete(
  "/files/:folder/:filename",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = paramsSchema.parse(req.params);
      const file = new FileIO(params.folder);
      await file.deleteFileAsync(params.filename as string);
      res.status(200).json({ message: "File deleted successfully" });
    } catch (error: any) {
      next(error);
    }
  }
);

//-------------------------//
//                         //
//     Simulation Routes   //
//                         //
//-------------------------//

// Endpoint for creating a new file
app.post("/simulation", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedCanvas = CanvasSchema.parse(req.body);
    console.info("Simulation request received", parsedCanvas);

    const simulationResults: SimulationResultsType = {};
    console.info("Executing models without cycles");

    // Get all the output nodes.
    const outputs = parsedCanvas.nodes.filter(
      (node) => node.data.cardDetail === CardDetail.Output
    );

    // Create an array of promises to evaluate the output nodes.
    const outputResultsPromises = outputs.map((output) =>
      evaluateOutput(output, parsedCanvas)
    );

    // Wait for all the output nodes to be evaluated.
    const outputResults = await Promise.all(outputResultsPromises);

    // store the results in the simulation results object
    outputResults.forEach((result, index) => {
      simulationResults[outputs[index].data.cardName] = result;
    });

    logObject(simulationResults, "Simulation Results Generated");

    res.status(201).json(simulationResults);
  } catch (error: any) {
    next(error);
  }
});

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
