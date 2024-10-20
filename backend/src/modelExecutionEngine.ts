import { exec } from "child_process";
import path from "path";
import { CyclePathResultMap, FileIO } from "../src/models";
import MQTTApi from "@lib/MQTTApi";
import {
  TopicsType,
  CanvasType,
  InputNodeType,
  NodeParamsType,
  NodeType,
  SimulationOutputResultType,
  SimulationResultsType,
  SimulationWithCyclesMessageType,
  SimulationWithCyclesMessageSchema,
} from "@lib/types";
import { logObject, safeParse } from "@lib/utils";
import "./customLogger";

// The different types of cards representations.
export enum CardDetail {
  Model = "Model",
  DataSet = "Data Set",
  Variable = "Variable",
  Connector = "Connector",
  Output = "Output",
  Sensor = "Sensor",
  System = "System",
}

const file = new FileIO("mxe");
const mqttClient = new MQTTApi();
const cyclePathResultMaps: CyclePathResultMap[] = [];

const runPythonCode = (filePath: string) => {
  console.info("Running python code", filePath);

  return new Promise((resolve, reject) => {
    exec(`python "${filePath}"`, (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.error(error);
        console.info(stderr);
        reject(error);
      } else {
        console.info(stdout);
        resolve(stdout);
      }
    });
  });
};

const getNodeInputs = (node: NodeType, canvas: CanvasType) => {
  console.info("Getting node inputs", node.data.cardName);

  let inputNodes: InputNodeType[] = [];
  canvas.edges.forEach((edge) => {
    if (edge.target === node.id) {
      canvas.nodes.forEach((canvasNode) => {
        if (edge.source === canvasNode.id) {
          inputNodes.push({
            ...canvasNode,
            type: canvasNode.type || "", // TODO: CHECK THE TYPE SYSTEM FOR UNDERSTANDING THIS
            data: {
              ...canvasNode.data,
              outputParams: canvasNode.data.outputParams.map((param) => ({
                ...param,
                targetHandle: edge.targetHandle,
              })),
            },
          });
        }
      });
    }
  });

  // filter all the output params that are not connected to the node.
  return inputNodes.map((inputNode) => {
    return {
      ...inputNode,
      data: {
        ...inputNode.data,
        outputParams: inputNode.data.outputParams.filter((outputParam) =>
          node.data.inputParams
            .map((inputParam) => inputParam.name)
            .includes(outputParam.targetHandle)
        ),
      },
    };
  });
};

async function evaluateModel(
  model: NodeType,
  canvas: CanvasType,
  modelParam: string,
  currentPath: string[]
): Promise<number[]> {
  console.info("Evaluating model", model.data.cardName);

  const inputNodes = getNodeInputs(model, canvas);

  // track the current path
  currentPath.push(model.id);
  console.info("Current path", currentPath);

  // Compare the currentPath and the cyclePaths
  let isCyclePath = false;
  let cyclePathIndex = 0;

  // Check if the current path is part of a cycle path.
  cyclePathResultMaps.forEach((cyclePathResultMap, index) => {
    // If the current path is part of a cycle path
    if (cyclePathResultMap.isCurrentPathInCyclePath(currentPath)) {
      // save the index of the cycle path it belongs to
      cyclePathIndex = index;

      // Update the isCyclePath flag
      isCyclePath = true;

      // Reset the current path.
      currentPath = [];
    }
  });

  // Collect all input nodes output results asynchronously
  const inputNodeOutputResultPromises = inputNodes.flatMap((inputNode) =>
    inputNode.data.outputParams.map(async (inputNodeOutputParam) => {
      console.info("Evaluating input node:", inputNode.data.cardName);

      // If the input node is part of a cycle path, return the cached result
      if (
        isCyclePath &&
        cyclePathResultMaps[cyclePathIndex].cyclePath
          .slice(-2) // the last two nodes in the cycle will always have the inputNode of interest
          .includes(inputNode.id)
      ) {
        console.info(
          `Cycle path detected, returning cached result`,
          cyclePathResultMaps[cyclePathIndex]
        );
        return {
          name: inputNodeOutputParam.targetHandle,
          values: cyclePathResultMaps[cyclePathIndex].cachedResult,
        };
      }

      // If the input node is a model, evaluate the model
      if (inputNode.data.cardDetail === CardDetail.Model) {
        return {
          name: inputNodeOutputParam.targetHandle,
          values: await evaluateModel(
            inputNode,
            canvas,
            inputNodeOutputParam.name,
            currentPath
          ),
        };
      }

      return {
        name: inputNodeOutputParam.targetHandle,
        values: inputNodeOutputParam.values,
      };
    })
  );

  // Wait for all input nodes output results to be collected.
  const inputParams = await Promise.all(inputNodeOutputResultPromises);

  // Update model with all collected input parameters
  const updatedModel = {
    ...model,
    data: {
      ...model.data,
      inputParams: inputParams,
    },
  };

  // Write the model with the updated data to a file
  const fileName = `${updatedModel.data.cardName} IO.json`;
  const filePath = path.join(file.basePath, `${updatedModel.data.cardName}.py`);
  file.createFile(fileName, JSON.stringify(updatedModel.data));
  logObject(updatedModel.data, "Model Data Updated:");

  // Run the python code with the updated model data
  try {
    await runPythonCode(path.join(filePath));
  } catch (e) {
    console.error("Error, Running the python", e);
  }

  // read the results.
  const result = JSON.parse(file.readFile(fileName));

  // Return the output parameter values.
  const resultValues =
    result.outputParams.filter(
      (outputParam: NodeParamsType) => outputParam.name === modelParam
    )[0]?.values || [];

  // Cache the result if it is part of a cycle path
  if (isCyclePath) {
    cyclePathResultMaps[cyclePathIndex].cachedResult = resultValues;
    console.info(
      "Caching updating cached result",
      cyclePathResultMaps[cyclePathIndex].cachedResult
    );
  }

  return resultValues;
}

export async function evaluateOutput(
  output: NodeType,
  canvas: CanvasType
): Promise<SimulationOutputResultType> {
  console.info("Evaluating output", output.data.cardName);

  // Initialise the output result node.
  const outputResult: SimulationOutputResultType = {};
  let result: number[] = [];
  let inputNodeOutputParamName = "";

  // Get all the input nodes connected to the output node
  const inputNodes = getNodeInputs(output, canvas);

  // Evaluate the model if the input node is a model
  for (const inputNode of inputNodes) {
    if (inputNode.data.cardDetail === CardDetail.Model) {
      // Get the name of the inputNode param in the model whose targetHandle matches the output node inputParams
      const modelParamName =
        inputNode.data.outputParams.filter(
          (outputParam) =>
            outputParam.targetHandle === output.data.inputParams[0].name
        )[0].name || "";

      inputNodeOutputParamName = modelParamName;

      // Evaluate the model outputs
      result = await evaluateModel(inputNode, canvas, modelParamName, []);
    } else {
      inputNode.data.outputParams.forEach((outputParam) => {
        if (outputParam.targetHandle === output.data.inputParams[0].name) {
          inputNodeOutputParamName = outputParam.name;

          result = outputParam.values;
        }
      });
    }
  }

  // Transform the sensor/dataset/variable values into the simulationResults format
  outputResult[inputNodeOutputParamName] = result.map((outputVal, index) => {
    return {
      timestamp: Math.round(new Date().getTime() / 1000) + index,
      value: outputVal,
    };
  });

  return outputResult;
}

async function executeModelsWithCycles(
  parsedCanvas: CanvasType,
  streamingTimeouts: NodeJS.Timeout[],
  simulationResults: SimulationResultsType = {}
) {
  console.info("Executing models with cycles");

  // Get all of the outputs to evaluate
  const outputs = parsedCanvas.nodes.filter(
    (node) => node.data.cardDetail === CardDetail.Output
  );

  // Initialise the simulation results with iterations.
  const simulationResultWithIterations: any = {};

  for (let iteration = 0; iteration < parsedCanvas.numberOfIterations; iteration++) {
    console.info("Iteration", iteration);

    // Wrap the body of the loop in an async function and await it
    await new Promise<void>((resolve) => {
      const timeout = setTimeout(async () => {
        // Generate the initial simulation Results
        for (const output of outputs) {
          const outputResults = await evaluateOutput(output, parsedCanvas);

          // store the results in the simulation results object
          simulationResults[output.data.cardName] = outputResults;
          simulationResultWithIterations[output.data.cardName] = {};
          Object.keys(outputResults).forEach((inputNodeOutputParamName) => {
            simulationResultWithIterations[output.data.cardName][
              `${inputNodeOutputParamName} #${iteration}`
            ] = outputResults[inputNodeOutputParamName];
          });
        }

        mqttClient.publishMessage(TopicsType.OUTPUT, simulationResultWithIterations);

        // Resolve the promise when the async work is done
        resolve();
      }, 1000 / parsedCanvas.numberOfIterationsPerSecond);

      // Store the timeout reference
      streamingTimeouts.push(timeout);
    });
  }
}

async function executeModels() {
  mqttClient.subscribeClient(TopicsType.INPUT, async () => {
    // Declare an array to store all timeout references
    let streamingTimeouts: NodeJS.Timeout[] = [];

    // Process all the messages coming from the frontend.
    mqttClient.onMessage(TopicsType.INPUT, async (message: string) => {
      // Clear all existing timeouts and Reset the timeouts array
      streamingTimeouts.forEach(clearTimeout);
      streamingTimeouts = [];

      // Show the incoming stringified message
      console.info(message);

      try {
        // Parse the incoming message
        const { canvas, cyclePaths } = safeParse<SimulationWithCyclesMessageType>(
          SimulationWithCyclesMessageSchema,
          message
        );

        // Store the cycle paths
        cyclePaths.forEach((cyclePath) => {
          cyclePathResultMaps.push(
            new CyclePathResultMap(
              cyclePath,
              Array.from(
                {
                  length: Math.round(canvas.simulationEnd - canvas.simulationStart),
                },
                (_) => 0
              )
            )
          );
        });

        await executeModelsWithCycles(canvas, streamingTimeouts);
      } catch (e) {
        console.error(e);
      }
    });
  });
}

mqttClient.onConnect(async () => {
  console.info("Connected to the broker");
  try {
    await executeModels();
  } catch (e) {
    console.error(e);
  }
});
