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
  offset: z.number().optional(), // for sensors
  domain: z.string().optional(), // for connectors
  version: z.number().optional(),
  mode: z.optional(z.union([z.literal("range"), z.literal("random")])), // for sensors
  stepSize: z.optional(z.number()), // for sensors
  minValue: z.optional(z.number()), // for sensors
  maxValue: z.optional(z.number()), // for sensors
  content: z.optional(z.string()), // for models and canvas
});

export enum ModeType {
  RANGE = "range",
  RANDOM = "random",
}

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
      })
    ),
    cardName: z.string(),
    cardDetail: z.string(),
    streamRate: z.number(),
    switchedOn: z.boolean(),
    version: z.number().optional(),
    mode: z.optional(z.union([z.literal("range"), z.literal("random")])), // for sensors
    stepSize: z.optional(z.number()), // for sensors
    minValue: z.optional(z.number()), // for sensors
    maxValue: z.optional(z.number()), // for sensors
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
  simulationStart: z.number(),
  simulationEnd: z.number(),
  version: z.number(),
  status: z.enum(["running", "deployed", "paused", "idle"] as const),
});

export enum CanvasStatus {
  STREAMING = "running",
  DEPLOYED = "deployed",
  PAUSED = "paused",
  IDLE = "idle",
}
export enum TopicsType {
  INPUT = "development/input",
  OUTPUT = "development/output",
  ERRORS = "development/errors",
}

// ------------------------ //
//                          //
//       SIMULATION TYPES   //
//                          //
// -------------------------//

export const DataPointSchema = z.object({
  timestamp: z.number(),
  value: z.number(),
});

export const SimulationOutputResultSchema = z.record(z.array(DataPointSchema));
export const SimulationResultsSchema = z.record(SimulationOutputResultSchema);
export const SimulationErrorMessageSchema = z.object({
  message: z.string(),
});

export const SimulationWithCyclesMessageSchema = z.object({
  canvas: CanvasSchema,
  cyclePaths: z.array(z.array(z.string())),
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
export type SimulationOutputResultType = z.infer<
  typeof SimulationOutputResultSchema
>;
export type SimulationErrorMessageType = z.infer<
  typeof SimulationErrorMessageSchema
>;
export type SimulationResultsType = z.infer<typeof SimulationResultsSchema>;
export type CanvasType = z.infer<typeof CanvasSchema>;
export type InputNodeType = z.infer<typeof InputNodeSchema>;
export type SimulationWithCyclesMessageType = z.infer<
  typeof SimulationWithCyclesMessageSchema
>;
