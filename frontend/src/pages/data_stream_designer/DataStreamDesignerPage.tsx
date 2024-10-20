import { useEffect, useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  Controls,
  Connection,
  Edge,
  Background,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  NodeParamsType,
  NodeType,
  SimulationResultsType,
  NodeDataType,
  SimulationErrorMessageSchema,
  SimulationResultsSchema,
  SimulationErrorMessageType,
  TopicsType,
  CanvasType,
  SimulationWithCyclesMessageType,
} from "../../../../lib/src/types";
import "../../styles/index.css";
import SystemCard from "./components/cards/SystemCard";
import VariableCard from "./components/cards/VariableCard";
import { primaryColor, primaryColorLight } from "../../styles/colorPalette";
import SelectCardModal from "./components/modals/SelectCardModal";
import EditCardModal from "./components/modals/EditCardModal";
import { TbMathFunction, TbMobiledata, TbPlugConnected } from "react-icons/tb";
import { FaDatabase } from "react-icons/fa";
import { MdSensors } from "react-icons/md";
import { RxContainer } from "react-icons/rx";
import CreateCardModal from "./components/modals/CreateCardModal";
import MQTTApi from "@lib/MQTTApi";
import OutputCard from "./components/cards/OutputCard";
import SimulationResults from "./components/SimulationResultsDropDown";
import CustomButton, {
  CustomButtonState,
} from "../../components/buttons/CustomButton";
import { HiVariable } from "react-icons/hi2";
import {
  replaceSystemNodesWithInnerNodesAndEdges as replaceSystemNodesWithInnerNodesAndEdges,
  createModelContentAndMetadata,
  createNodeInDb,
  deleteNodeInDb,
  detectCyclesInCanvas,
  readNodesFromDb,
} from "../../services";
import {
  defaultCanvas,
  createNode,
  useStateContext,
} from "../../contexts/ReactFlowContextProvider";
import SensorCard from "./components/cards/SensorCard";
import EditCanvasModal from "./components/modals/EditCanvasModal";
import { safeParse } from "../../../../lib/src/utils";
import CreateCanvasModal from "./components/modals/CreateCanvasModal";
import DatabaseInterface from "../../models/DatabaseInterface";
import { useKeyboardShortcuts } from "../../customHooks";
import CreateSketchModal from "./components/modals/CreateSketchModal";
import CreateConnectorModal from "./components/modals/CreateConnectorModal";
import { LuHistory } from "react-icons/lu";
import LeftDrawer, { Folder } from "../../components/sidebar/LeftDrawer";
import CanvasValidator from "./containers/CanvasValidator";

// Setup the configs for the canvas
const connectionLineStyle = { stroke: primaryColor };
const defaultViewport = { x: 0, y: 0, zoom: 100 };
const canvasStyles = { background: primaryColorLight };

// Setup the different node types
export const nodeTypes = {
  systemCard: SystemCard,
  outputCard: OutputCard,
  variableCard: VariableCard,
  sensorCard: SensorCard,
};

export enum CardType {
  SystemCard = "systemCard",
  OutputCard = "outputCard",
  VariableCard = "variableCard",
  SensorCard = "sensorCard",
}

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

export const nodeIcons = {
  [CardDetail.Model]: <TbMathFunction color="rgb(200,200,200)" />,
  [CardDetail.DataSet]: <FaDatabase />,
  [CardDetail.Connector]: <TbPlugConnected />,
  [CardDetail.Variable]: <HiVariable />,
  [CardDetail.Output]: <TbMobiledata color="rgb(200,200,200)" />,
  [CardDetail.Sensor]: <MdSensors />,
  [CardDetail.System]: <RxContainer />,
};

/**
 * This component uses the ReactFlow library to create a canvas
 * for the documentation @see https://reactflow.dev/examples
 * @returns Reactflow Canvas
 */
export default function DataStreamDesignerPage() {
  // Get the nodes and edges from the context
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    canvas,
    setCanvas,
  } = useStateContext();

  // State variables to orchestrate the opening and closing of the CRUD modals.
  const [editCardModalOpen, setEditCardModalOpen] = useState(false);
  const [createCardModalOpen, setCreateCardModalOpen] = useState(false);
  const [selectCardModalOpen, setSelectCardModalOpen] = useState(false);
  const [simulationResultsOpen, setSimulationResultsOpen] = useState(false);
  const [simulationResults, setSimulationResults] = useState<SimulationResultsType>(
    {}
  );
  const [startSimulation, setStartSimulation] = useState(false);
  const [editCanvasModalOpen, setEditCanvasModalOpen] = useState(false);
  const [createCanvasModalOpen, setCreateCanvasModalOpen] = useState(false);
  const [createSystemModalOpen, setCreateSystemModalOpen] = useState(false);
  const [createConnectorModalOpen, setCreateConnectorModalOpen] = useState(false);

  // This is used to tell the CreateCardModal, what card is being created
  // Is also used to tell the handleCreateCardModalSubmit what card to create.
  const [cardSelectedToBeCreated, setCardSelectedToCreated] = useState<{
    cardDetail: CardDetail;
    cardType: CardType;
    inputParams?: NodeParamsType[];
    outputParams?: NodeParamsType[];
  } | null>(null);

  const [cardSelectedToBeEdited, setCardSelectedToBeEdited] = useState<NodeType>(
    nodes[0] as NodeType
  );
  const [drawerStructure, setDrawerStructure] = useState<Folder>({
    name: "Saved Cards",
    icon: <LuHistory color="rgb(220,220,220)" />,
    folderIndex: 0,
    subFolders: [
      {
        name: "Models",
        folderIndex: 1,
        icon: nodeIcons[CardDetail.Model],
        subFolders: [],
      },
      {
        name: "Data Sets",
        folderIndex: 1,
        icon: nodeIcons[CardDetail.DataSet],
        subFolders: [],
      },
      {
        name: "Connectors",
        folderIndex: 1,
        icon: nodeIcons[CardDetail.Connector],
        subFolders: [],
      },
      {
        name: "Systems",
        folderIndex: 1,
        icon: nodeIcons[CardDetail.System],
        subFolders: [],
      },
    ],
  });
  const cardCategories = [
    {
      icon: nodeIcons[CardDetail.Model],
      name: CardDetail.Model,
      menuItems: [
        {
          name: "New",
          sideEffect: () => handleAddCard(CardType.SystemCard, CardDetail.Model),
        },
        {
          name: "AutoML",
          sideEffect: () => handleAddCard(CardType.SystemCard, CardDetail.Model),
        },
        {
          name: "MEB", // for PDE, ODE, DAE and HSM
          sideEffect: () => handleAddCard(CardType.SystemCard, CardDetail.Model),
        },
      ],
    },
    {
      icon: nodeIcons[CardDetail.DataSet],
      name: CardDetail.DataSet,
      menuItems: [
        {
          name: "New",
          sideEffect: () => handleAddCard(CardType.SystemCard, CardDetail.DataSet),
        },
        {
          name: "Data Gen",
          sideEffect: () => handleAddCard(CardType.SystemCard, CardDetail.DataSet),
        },
        {
          name: "DoE",
          sideEffect: () => handleAddCard(CardType.SystemCard, CardDetail.DataSet),
        },
        {
          name: "Query",
          sideEffect: () => handleAddCard(CardType.SystemCard, CardDetail.DataSet),
        },
      ],
    },
    {
      icon: nodeIcons[CardDetail.Connector],
      name: CardDetail.Connector,
      menuItems: [
        {
          name: "New",
          sideEffect: () => setCreateConnectorModalOpen(true), // MQTT, OPC UA, REST
        },
        {
          name: "Emulator",
          sideEffect: () => setCreateConnectorModalOpen(true), // MQTT, OPC UA, REST
        },
      ],
    },
    {
      icon: nodeIcons[CardDetail.Variable],
      name: CardDetail.Variable,
      menuItems: [
        {
          name: "New",
          sideEffect: () =>
            handleAddCard(CardType.VariableCard, CardDetail.Variable),
        },
      ],
    },
    {
      icon: nodeIcons[CardDetail.Sensor],
      name: CardDetail.Sensor,
      menuItems: [
        {
          name: "New",
          sideEffect: () => handleAddCard(CardType.SensorCard, CardDetail.Sensor),
        },
      ],
    },
    {
      icon: nodeIcons[CardDetail.Output],
      name: CardDetail.Output,
      menuItems: [
        {
          name: "Output",
          sideEffect: () => handleAddCard(CardType.OutputCard, CardDetail.Output),
        },
      ],
    },
  ];

  //=========================================================//
  //                                                         //
  //   PUBLISH THE CANVAS AND SUBSCRIBE TO THE SIMULATION    //
  //                                                         //
  //=========================================================//

  useEffect(() => {
    if (startSimulation) {
      const hydratedCanvas = replaceSystemNodesWithInnerNodesAndEdges(canvas);
      const cyclePaths = detectCyclesInCanvas(hydratedCanvas);
      if (cyclePaths.length === 0) {
        const dbClient = new DatabaseInterface();
        dbClient
          .CREATE<CanvasType, SimulationResultsType>("simulation", hydratedCanvas)
          .then((simulationResultsFromEngine) => {
            if (simulationResultsFromEngine) {
              console.log(simulationResultsFromEngine);
              setSimulationResults(simulationResultsFromEngine);
            }
          })
          .catch((e) => {
            console.log(e);
            setSimulationResultsOpen(false);
            alert("Found an error in the Simulation, Please Report the issue!");
            window.location.reload();
          });
      } else {
        const mqttClient = new MQTTApi();
        mqttClient.publishMessage(TopicsType.INPUT, {
          canvas: hydratedCanvas,
          cyclePaths,
        } as SimulationWithCyclesMessageType);

        mqttClient.subscribeClient(TopicsType.OUTPUT, () => {
          mqttClient.onMessage(TopicsType.OUTPUT, (message: string) => {
            setSimulationResults(
              safeParse<SimulationResultsType>(SimulationResultsSchema, message)
            );
          });
        });

        mqttClient.subscribeClient(TopicsType.ERRORS, () => {
          mqttClient.onMessage(TopicsType.ERRORS, (message: string) => {
            const parsedErrorMessage = safeParse<SimulationErrorMessageType>(
              SimulationErrorMessageSchema,
              message
            );
            if (simulationResultsOpen) {
              setSimulationResultsOpen(false);
              alert(parsedErrorMessage.message);
              window.location.reload();
            }
          });
        });
      }
    }
  }, [startSimulation]);

  console.log(simulationResults);
  console.log(startSimulation);
  console.log(nodes);
  console.log(edges);

  // ==============================================//
  //                                               //
  //   UPDATE AND LOAD LEFT DRAWER STRUCTURE       //
  //                                               //
  // ==============================================//

  useEffect(() => {
    const folderCardsDictionary: { [k: string]: string } = {
      Models: CardDetail.Model,
      "Data Sets": CardDetail.DataSet,
      Connectors: CardDetail.Connector,
      Systems: CardDetail.System,
    };

    const cardDetailToTypeMap = {
      [CardDetail.Model]: CardType.SystemCard,
      [CardDetail.DataSet]: CardType.SystemCard,
      [CardDetail.Variable]: CardType.VariableCard,
      [CardDetail.Output]: CardType.OutputCard,
      [CardDetail.Sensor]: CardType.SensorCard,
      [CardDetail.System]: CardType.SystemCard,
    };

    const updateDrawerStructure = async () => {
      const updatedDrawerSubFolders = await Promise.all(
        drawerStructure.subFolders.map(async (subFolder) => {
          const itemsFromDb = await readNodesFromDb(
            folderCardsDictionary[subFolder.name]
          );

          if (!itemsFromDb) return subFolder;

          return {
            ...subFolder,
            subFolders: itemsFromDb.map((item) => {
              return {
                name: item.cardName,
                icon: nodeIcons[item.cardDetail as CardDetail],
                folderIndex: 2,
                sideEffect: () => {
                  setNodes((prevNodes) => {
                    return [
                      ...prevNodes,
                      createNode(
                        prevNodes,
                        item.inputParams.map((inputParam) => ({
                          name: inputParam.name,
                          values: inputParam.values ? inputParam.values : [],
                          originalValues: inputParam.values ? inputParam.values : [],
                        })),
                        item.outputParams.map((outputParam) => ({
                          name: outputParam.name,
                          values: outputParam.values ? outputParam.values : [],
                          originalValues: outputParam.values
                            ? outputParam.values
                            : [],
                        })),
                        item.cardName,
                        cardDetailToTypeMap[
                          item.cardDetail as keyof typeof cardDetailToTypeMap
                        ] as keyof typeof nodeTypes,
                        item.cardDetail,
                        { content: item.content, version: item.version }
                      ),
                    ];
                  });
                },
                subFolders: [],
              };
            }),
          };
        })
      );

      setDrawerStructure((currentDrawer) => {
        return { ...currentDrawer, subFolders: updatedDrawerSubFolders };
      });
    };

    updateDrawerStructure();
  }, []);

  // ==========//
  //           //
  //   UTILS   //
  //           //
  // ==========//

  const createSensorNode = (
    sensorName: string,
    prevNodes: Node<NodeDataType, string>[]
  ) => {
    return createNode(
      prevNodes,
      [],
      [
        {
          name: sensorName,
          values: Array.from(
            {
              length: Math.floor(canvas.simulationEnd - canvas.simulationStart),
            },
            (_, index) => canvas.simulationStart + index
          ),
        },
      ],
      sensorName,
      CardType.SensorCard,
      CardDetail.Sensor,
      {
        mode: "range",
        stepSize: 1,
        offset: 0,
        minValue: canvas.simulationStart,
        maxValue: canvas.simulationEnd,
      }
    );
  };

  const createVariableNode = (
    variableName: string,
    prevNodes: Node<NodeDataType, string>[]
  ) => {
    return createNode(
      prevNodes,
      [],
      [
        {
          name: variableName,
          values: Array.from(
            {
              length: Math.floor(canvas.simulationEnd - canvas.simulationStart),
            },
            () => 1
          ),
        },
      ],
      variableName,
      CardType.VariableCard,
      CardDetail.Variable,
      { stepSize: 1, minValue: 0, maxValue: 10 }
    );
  };

  const createOutputNode = (
    outputName: string,
    prevNodes: Node<NodeDataType, string>[]
  ) => {
    return createNode(
      prevNodes,
      [
        {
          name: outputName,
          values: [],
        },
      ],
      [],
      outputName,
      CardType.OutputCard,
      CardDetail.Output
    );
  };

  useKeyboardShortcuts(
    [
      {
        shortcut: ["Control", "Shift", "Z"],
        callback: () => handleAddCard(CardType.SensorCard, CardDetail.Sensor),
      },
      {
        shortcut: ["Control", "Shift", "V"],
        callback: () => handleAddCard(CardType.VariableCard, CardDetail.Variable),
      },
      {
        shortcut: ["Control", "Shift", "O"],
        callback: () => handleAddCard(CardType.OutputCard, CardDetail.Output),
      },
      {
        shortcut: ["Control", "Shift", "C"],
        callback: () => {
          setCreateSystemModalOpen(true);
        },
      },
    ],
    [nodes]
  );

  // ==================//
  //                   //
  //   EVENT HANDLERS  //
  //                   //
  // ==================//

  const handleCreateCanvas = (canvas: CanvasType, selectedNodeIDs: string[]) => {
    const inputParams = selectedNodeIDs
      .map((selectedNodeID) => {
        const selectedNode = canvas.nodes.filter(
          (node) => node.id === selectedNodeID
        )[0];
        return selectedNode.data.outputParams.map((outputParams) => {
          return {
            name: outputParams.name,
            values: [],
            userSelectedInput: true,
          };
        });
      })
      .flat();

    const outputParams = canvas.nodes
      .filter((node) => node.data.cardDetail === CardDetail.Output)
      .map((outputNode) => {
        return outputNode.data.inputParams.map((inputParams) => {
          return {
            name: inputParams.name,
            values: [],
          };
        });
      })
      .flat();

    // Create the canvas as a model.
    const canvasIORepresentation = createNode(
      nodes as any,
      inputParams,
      outputParams,
      canvas.name,
      CardType.SystemCard,
      CardDetail.System,
      { content: JSON.stringify(canvas), version: canvas.version }
    );

    const db = new DatabaseInterface();
    db.CREATE("files", {
      resourceName: `${canvas.name}.json`,
      resourceContent: JSON.stringify(canvas),
      resourcePath: "Canvas",
    })
      .then(() => {
        alert("Canvas Saved Successfully!");

        // Create the canvas as a system in the database.
        createNodeInDb(canvasIORepresentation.data)
          .then(() => {
            // Reset the canvas.
            setCanvas(defaultCanvas);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
        alert("Error Saving Canvas!");
      });
  };

  // Open the right create card modal dictated by the card details passed.
  const handleAddCard = useCallback((cardType: CardType, cardDetail: CardDetail) => {
    // Update the card selected to be created
    setCardSelectedToCreated({ cardType, cardDetail });

    // if the card is a model of a dataset, open the create card modal
    if (cardDetail === CardDetail.Model || cardDetail === CardDetail.DataSet) {
      setCreateCardModalOpen(true);

      // Otherwise, create the card and add it to the canvas
    } else if (cardDetail === CardDetail.Sensor) {
      setNodes((prevNodes) => [
        ...prevNodes,
        createSensorNode(`Sensor ${prevNodes.length + 1}`, prevNodes),
      ]);
    } else if (cardDetail === CardDetail.Variable) {
      setNodes((prevNodes) => [
        ...prevNodes,
        createVariableNode(`Variable ${prevNodes.length + 1}`, prevNodes),
      ]);
    } else if (cardDetail === CardDetail.Output) {
      setNodes((prevNodes) => [
        ...prevNodes,
        createOutputNode(`Output ${prevNodes.length + 1}`, prevNodes),
      ]);
    }
  }, []);

  // Handle the submit event of creating cards with I/O such as models and canvas
  const handleCreateCardModalSubmit = (
    card: NodeDataType,
    cardDetail?: CardDetail
  ) => {
    setCreateCardModalOpen(false);

    if (cardDetail) {
      setCardSelectedToCreated({
        cardDetail,
        cardType: CardType.SystemCard,
        inputParams: card.inputParams,
        outputParams: card.outputParams,
      });
    }

    if (cardSelectedToBeCreated?.cardDetail === CardDetail.DataSet) {
      createNodeInDb(
        createNode(
          nodes,
          [],
          card.outputParams.map((outputParam: NodeParamsType) => ({
            name: outputParam.name,
            values: outputParam.values ? outputParam.values : [],
            originalValues: outputParam.values ? outputParam.values : [],
          })),
          card.cardName,
          cardSelectedToBeCreated?.cardType as keyof typeof nodeTypes,
          cardSelectedToBeCreated?.cardDetail as CardDetail,
          { version: card.version }
        ).data
      );

      setNodes((prevNodes) => [
        ...prevNodes,
        createNode(
          prevNodes,
          [],
          card.outputParams.map((outputParam: NodeParamsType) => ({
            name: outputParam.name,
            values: outputParam.values ? outputParam.values : [],
            originalValues: outputParam.values ? outputParam.values : [],
          })),
          card.cardName,
          cardSelectedToBeCreated?.cardType as keyof typeof nodeTypes,
          cardSelectedToBeCreated?.cardDetail as CardDetail,
          { version: card.version }
        ),
      ]);
    } else if (cardSelectedToBeCreated?.cardDetail === CardDetail.Model) {
      createModelContentAndMetadata(
        createNode(
          nodes,
          card.inputParams.map((inputParam: NodeParamsType) => ({
            name: inputParam.name,
            values: [],
          })),
          card.outputParams.map((outputParam: NodeParamsType) => ({
            name: outputParam.name,
            values: [],
          })),
          card.cardName,
          cardSelectedToBeCreated?.cardType as keyof typeof nodeTypes,
          cardSelectedToBeCreated?.cardDetail as CardDetail,
          { content: card.content, version: card.version }
        )
      );

      setNodes((prevNodes) => [
        ...prevNodes,
        createNode(
          prevNodes as any,
          card.inputParams.map((inputParam: NodeParamsType) => ({
            name: inputParam.name,
            values: [],
          })),
          card.outputParams.map((outputParam: NodeParamsType) => ({
            name: outputParam.name,
            values: [],
          })),
          card.cardName,
          cardSelectedToBeCreated?.cardType as keyof typeof nodeTypes,
          cardSelectedToBeCreated?.cardDetail as CardDetail,
          { content: card.content, version: card.version }
        ),
      ]);
    } else if (cardSelectedToBeCreated?.cardDetail === CardDetail.Connector) {
      createNodeInDb(
        createNode(
          nodes,
          card.inputParams.map((inputParam: NodeParamsType) => ({
            name: inputParam.name,
            values: [],
          })),
          card.outputParams.map((outputParam: NodeParamsType) => ({
            name: outputParam.name,
            values: [],
          })),
          card.cardName,
          cardSelectedToBeCreated?.cardType as keyof typeof nodeTypes,
          cardSelectedToBeCreated?.cardDetail as CardDetail,
          { version: card.version }
        ).data
      );

      setNodes((prevNodes) => [
        ...prevNodes,
        createNode(
          prevNodes,
          card.inputParams.map((inputParam: NodeParamsType) => ({
            name: inputParam.name,
            values: [],
          })),
          card.outputParams.map((outputParam: NodeParamsType) => ({
            name: outputParam.name,
            values: [],
          })),
          card.cardName,
          cardSelectedToBeCreated?.cardType as keyof typeof nodeTypes,
          cardSelectedToBeCreated?.cardDetail as CardDetail,
          { version: card.version }
        ),
      ]);
    }
  };

  const handleEditCardSubmit = (card: NodeType) => {
    setEditCardModalOpen(false);

    // Create the node to the database.
    createNodeInDb(card.data)
      .then(() => {
        // Update the node on the canvas
        setNodes((prevNodes) => {
          return prevNodes.map((node) => {
            if (node.id === card.id) {
              return {
                ...card,
                sourcePosition: node.sourcePosition,
                targetPosition: node.targetPosition,
                data: {
                  ...card.data,
                  version: (card.data?.version || 0) + 1,
                },
              };
            }
            return node;
          });
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleDeleteCardSubmit = async (card: NodeType) => {
    setEditCardModalOpen(false);

    // Delete the node from the database
    deleteNodeInDb(card.data)
      .then(() => {
        // Delete the node from the canvas
        setNodes((prevNodes) => {
          return prevNodes.filter((node) => node.id !== card.id);
        });

        // Delete the edges connected to the node
        setEdges((prevEdges: Edge[]) => {
          return prevEdges.filter(
            (edge) => edge.source !== card.id && edge.target !== card.id
          );
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Setup side effects for connecting nodes
  const handleNodeConnection = useCallback(
    (params: Edge | Connection, nodes: Node<NodeDataType, string>[]) => {
      // Get the source and target nodes
      const sourceNode = nodes.find((node) => node.id === params.source);
      const targetNode = nodes.find((node) => node.id === params.target);

      // If the source and target nodes are not found, then return
      if (!sourceNode || !targetNode) return;

      // If the the target node is an output
      if (targetNode.data.cardDetail === CardDetail.Output) {
        params.targetHandle = `${params.sourceHandle} Output`;
        // Use the outputParams name of the source node
        setNodes((prevNodes) => {
          return prevNodes.map((node) => {
            if (node.id === targetNode.id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  cardName: `${params.sourceHandle} Output`,
                  inputParams: [
                    {
                      ...node.data.inputParams[0],
                      name: `${params.sourceHandle} Output`,
                    },
                  ],
                },
              };
            }
            return node;
          });
        });
      } else {
        // Use the name of the target handle for variables or sensors
        setNodes((prevNodes) => {
          return prevNodes.map((node) => {
            if (node.id !== sourceNode.id) return node;

            if (
              node.data.cardDetail === CardDetail.Sensor ||
              node.data.cardDetail === CardDetail.Variable
            ) {
              params.sourceHandle = `${params.targetHandle} ${sourceNode.data.cardDetail}`;
              return {
                ...node,
                data: {
                  ...node.data,
                  cardName: `${params.targetHandle} ${sourceNode.data.cardDetail}`,
                  outputParams: [
                    {
                      ...node.data.outputParams[0],
                      name: `${params.targetHandle} ${sourceNode.data.cardDetail}`,
                    },
                  ],
                },
              };
            } else {
              return node;
            }
          });
        });
      }

      // Add the edge to the canvas
      setEdges((prevEdges) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            animated: true,
            style: { stroke: "black", strokeWidth: 3 },
          },
          prevEdges
        )
      );
    },
    [setEdges]
  );

  // =======================================================//
  //                                                        //
  //   RENDERING OF THE CANVAS                              //
  //                                                        //
  // =======================================================//

  return (
    <CanvasValidator>
      <div className="w-full h-[93vh] overflow-hidden relative">
        {/* Main React Flow Canvas Configuration */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onPaneClick={(event: any) => {
            if (event.detail === 2) {
              setSelectCardModalOpen(true);
            } else {
              setSelectCardModalOpen(false);
              setEditCardModalOpen(false);
            }
          }}
          onNodeDoubleClick={(_: any, node: any) => {
            setCardSelectedToBeEdited(node);
            setEditCardModalOpen(true);
          }}
          onEdgesChange={onEdgesChange}
          onConnect={(eds) => handleNodeConnection(eds, nodes)}
          style={canvasStyles}
          connectionLineStyle={connectionLineStyle}
          defaultViewport={defaultViewport}
          deleteKeyCode={"Backspace"}
          nodeTypes={nodeTypes}
          zoomOnDoubleClick={false}
          fitView
          proOptions={{ hideAttribution: true }}
        >
          <Background />
          <Controls />
        </ReactFlow>
        {/* // The create system modal is set open via the Cntrl + Shift + C shortcut */}
        <CreateSketchModal
          open={createSystemModalOpen}
          onClose={() => setCreateSystemModalOpen(false)}
          onSubmit={(sketch) => {
            setCreateSystemModalOpen(false);
            handleCreateCardModalSubmit(sketch, sketch.cardDetail as CardDetail);
          }}
        />
        {/* // The create connector modal is set open from the select card modal */}
        <CreateConnectorModal
          open={createConnectorModalOpen}
          onSubmit={handleCreateCardModalSubmit}
          onClose={() => setCreateConnectorModalOpen(false)}
        />
        {/* // The edit card modal is set to open when you doubleClick the card. */}
        <EditCardModal
          cardSelectedToBeEdited={cardSelectedToBeEdited}
          onEditButtonClicked={handleEditCardSubmit}
          onDeleteButtonClicked={handleDeleteCardSubmit}
          open={editCardModalOpen}
          onClose={() => setEditCardModalOpen(false)}
        />
        {/* The edit canvas modal is set to open when you click the Edit Canvas button. */}
        <EditCanvasModal
          onSubmit={setCanvas}
          currentCanvas={canvas}
          open={editCanvasModalOpen}
          onClose={() => setEditCanvasModalOpen(false)}
        />
        {/* /The select card modal is set to open when you doubleClick the canvas. */}
        <SelectCardModal
          cardCategories={cardCategories}
          open={selectCardModalOpen}
          onClose={() => setSelectCardModalOpen(false)}
        />
        {/* // The Create card modal is set open when you click on the select card modal option's + icon */}
        <CreateCanvasModal
          onSubmit={handleCreateCanvas}
          open={createCanvasModalOpen}
          onClose={() => setCreateCanvasModalOpen(false)}
          currentCanvas={canvas}
        />
        {/* // The Create card modal is set open when you click on the select card modal option's + icon */}
        <CreateCardModal
          onSubmit={handleCreateCardModalSubmit}
          open={createCardModalOpen}
          onClose={() => setCreateCardModalOpen(false)}
          cardDetail={cardSelectedToBeCreated?.cardDetail as CardDetail}
        />
        {/* // Simulation Results are displayed when you click simulate button and toggled from the dropdown */}
        <SimulationResults
          open={simulationResultsOpen}
          simulationResults={simulationResults}
          onClose={() => setSimulationResultsOpen(false)}
        />
        {/* This is open when the user clicks on the icon of the page */}
        <LeftDrawer folder={drawerStructure} />;
        {/* // Container for the first custom button at the top with an absolute positioning. */}
        <div className="absolute top-[25px] left-[30px]">
          <CustomButton
            primary={false}
            activeOptions={[
              {
                name: "Save Canvas",
                sideEffect: () => setCreateCanvasModalOpen(true),
              },
              {
                name: "Edit Canvas",
                sideEffect: () => setEditCanvasModalOpen(true),
              },
            ]}
          />
        </div>
        {/* Container for the second custom button at the top with an absolute positioning. */}
        <div className="absolute top-[25px] left-[210px]">
          <CustomButton
            primary={false}
            activeOptions={[
              {
                name: "Clear All",
                sideEffect: () => {
                  localStorage.clear();
                  window.location.reload();
                },
              },
            ]}
          />
        </div>
        {/* Container for the second custom button at the top with an absolute positioning. */}
        <div className="absolute top-[25px] left-[390px]">
          <CustomButton
            primary={true} // from here you can also deploy the canvas
            state={CustomButtonState.SIMULATE}
            activeOptions={[
              {
                name: "Simulate",
                sideEffect: () => {
                  setStartSimulation(true);
                  setSimulationResultsOpen(true);
                },
              },
              {
                name: "Pause",
                sideEffect: () => {
                  setStartSimulation(true);
                  setSimulationResultsOpen(true);
                },
              },
            ]}
          />
        </div>
      </div>
    </CanvasValidator>
  );
}
