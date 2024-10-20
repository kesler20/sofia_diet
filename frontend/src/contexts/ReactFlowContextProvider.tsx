import React from "react";
import { useStoredValue } from "../customHooks";
import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  useEdgesState,
  useNodesState,
} from "reactflow";
import {
  CanvasStatus,
  CanvasType,
  EdgeType,
  InputNodeType,
  NodeDataType,
  NodeParamsType,
  NodeType,
} from "../../../lib/src/types";
import { generateRandomId } from "../../../lib/src/utils";
import { nodeTypes } from "../pages/data_stream_designer/DataStreamDesignerPage";

// define the type of the context value
interface IReactFlowContext {
  nodes: Node<NodeDataType, string>[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node<NodeDataType, string>[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onNodesChange: (nodes: NodeChange[]) => void;
  onEdgesChange: (edges: EdgeChange[]) => void;
  canvas: CanvasType;
  setCanvas: React.Dispatch<React.SetStateAction<CanvasType>>;
}

// define the interface for the function providing the context (context provider)
interface IReactFlowContextProvider {
  children: React.ReactNode;
}

export const defaultCanvas: CanvasType = {
  name: "Default Canvas Name",
  version: 1,
  status: CanvasStatus.IDLE,
  nodes: [],
  edges: [],
  numberOfIterations: 1_000,
  numberOfIterationsPerSecond: 1,
  simulationStart: 0,
  simulationEnd: 100,
};

const ReactFlowContext = React.createContext<IReactFlowContext>({
  nodes: [],
  edges: [],
  setNodes: () => {},
  setEdges: () => {},
  onNodesChange: () => {},
  onEdgesChange: () => {},
  canvas: defaultCanvas,
  setCanvas: () => {},
});

export const ReactFlowContextProvider: React.FC<IReactFlowContextProvider> = ({
  children,
}) => {
  const [canvas, setCanvas] = useStoredValue<CanvasType>(defaultCanvas, "canvas");
  const [edges, setEdges, onEdgesChange] = useEdgesState(canvas.edges);
  const [nodes, setNodes, onNodesChange] = useNodesState(
    canvas.nodes as Node<NodeDataType, string>[]
  );

  return (
    <ReactFlowContext.Provider
      value={{
        nodes: nodes as Node<NodeDataType, string>[],
        edges,
        canvas,
        setNodes: setNodes as React.Dispatch<
          React.SetStateAction<Node<NodeDataType, string>[]>
        >,
        setEdges,
        onNodesChange,
        onEdgesChange,
        setCanvas,
      }}
    >
      {children}
    </ReactFlowContext.Provider>
  );
};

export const useStateContext = () => React.useContext(ReactFlowContext);

// Function used to create an object that can be saved as a node.
export const createNode = (
  currentCards: Node<NodeDataType, string>[],
  inputParams: NodeParamsType[],
  outputParams: NodeParamsType[],
  cardName: string,
  cardType: keyof typeof nodeTypes,
  cardDetail: string,
  optionalDataProps?: Partial<NodeDataType>
) => {
  return {
    id: generateRandomId(14),
    type: cardType,
    position: { x: 10 + currentCards.length * 2, y: 10 },
    data: {
      inputParams,
      outputParams,
      cardName,
      cardDetail,
      streamRate: 1,
      switchedOn: true,
      ...optionalDataProps,
    },
  };
};

export const getNodeInputs = (node: NodeType, canvas: CanvasType) => {
  console.log("Getting node inputs", node.data.cardName);

  let inputNodes: InputNodeType[] = [];
  canvas.edges.forEach((edge) => {
    if (edge.target === node.id) {
      canvas.nodes.forEach((canvasNode) => {
        if (edge.source === canvasNode.id) {
          inputNodes.push({
            ...canvasNode,
            type: canvasNode.type as keyof typeof nodeTypes,
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

export const createEdge = (
  source: string,
  target: string,
  sourceHandle: string,
  targetHandle: string
): EdgeType => {
  return {
    id: `reactflow__edge-${source}${sourceHandle}-${target}${targetHandle}`,
    source,
    target,
    sourceHandle: "output",
    targetHandle: "input",
    type: "smoothstep",
    animated: true,
    style: {
      stroke: "black",
    },
  };
};
