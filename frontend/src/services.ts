import DatabaseInterface from "./models/DatabaseInterface";
import { createEdge, getNodeInputs } from "./contexts/ReactFlowContextProvider";
import {
  CanvasSchema,
  CanvasType,
  EdgeType,
  NodeDataType,
  NodeType,
} from "@lib/types";
import * as XLSX from "xlsx";
import { safeParse } from "@lib/utils";
import MQTTApi from "@lib/MQTTApi";
import { CardDetail } from "./pages/data_stream_designer/DataStreamDesignerPage";

const db = new DatabaseInterface();

export const parseExcelFileContent = (
  modelFile: File
): Promise<{ [key: string]: any[] }> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(modelFile);

    fileReader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      const workbook = XLSX.read(buffer, { type: "buffer" });

      // Assuming the data is in the first sheet
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const result: { [key: string]: any[] } = {};
      const headers = jsonData[0] as string[];

      headers.forEach((header, i) => {
        result[header] = jsonData.slice(1).map((row) => row[i]);
      });

      resolve(result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

const parsePythonFunction = (functionString: string) => {
  const functionLines = functionString.split("\n"); // Split the function string into lines
  let modelFunctionDef = "";
  let returnLine = "";

  // Find the line that defines the "model" function and the return line
  for (let line of functionLines) {
    if (line.startsWith("def model")) {
      modelFunctionDef = line;
    }
    if (line.trim().startsWith("return")) {
      returnLine = line;
    }
  }

  if (!modelFunctionDef) {
    throw new Error('No "model" function found');
  }

  if (!returnLine) {
    throw new Error("No return statement found");
  }

  const paramsString = modelFunctionDef.split("(")[1].split(")")[0]; // Extract the parameters string
  const params = paramsString.split(",").map((param) => param.trim()); // Split the parameters string into an array of parameters

  const returnVarsString = returnLine.split("return")[1]; // Extract the return variables string
  const returnVars = returnVarsString.split(",").map((varName) => varName.trim()); // Split the return variables string into an array of variables

  return {
    inputs: params.filter((param) => param !== "" && param !== " "),
    outputs: returnVars.filter((param) => param !== "" && param !== " "),
  };
};

export const parseModelInputsFromFileUpload = async (
  file: File
): Promise<{ inputs: string[]; outputs: string[] }> => {
  return new Promise<{ inputs: string[]; outputs: string[] }>((resolve, reject) => {
    // Read the file content
    const fileReader = new FileReader();
    fileReader.readAsText(file);

    // When the file loads parse its content to get the model inputs and outputs
    fileReader.onload = async (e) => {
      const fileContent = e.target?.result;
      resolve(parsePythonFunction(fileContent as string));
    };
    fileReader.onerror = (e) => {
      reject(e);
    };
  });
};

export const parseFileName = async (file: File) => {
  return new Promise<string>((resolve) => {
    const fileName = file.name;
    const convertedFileName = fileName
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
      .replace(".py", "")
      .replace(".json", "")
      .replace(".xlsx", "")
      .replace(".csv", "");
    resolve(convertedFileName);
  });
};

export const parseFileContent = async (modelFile: File) => {
  return new Promise((resolve, reject) => {
    // Read the file content
    const fileReader = new FileReader();
    fileReader.readAsText(modelFile);

    // When the file loads parse its content to get the model inputs and outputs
    fileReader.onload = async (e) => {
      const fileContent = e.target?.result;
      resolve(fileContent);
    };
    fileReader.onerror = (e) => {
      reject(e);
    };
  });
};

const addIOCodeBlocksToModelContent = (
  pythonCode: string,
  modelName: string
): string => {
  if (pythonCode === "") return "";
  // Code block to be added at the top
  const topBlock = `
# =====================#
#                      #
#   READ INPUT DATA    #
#                      #
# =====================#

import json
import os

model_name = "${modelName} IO.json"
current_dir = os.path.dirname(os.path.abspath(__file__))
path_to_data = os.path.join(current_dir, model_name)
data = {}
with open(path_to_data) as f:
    data = json.load(f)
inputs = {} # { x : 10, y: 15,... } for arr of len 1; otherwise { x : [10,20,...], y: [15, 20,...],...}
for inputParam in data["inputParams"]:
    if len(inputParam["values"]) == 1:
        inputs[inputParam["name"]] = inputParam["values"][0]
    else:
        inputs[inputParam["name"]] = inputParam["values"]

# ==================#
#                   #
#   UPLOADED CODE   #
#                   #
# ==================#

`;

  // Code block to be added at the bottom
  const bottomBlock = `

# ======================#
#                       #
#   WRITE OUTPUT DATA   #
#                       #
# ======================#

values_in_first_key_in_input_object = inputs[list(inputs.keys())[0]]
if type(values_in_first_key_in_input_object) == list:
    
    # output_result = [
    #    [result for outputParam 1 in row 1, result for outputParam 2 in row 1,...], 
    #    [result for outputParam 1 in row 2, result for outputParam 2 in row 2,...], 
    #     ......
    #  ]
    output_result = []
    for row_index, _ in enumerate(values_in_first_key_in_input_object):
        result = model(**{k: inputs[k][row_index] for k in list(inputs.keys())})
        output_result.append(list(result) if type(result) == tuple else [result])

    for col_index, outputParam in enumerate(data["outputParams"]):
        outputParam["values"] = []
        for row_index, _ in enumerate(values_in_first_key_in_input_object):
            outputParam["values"].append(output_result[row_index][col_index])

else:
    result = model(**inputs)
    output_result = list(result) if type(result) == tuple else [result]
    for outputParam in data["outputParams"]:
        outputParam["values"] = [output_result.pop(0)]

with open(path_to_data, "w") as f:
    json.dump(data, f) 
`;

  // Add the code blocks to the top and bottom of the input code
  const modifiedCode = `${topBlock}\n${pythonCode}\n${bottomBlock}`;

  return modifiedCode;
};

export const createModelContentAndMetadata = async (model: NodeType) => {
  // Create the model file to be executed.
  const createModelFileResponse = await createResource(
    `${model.data.cardName}.py`,
    addIOCodeBlocksToModelContent(model.data.content || "", model.data.cardName),
    "mxe"
  );

  if (!createModelFileResponse)
    throw Error(`Failed to create model file ${model.cardName}`);

  // Create the model metadata information.
  const createModelMetadataResponse = await createResource(
    model.data.cardName,
    model.data,
    model.data.cardDetail
  );

  if (!createModelMetadataResponse) {
    throw Error(`Failed to create ${model.cardName} metadata`);
  }
};

export const detectCyclesInCanvas = (parsedCanvas: CanvasType): string[][] => {
  // Create a graph of the canvas nodes
  const graph: { [k: string]: string[] } = {};
  const canvasGraph: any = {};

  parsedCanvas.nodes.forEach((node) => {
    graph[node.id] = getNodeInputs(node, parsedCanvas).map(
      (inputNode) => inputNode.id
    );
    canvasGraph[node.data.cardName] = getNodeInputs(node, parsedCanvas).map(
      (inputNode) => inputNode.data.cardName
    );
  });
  console.log("Canvas Graph", canvasGraph);

  function findAllCycles(graph: { [key: string]: string[] }): string[][] {
    const visited: { [key: string]: boolean } = {};
    const recStack: { [key: string]: boolean } = {};
    const parent: { [key: string]: string | null } = {};
    const cycles: string[][] = [];

    // Initialize visited, recStack, and parent for all nodes
    for (const node in graph) {
      visited[node] = false;
      recStack[node] = false;
      parent[node] = null;
    }

    function isCyclicUtil(node: string): void {
      if (!visited[node]) {
        visited[node] = true;
        recStack[node] = true;

        for (const neighbor of graph[node]!) {
          if (!visited[neighbor]) {
            parent[neighbor] = node;
            isCyclicUtil(neighbor);
          } else if (recStack[neighbor]) {
            // Cycle detected, backtrack to get the full cycle
            const cyclePath: string[] = [];
            let current = node;
            cyclePath.push(neighbor);
            while (current !== neighbor) {
              cyclePath.push(current);
              current = parent[current]!;
            }
            cyclePath.push(neighbor);
            cyclePath.reverse(); // To show the cycle starting from the node where it was first detected

            // Check if this cycle or its rotation is already recorded
            if (!cycles.some((c) => isSameCycle(c, cyclePath))) {
              cycles.push(cyclePath);
            }
          }
        }
      }

      recStack[node] = false;
    }

    // Check if two cycles are the same (considering rotations)
    function isSameCycle(cycle1: string[], cycle2: string[]): boolean {
      if (cycle1.length !== cycle2.length) return false;
      const len = cycle1.length;
      for (let i = 0; i < len; i++) {
        let isEqual = true;
        for (let j = 0; j < len; j++) {
          if (cycle1[j] !== cycle2[(i + j) % len]) {
            isEqual = false;
            break;
          }
        }
        if (isEqual) return true;
      }
      return false;
    }

    for (const node in graph) {
      if (!visited[node]) {
        isCyclicUtil(node);
      }
    }

    return cycles;
  }

  // Find the cycle path if it exists
  const cyclePaths = findAllCycles(graph);
  cyclePaths.forEach((cyclePath) => {
    console.log("Cycle detected", cyclePath);

    // Get the names of the nodes in the cycle path
    const cyclePathNames = cyclePath.map((node) => {
      return parsedCanvas.nodes.filter((canvasNode) => canvasNode.id === node)[0]
        .data.cardName;
    });
    console.log("Cycle path", cyclePathNames.join(" -> "));
  });

  return cyclePaths;
};

export const replaceSystemNodesWithInnerNodesAndEdges = (canvas: CanvasType) => {
  // Get all the system nodes ids in the canvas.
  const systemNodeIDs = canvas.nodes
    .filter((node) => node.data.cardDetail === CardDetail.System)
    .map((node) => node.id);

  // If there are no system nodes in the canvas, return the canvas as is.
  if (systemNodeIDs.length === 0) return canvas;

  // replace the system node with all the nodes contained in its canvas without considering inner input and output nodes.
  const hydratedNodes: NodeType[] = canvas.nodes
    .map((node) => {
      // If the node is a system node, return the inner nodes in the system node.
      if (node.data.cardDetail === CardDetail.System) {
        // Get the system canvas
        const systemCanvas = safeParse<CanvasType>(
          CanvasSchema,
          node.data.content || ""
        );

        // Return the system canvas nodes without the input and output nodes.
        return systemCanvas.nodes.filter(
          (node) =>
            node.data.outputParams.filter(
              (outputParam) => outputParam.userSelectedInput
            ).length > 0 || node.data.cardDetail === CardDetail.Output
        );

        // If the node is not a system node, return the node as is.
      } else {
        return node;
      }
    })
    .flat();

  // Replace the edges to the system nodes with the edges to the inner nodes in the system nodes.
  const hydratedEdges: EdgeType[] = [];
  canvas.edges.forEach((edge, id) => {
    // Check if the edge is the last edge in the canvas.
    const isLastEdge = id === canvas.edges.length - 1;

    // If the edge is the last in the canvas, return the final edge and the inner edges of the system nodes.
    if (isLastEdge) {
      // Get the system nodes canvas
      const systemNodesCanvas = systemNodeIDs.map((systemNodeID) => {
        return safeParse<CanvasType>(
          CanvasSchema,
          canvas.nodes.filter((node) => node.id === systemNodeID)[0].data.content ||
            ""
        );
      });

      let systemNodeEdgesInInnerCanvas: EdgeType[] = [];

      // For each system node, get the content of the canvas to add its edges in the outer canvas.
      systemNodesCanvas.forEach((systemNodeCanvas) => {
        // Get the edges in the inner system nodes without the edges to the replaced input and output nodes.
        systemNodeCanvas.edges.forEach((edgeInSystemNodeCanvas) => {
          // Remove the edges where the source is a replaced input node in the inner canvas
          if (
            !systemNodeCanvas.nodes
              .filter(
                (node) =>
                  node.data.outputParams.filter((param) => param.userSelectedInput)
                    .length > 0
              )
              .map((node) => node.id)
              .includes(edgeInSystemNodeCanvas.source)
          ) {
            systemNodeEdgesInInnerCanvas.push(edgeInSystemNodeCanvas);
          }

          // Remove the edges where the target is a replaced output node in the inner canvas.
          if (
            !systemNodeCanvas.nodes
              .filter((node) => node.data.cardDetail === CardDetail.Output)
              .map((node) => node.id)
              .includes(edgeInSystemNodeCanvas.target)
          ) {
            systemNodeEdgesInInnerCanvas.push(edgeInSystemNodeCanvas);
          }

          // Add all the remaining edges.
          systemNodeEdgesInInnerCanvas.push(edgeInSystemNodeCanvas);
        });
      });

      // Return the final edge and the inner edges of the system nodes.
      hydratedEdges.push(edge);
      systemNodeEdgesInInnerCanvas.forEach((edge) => {
        hydratedEdges.push(edge);
      });

      // If the edge is connected to a system node inputParam, replace it with an edge connected to the inner target node(s).
    } else if (systemNodeIDs.includes(edge.target)) {
      // Get the system node in the outer canvas
      const systemNodeInOuterCanvas = canvas.nodes.filter(
        (node) => node.id === edge.target
      )[0];
      const systemNodeCanvas = safeParse<CanvasType>(
        CanvasSchema,
        systemNodeInOuterCanvas.data.content || ""
      );

      // Get the system node in the inner canvas by filtering the nodes in the inner canvas by the outputParam name.
      const systemNodeInInnerCanvas = systemNodeCanvas.nodes.filter((systemNode) =>
        systemNode.data.outputParams
          .map((outputParam) => outputParam.name)
          .includes(edge.targetHandle)
      )[0];

      // Get the edges where the inner system node is a source.
      const systemNodeEdgesInInnerCanvas = systemNodeCanvas.edges.filter(
        (systemNodeEdge) => systemNodeEdge.source === systemNodeInInnerCanvas.id
      );

      // Create edges from the outer node to the inner node by replacing the target to each targets of the inner node.
      systemNodeEdgesInInnerCanvas
        .map((systemNodeEdge) => {
          return createEdge(
            edge.source,
            edge.sourceHandle,
            systemNodeEdge.target,
            systemNodeEdge.targetHandle
          );
        })
        .forEach((edge) => {
          hydratedEdges.push(edge);
        });

      // If the edge is connected to a system node outputParam, replace it with an edge connected to the inner outputParam.
    } else if (systemNodeIDs.includes(edge.source)) {
      // Get the system node in the outer canvas
      const systemNodeInOuterCanvas = canvas.nodes.filter(
        (node) => node.id === edge.source
      )[0];
      const systemNodeCanvas = safeParse<CanvasType>(
        CanvasSchema,
        systemNodeInOuterCanvas.data.content || ""
      );

      // Get the output nodes in the inner canvas
      const outputNodesInInnerCanvas = systemNodeCanvas.nodes.filter(
        (systemNode) => systemNode.data.cardDetail === CardDetail.Output
      );

      // For each output node in the inner canvas, create an edge from the source to the output node in the outer canvas.
      outputNodesInInnerCanvas.map((outputNodeInInnerCanvas) => {
        // Get the edges where the output node is a target in the inner canvas.
        const outputNodeEdgesInInnerCanvas = systemNodeCanvas.edges.filter(
          (systemNodeEdge) => systemNodeEdge.target === outputNodeInInnerCanvas.id
        );

        // Create edges from the outer node to the inner node by replacing the source to each sources of the inner output node.
        outputNodeEdgesInInnerCanvas
          .map((outputNodeEdge) => {
            return createEdge(
              outputNodeEdge.source,
              outputNodeEdge.sourceHandle,
              edge.target,
              edge.targetHandle
            );
          })
          .forEach((edge) => {
            hydratedEdges.push(edge);
          });
      });
    } else {
      hydratedEdges.push(edge);
    }
  });

  // Call recursively to add systems to the canvas if there are nested systems.
  replaceSystemNodesWithInnerNodesAndEdges({
    ...canvas,
    nodes: hydratedNodes,
    edges: hydratedEdges,
  });

  return { ...canvas, nodes: hydratedNodes, edges: hydratedEdges };
};

export const discoverMQTTClientTopics = async (
  clientDomain: string,
  waitTime: number
) => {
  const mqttClient = new MQTTApi();
  const topics: string[] = [];

  setTimeout(() => {
    mqttClient.subscribeClient(`${clientDomain}/#`, (message: string) => {
      const parsedMessage = JSON.parse(message);
      const { topic } = parsedMessage;
      if (!topics.includes(topic)) {
        topics.push(topic);
      }
    });
  }, waitTime);

  return topics;
};

// CRUD functions for nodes that are structured all according to the NodeType

export const createNodeInDb = async (node: NodeDataType) => {
  return createResource(node.cardName, node, node.cardDetail);
};

export const readNodeFromDb = async (node: NodeDataType) => {
  return readResourceByName<NodeDataType>(node.cardDetail, node.cardName);
};

export const readNodesFromDb = async (cardDetail: string) => {
  return readResource<NodeDataType[]>(cardDetail);
};

export const updateNodeInDb = async (node: NodeDataType) => {
  return updateResource(node.cardName, node, node.cardDetail);
};

export const deleteNodeInDb = async (node: NodeDataType) => {
  return deleteResource(node.cardDetail, node.cardName);
};

//================================================================================//
//                                                                                //
//   SPECIFIC CRUD FUNCTION TO INTERACT WITH THE FILE SYSTEM FROM THE FRONTEND    //
//                                                                                //
//================================================================================//

// @see server.ts

export const createResource = async <T>(
  resourceName: string,
  resourceContent: T,
  resourcePath: string
) => {
  return db.CREATE<any, T>("files", { resourceName, resourceContent, resourcePath });
};

export const readResource = async <T>(resourcePath: string) => {
  return db.READ<T>(`files/${resourcePath.replace(" ", "__")}`);
};

export const readResourceByName = async <T>(
  resourcePath: string,
  resourceName: string
) => {
  return db.READ<T>(
    `files/${resourcePath.replace(" ", "__")}/${resourceName.replace(" ", "__")}`
  );
};

export const updateResource = async <T>(
  resourceName: string,
  resourceContent: T,
  resourcePath: string
) => {
  return db.UPDATE<any, T>("files", { resourceName, resourceContent, resourcePath });
};

export const deleteResource = async (resourceName: string, resourcePath: string) => {
  return db.DELETE(
    `files/${resourcePath.replace(" ", "__")}/${resourceName.replace(" ", "__")}`
  );
};
