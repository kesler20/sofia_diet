import { z } from "zod";

// ------------------------------ //
//                                //
//       REACT FLOW TYPES         //
//                                //
// ------------------------------ //

export const NodeParamsSchema = z.object({
  name: z.string(),
  values: z.array(z.number()),
  originalValues: z.array(z.number()).optional(),
  userSelectedInput: z.boolean().optional(),
  minValue: z.optional(z.number()), // for sensors
  maxValue: z.optional(z.number()), // for sensors
  stepSize: z.optional(z.number()), // for sensors
});

/**
 * # Example
 * ```js
 * {
 * inputParams: [{ handleID: "a" }],
 * outputParams: [{ handleID: "b" }],
 * cardName: "This is the first card",
 * cardDetail: "Plus",
 * }
 * ```
 */
export const NodeDataSchema = z.object({
  inputParams: z.array(NodeParamsSchema),
  outputParams: z.array(NodeParamsSchema),
  cardName: z.string(),
  cardDetail: z.string(),
  streamRate: z.number(),
  switchedOn: z.boolean(),
  numberOfRows: z.number(),
  version: z.number().optional(), // for systems
  content: z.optional(z.string()), // for models and canvas
});

/**
 * # Example
 * ```js
 * import {Position} from "reactflow";
 * {
  id: "1",
  type: "input",
  position: { x: 250, y: 5 },
  data: { label: "Node 1" },
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
 * }
  ```
 */
export const NodeSchema = z
  .object({
    id: z.string(),
    type: z.string().optional(),
    position: z.object({ x: z.number(), y: z.number() }),
    data: NodeDataSchema,
    sourcePosition: z.string().optional(),
    targetPosition: z.string().optional(),
  })
  .passthrough();

export const InputNodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({ x: z.number(), y: z.number() }),
  data: z.object({
    inputParams: z.array(NodeParamsSchema),
    outputParams: z.array(
      z.object({
        name: z.string(),
        values: z.array(z.number()),
        originalValues: z.array(z.number()).optional(),
        targetHandle: z.string(),
        userSelectedInput: z.boolean().optional(),
        minValue: z.optional(z.number()), // for sensors
        maxValue: z.optional(z.number()), // for sensors
        stepSize: z.optional(z.number()), // for sensors
      })
    ),
    cardName: z.string(),
    cardDetail: z.string(),
    streamRate: z.number(),
    switchedOn: z.boolean(),
    numberOfRows: z.number(),
    version: z.number().optional(), // for systems
    content: z.optional(z.string()), // for models and canvas
  }),
  sourcePosition: z.string().optional(),
  targetPosition: z.string().optional(),
});

/**
 * # Example
 * ```js
 * {
    id: "e2b-4", // "e2b-4" means edge from node 2 handle b to node 4
    source: "2",
    target: "4",
    sourceHandle: "b",
    type:"smoothstep", // this is optional and when not provided, it will be "curvy"
    animated: true,
    style: { stroke: "#fff" },
 *  },
  ```
 */
export const EdgeSchema = z
  .object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
    sourceHandle: z.string(),
    targetHandle: z.string(),
    type: z.string().optional(),
    animated: z.boolean(),
    style: z.object({ stroke: z.string() }),
  })
  .passthrough();

// ==================//
//                   //
//   CANVAS TYPES    //
//                   //
// ==================//

export const CanvasSchema = z.object({
  name: z.string(),
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema),
  numberOfIterations: z.number(),
  numberOfIterationsPerSecond: z.number(),
  numberOfRows: z.number(),
  version: z.number(),
});

// ------------------------ //
//                          //
//       SIMULATION TYPES   //
//                          //
// -------------------------//

export const DataPointSchema = z.object({
  timestamp: z.number(),
  value: z.number(),
});

export const DataSetSchema = z.record(z.array(DataPointSchema));

export const SimulationResultsSchema = z.record(DataSetSchema);

export const SimulationErrorMessageSchema = z.object({
  message: z.string(),
});

export const SimulationWithCyclesMessageSchema = z.object({
  canvas: CanvasSchema,
  cyclePaths: z.array(z.array(z.string())),
});

// -------------------------------//
//                                //
//       DASHBOARD BUILDER        //
//                                //
// -------------------------------//

enum PlotTypes {
  LINE = "line",
  SCATTER = "scatter",
  BAR = "bar",
  PIE = "pie",
}

export const PlotConfigSchema = z.object({
  x: z.string(), // this will be changed to values when you have a pie chart
  y: z.array(z.string()), // THIS IS FOR EACH LINE IN 2D
  z: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  title: z.string().optional(),
});

export const PlotSchema = z.object({
  name: z.string(),
  data: DataSetSchema, // A PLOT CAN HAVE MULTIPLE LINES
  type: z.enum([
    PlotTypes.LINE,
    PlotTypes.SCATTER,
    PlotTypes.BAR,
    PlotTypes.PIE,
  ] as const),
  configs: PlotConfigSchema,
});

export const DashboardSchema = z.object({
  id: z.string(),
  name: z.string(),
  plots: z.array(PlotSchema),
  streams: z.array(z.string()), // list of topics
  indicators: z.array(DataSetSchema),
  controllers: z.array(NodeParamsSchema), // these will be automatically grouped and then you can separate them
});

// -------------------------------//
//                                //
//       MQTT MESSAGE TYPES       //
//                                //
// -------------------------------//

export const ProductionDataSchema = z.object({
  data: z.array(z.number()),
});

export const EventMessageSchema = z.object({
  type: z.enum(["deployment", "new device"] as const),
  timeStamp: z.number(),
  content: z.string(),
});

export enum TopicsType {
  INPUT = "development/input",
  OUTPUT = "development/output",
  ERRORS = "development/errors",
  MESSAGE = "development/message", // this is to make the frontend more interactive
  EVENTS = "events",
  PRODUCTION_ALL = "production/#",
}

export enum EventMessageTypes {
  DEPLOYMENT = "deployment",
  NEW_DEVICE = "new device",
}

export enum CardDetail {
  Model = "Model",
  DataSet = "Data Set",
  Variable = "Variable",
  Connector = "Connector",
  Output = "Output",
  Sensor = "Sensor",
  System = "System",
}

export type ResolutionType = "second" | "minute" | "hour";

// ----------------------------//
//                             //
//       HTTP MESSAGE TYPES    //
//                             //
// ----------------------------//

export const FileUploadServiceParamSchema = z.object({
  folder: z.string(),
  filename: z.string().optional(),
});

export const FileUploadServiceResourceSchema = z.object({
  resourceName: z.string(),
  resourcePath: z.string(),
  resourceContent: z.string(),
});

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

export type NodeDataType = z.infer<typeof NodeDataSchema>;
export type NodeParamsType = z.infer<typeof NodeParamsSchema>;
export type NodeType = z.infer<typeof NodeSchema>;
export type EdgeType = z.infer<typeof EdgeSchema>;
export type DataPointType = z.infer<typeof DataPointSchema>;
export type DataSetType = z.infer<typeof DataSetSchema>;
export type SimulationErrorMessageType = z.infer<
  typeof SimulationErrorMessageSchema
>;
export type SimulationResultsType = z.infer<typeof SimulationResultsSchema>;
export type CanvasType = z.infer<typeof CanvasSchema>;
export type InputNodeType = z.infer<typeof InputNodeSchema>;
export type SimulationWithCyclesMessageType = z.infer<
  typeof SimulationWithCyclesMessageSchema
>;
export type PlotConfigType = z.infer<typeof PlotConfigSchema>;
export type PlotType = z.infer<typeof PlotSchema>;
export type DashboardType = z.infer<typeof DashboardSchema>;
export type EventMessageType = z.infer<typeof EventMessageSchema>;
export type ProductionDataType = z.infer<typeof ProductionDataSchema>;
export type PlotConfigSchemaType = z.infer<typeof PlotConfigSchema>;
export type FileUploadServiceParamType = z.infer<
  typeof FileUploadServiceParamSchema
>;
export type FileUploadServiceResourceType = z.infer<
  typeof FileUploadServiceResourceSchema
>;
export type NoSQLDbServiceResourceType = z.infer<
  typeof NoSQLDbServiceResourceSchema
>;
export type NoSQLDbServiceParamType = z.infer<typeof NoSQLDbServiceParamSchema>;
