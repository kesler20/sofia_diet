import { createMachine, assign, fromPromise } from "xstate";
import {
  CanvasType,
  NodeDataType,
  NodeType,
  SimulationResultsSchema,
  SimulationResultsType,
} from "@lib/types";
import { CardDetail, CardType } from "./DataStreamDesignerPage";
import MQTTApi from "@lib/MQTTApi";
import { Connection, Edge } from "reactflow";
import { defaultCanvas } from "../../contexts/ReactFlowContextProvider";
import { setup } from "xstate";
import { editCanvasModalMachine } from "./machines/editCanvasModalMachine";
import { editCardModalMachine } from "./machines/editCardModalMachine";
import { selectCanvasModalMachine } from "./machines/selectCanvasModalMachine";
import { createNodeInDb, detectCyclesInCanvas } from "../../services";
import { createSketchModalMachine } from "./machines/createSketchModalMachine";
import { createConnectorModalMachine } from "./machines/createConnectorModalMachine";
import { saveCanvasModalMachine } from "./machines/saveCanvasModalMachine";

export const machine = setup({
  types: {
    context: {} as {
      simulationResults: {};
      cardSelectedToBeEdited: null;
      cardDetailSelectedToBeCreated: null;
      canvas: CanvasType;
      mqttClient: MQTTApi;
      createCardModalUserInput: string;
    },
    events: {} as
      | { type: "PAUSE" }
      | { type: "RESUME" }
      | { type: "CLICK_AWAY" }
      | { type: "EDIT_CANVAS" }
      | { type: "UPLOAD_FILE" }
      | { type: "SELECT_CANVAS" }
      | { type: "UPDATE_CANVAS" }
      | { type: "STOP_SIMULATION" }
      | { type: "CREATE_CONNECTOR" }
      | { type: "DOUBLE_CLICK_CARD" }
      | { type: "SELECT_SYSTEM_CARD" }
      | { type: "DOUBLE_CLICK_CANVAS" }
      | { type: "START_SIMULATION_SESSION" }
      | { type: "UPDATE_SIMULATION_RESULTS" }
      | { type: "SAVE_CANVAS_BUTTON_CLICKED" }
      | { type: "SELECT_CANVAS_BUTTON_CLICKED" }
      | { type: "CREATE_SKETCH_SHORTCUT_CLICKED" },
  },
  actions: {
    stopSimulation: assign({
      mqttClient: ({ context }) =>
        context.mqttClient.unsubscribeClient("simulation/output"),
    }),
    updateCardToCreate: assign({
      cardDetailSelectedToBeCreated: ({ context, event }) => {
        if (event.type === "SELECT_SYSTEM_CARD") {
          return event.value;
        }
        return context.cardDetailSelectedToBeCreated;
      },
    }),
    updateCreateCardModalUserInput: assign({
      createCardModalUserInput: ({ context, event }) => {
        if (event.type === "UPLOAD_FILE") {
          return event.value;
        }
        return context.createCardModalUserInput;
      },
    }),
    updateCardSelectedToBeEdited: assign({
      cardSelectedToBeEdited: ({ context, event }) => {
        if (event.type === "DOUBLE_CLICK_CARD") {
          return event.value;
        }
        return context.cardSelectedToBeEdited;
      },
    }),
    startSimulationSession: assign(({ context }) => {
      const { mqttClient, canvas } = context;
      mqttClient.publishMessage("simulation/input", canvas);
      mqttClient.publishMessage("simulation/input", canvas);
      mqttClient.subscribeClient("simulation/output", () => {
        mqttClient.onMessage("simulation/output", (message: string) => {
          return {
            ...context,
            simulationResults: SimulationResultsSchema.parse(message),
          };
        });
      });
      return { ...context };
    }),
    sendCanvasToMXE: assign(({ context, event }) => {
      if (event.type === "UPDATE_SIMULATION_RESULTS") {
        const { mqttClient } = context;
        const canvas = event.value;
        mqttClient.publishMessage("simulation/input", canvas);
        mqttClient.publishMessage("simulation/input", canvas);
        mqttClient.publishMessage("simulation/input", canvas);
      }
      return { ...context };
    }),
    // updateCanvasSelected: function ({ context, event }, params) {
    //   // Add your action code here
    //   // ...
    // },
  },
  actors: {
    selectCanvasModal: selectCanvasModalMachine,
    editCardModal: editCardModalMachine,
    createNode: fromPromise(async ({ input }) => {
      return await createNodeInDb(input.cardDetailSelectedToBeCreated);
    }),
    editCanvasModal: editCanvasModalMachine,
    createConnectorModal: createConnectorModalMachine,
    createSketchModal: createSketchModalMachine,
    saveCanvasModal: saveCanvasModalMachine,
  },
  guards: {
    isCanvasValid: function ({ context, event }) {
      if (event.type === "UPDATE") {
        return (
          context.canvas.nodes.length === 0 ||
          context.canvas.nodes.filter((node) => node.type === CardType.OutputCard)
            .length === 0 ||
          context.canvas.edges.forEach((edge) => {
            const outputCardIsATargetNode =
              context.canvas.nodes.find((node) => node.id === edge.target)?.type ===
              CardType.OutputCard;
            if (outputCardIsATargetNode) {
              return true;
            }
          })
        );
      } else {
        return false;
      }
    },
  },
  canvasIsEmpty: function ({ context }) {
    return context.canvas.nodes.length === 0;
  },
  simulationHasCycles: function ({ context, event }) {
    if (event.type === "UPDATE") {
      return detectCyclesInCanvas(context.canvas);
    } else {
      return false;
    }
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QQIYBcUGU0CcwoFsARMAS1gDsYcBZFAYwAtSKwA6WMAGzHrQGEUFAG4pYNAPaouAeQAOYCgGJMAUQAyq-gBUA+vwCCAOQBqBzAG0ADAF1EoORNik0pCRXsgAHogCMAFgAOXzYAJgBOXwB2aNCAZnD-ON8AGhAAT0QAViiotgA2X3z8rKtwuKz-LISAXxq01AxsPEISciowWgZmVjZ6IVFYAHUXRgkAVzRJaVglIhkAVQAhTX11AEl+AGl9AwAlIms7JBBHZ1d3Tx8EANDQtn8imNCs+Je4-LTMhCCQ8Mj8v5-PFilFwlE6g10FhcPhiGRKNQ6EwWOx+iIxCM0GNJtMUFxZvNlqt+BttrtTOYjp4zi43B4TtdXl9EODwmFQlZAgksllAsEqpCQI0YS14e0kd1UX0BpjRhMplJ8bNMNp9npMOsaAt1AZtOsZEZdGpMJrDdSTrSLgzQNc7nF7jF+b4solwoF8nEWQg4sECoEoq8HaFAlVwryhSLmnC2ojOsiemjZcN5bilQSlKoiOs9IZKZZbDSnHTLozEHdgWwncFXf53Z7vYUrA8+XEokDuXErL5fJHodHWgiOl0Ub10YMsTjFTMVBotLnjGZMLolgttNpDWtNlssxaHMXrVc-L8wpEYlF4olko2onEwo8SlFPcCQ736sL+7DBxL41Kx8nJwVPEM34PZVD1VR9ENIx5xkPY91OA96SPG52zyQE+XKKx8gvUJcm9XJAgeLk4g+TlEjwrI+yaL9xTjEdExlDEU2xID01mUDwO0SDMB3bR+AACWNAS4P4tct22XdC0tJDS1tctQl8R1fGdWt6y9DI-GSApihwx5XRiOt-Go0UYyHSVRyTZjALTGdMAMExILzJcVzXDcjVJbcpOOfdzmQssfSfNgAXyYJkn+cJsI075fFItgsl8RJfCsUign8J84hMgc6OHBNpUgFxBBwCBgPkRQlE88kDCGAwAE0EKtfz5JuF8HieJSg3eT5NJ+bS6yKR4XVCQFuyy2jY1yv92E4Hg+CKkr0zK5RKp2aq6oa2SbW8PwlPZRKwUeFKnx7VIeuSZt2yKBIm3yTljPfKNxvM39LI4bheAEFBitKhQKDe2bXCoWdNB0Y1atVVQaF2A4Nr8uTtoQcFvSMtgPmKHJYodC9QzGsUJosxiZo++afsUf6PpYKAKrAiCoKMGCdDg2GSy264ewiNh9qSo7Ch7AiSjYKx0vtHsKnyMpcbMn8GOlIm5q+hbpCWvoWjQMAScW36KrJVaavq6TfJZlCwRCXTQqyXT+RS71ghCSpcPF3IgUyh7Pzx56Zd6OXPu+zWyfoVX1YV0m-rAAg5DQdIADEJBwAglAWAAFdQZAMIhdCj9ZNGZw8Arwu8TdCnsuQSp8COqVGqm5IErE5cW3yhGj3elvKvfe+XfaV36VfwNWNa7smADNSC4HgIBjuOlAgdx2BYYQJAAa3YR7m-o1vpvbn3FfxZWA97oPO537vh9HyAJ4IBA54kfprSOHOmoRk2dOKQILZfwJrZ6p9-EF4W3lIp0oRJbfjXlNcmHdt6yG7nvdAB9IHKxPmPc+ShOg4FjmwOQXB0CD1jgQNgK8pagNet7fuR9-aB1IVAoeI8kG4MviIa+6B6R3wNohOGrNEBtnuG2UosRXgGVDARKwWQ2ChlbC6VsFQgGuyboQyaxDSAEHGFg60ew4DKLQLAJaKgNyJ2NFqHUeoDRGHvvDO0dxlKqTdB6aK5YPSC1uglEoERzYVGATlAmstFHKKYe4NRsANFaO7s4JRKj6TrFgHscYFAKCUwTonIgtNnJUlYY1Mxdj+TxVvN2fI4JsJ8mRsUB4XY+StldOEEo7j8YvUJt4sJfj1FcE0crEJPjrQRKiTEuJicDALDUKYjhCAQyZJyF2IoeSSiBG9A6ZsJScji2qCpfOVSPbrw4HU3xFB-GBN3smfgjAhAwAgPExJ3F9Hal1PqTcYFMA6m0AWHybCjZ535ERUZOSJkFLOlEZsH9eQmy4faFZLcwGtPqVsxpzTgkbPabAROKBxicGOTchYNBVADJQl2cWp5oglH8DhX0WRvTDXZH8nILjIhJGkY3UyID5GMQKp9ZiIdtbbl0GtfWjy0mDIrJYms1iGw9V5OycM3IYgJHCMNF0wKiGMRgX3dwrA+CxxZStdlesMUBWiOlAoVcsI4TuPhL+eFgokVIh1X0YIZX0ulPKsAmAl5oCYKqnW6r1qpM2ihO4tcqwqX5XWGxNsQhFFBMlQMOFqgQhkbSjxNTZYoGEEHZlftlquo5Zq5qbZ8jBRDWFRK-worehUj-bsSU4iPFeReOo74KBSDgJ4AhdLPGsCLOwlCABaJS3p235Gtc2jeANBDJoHltblKF2Z7TZIdLNJ1Gxtl-hebCYI8LBF7dG7K1TPZWQnKmacypW3POaolP01YJFci5Nyb0roRH5KcZeKw3ZqUflkU2uNvRGWUKWge3OR7dqcynclGdfMer4qIhUCp4ZOTDQfYKddT0QXEM3p+3636H7XA+MjKweR831mEYGcE6U+1voHcTYOKbwGAygKh9JiNbwPFCsdRSOQoj8n5iI+2ItYoWwlnB1eNq26DrIyOnusDkOKGo4MwRPVChERwgCIWgRhrlKI1uijYm-p2vU2wMOEdo64Ik+Oh0-MwMvAfSCTkAZ7o0o3as0FSGhNkI0xQhzVC-qILPvpmSbaAq8nuKGLNQJ0qFHdARBIvrfSvw+GCYIKm1lgs2dsppQTxNecPQjKVP8q5JESO2CzUQi2KYKL6SKKlyj4pY1RXjcj+3rNCQlyFyW-rxdhZ02JVADN52KPcLLCR0rAi5Plnqr5Ua8lGYEK8vIG7PpjZuuLML6SJahf7PZByOgQA65mlSIjCj4sg2-QMmG-gJUeOlSIkrwyVes-B2VXi6uqIay0+b7gInwsRZADbCNkivwKAEXJ-DQREqGyx1G-JIpF0BNyKbjbY2qY-cmEOH27T+C5GEPNiVSiKdOt8Xk2asJ8nG5yFKrpYtgM04qj6KqU2I60hXPCXJnwsfStEAilZFIReqHJmLVXX2qbtQ6sATrGAI9Sz+9LFs7xslCEEHIYOPTenDA8XC8QvvDU7CT4hCak2DGF4bUX1xgRFqqKjKXFSXhO2R9yatNQgA */
  context: {
    simulationResults: {},
    cardSelectedToBeEdited: null,
    cardDetailSelectedToBeCreated: null,
    canvas: defaultCanvas,
    mqttClient: new MQTTApi(),
    createCardModalUserInput: "",
  },
  id: "dataStreamDeisngerMachine",
  initial: "selectCanvasModalOpen",
  states: {
    selectCanvasModalOpen: {
      on: {
        SELECT_CANVAS: {
          target: "canvasWithoutModals",
          actions: {
            type: "updateCanvasSelected",
          },
        },
      },
      invoke: {
        id: "selectCanvas",
        input: {},
        src: "selectCanvasModal",
      },
    },
    canvasWithoutModals: {
      on: {
        DOUBLE_CLICK_CARD: {
          target: "editCardModalOpen",
          actions: {
            type: "updateCardSelectedToBeEdited",
          },
        },
        DOUBLE_CLICK_CANVAS: {
          target: "selectCardModalOpen",
        },
        START_SIMULATION_SESSION: {
          target: "simulationResultsOpen",
          actions: {
            type: "startSimulationSession",
          },
          guard: {
            type: "isCanvasValid",
          },
        },
        EDIT_CANVAS: {
          target: "editCanvasModalOpen",
        },
        SELECT_CANVAS_BUTTON_CLICKED: {
          target: "selectCanvasModalOpen",
        },
        CREATE_CONNECTOR: {
          target: "createConnectorModalOpen",
        },
        CREATE_SKETCH_SHORTCUT_CLICKED: {
          target: "createSketchModalOpen",
        },
        SAVE_CANVAS_BUTTON_CLICKED: {
          target: "saveCanvasModalOpen",
        },
      },
    },
    editCardModalOpen: {
      on: {
        CLICK_AWAY: {
          target: "canvasWithoutModals",
        },
      },
      invoke: {
        id: "editCard",
        input: {},
        src: "editCardModal",
      },
    },
    selectCardModalOpen: {
      initial: "selecting",
      on: {
        CLICK_AWAY: {
          target: "canvasWithoutModals",
        },
      },
      states: {
        selecting: {
          on: {
            SELECT_SYSTEM_CARD: {
              target: "createCardModalOpen",
              actions: {
                type: "updateCardToCreate",
              },
            },
            CREATE_CONNECTOR: {
              target: "#dataStreamDeisngerMachine.createConnectorModalOpen",
            },
          },
        },
        createCardModalOpen: {
          initial: "emptyForm",
          on: {
            CLICK_AWAY: {
              target: "selecting",
            },
          },
          states: {
            emptyForm: {
              on: {
                UPLOAD_FILE: {
                  target: "filledForm",
                  actions: {
                    type: "updateCreateCardModalUserInput",
                  },
                },
              },
            },
            filledForm: {
              invoke: {
                id: "dataStreamDeisngerMachine.selectCardModalOpen.createCardModalOpen.filledForm:invocation[0]",
                input: { cardDetailSelectedToBeCreated: "object" },
                onDone: {
                  target: "#dataStreamDeisngerMachine.selectCardModalOpen.selecting",
                },
                onError: {
                  target: "emptyForm",
                },
                src: "createNode",
              },
            },
          },
        },
      },
    },
    simulationResultsOpen: {
      initial: "simulationIsRunning",
      on: {
        STOP_SIMULATION: {
          target: "canvasWithoutModals",
          actions: {
            type: "stopSimulation",
          },
        },
      },
      states: {
        simulationIsRunning: {
          on: {
            UPDATE_CANVAS: {
              target: "canvasChanged",
            },
            PAUSE: {
              target: "simulationIsPaused",
              guard: {
                type: "simulationHasCycles",
              },
            },
          },
        },
        canvasChanged: {
          on: {
            UPDATE_SIMULATION_RESULTS: {
              target: "simulationIsRunning",
              actions: {
                type: "sendCanvasToMXE",
              },
            },
          },
        },
        simulationIsPaused: {
          on: {
            RESUME: {
              target: "simulationIsRunning",
            },
          },
        },
      },
    },
    editCanvasModalOpen: {
      on: {
        CLICK_AWAY: {
          target: "canvasWithoutModals",
        },
      },
      entry: {
        type: "stopSimulation",
      },
      invoke: {
        id: "editCanvas",
        input: {},
        src: "editCanvasModal",
      },
    },
    createConnectorModalOpen: {
      on: {
        CLICK_AWAY: {
          target: "canvasWithoutModals",
        },
      },
      invoke: {
        id: "createConnector",
        input: {},
        src: "createConnectorModal",
      },
    },
    createSketchModalOpen: {
      on: {
        CLICK_AWAY: {
          target: "canvasWithoutModals",
        },
      },
      invoke: {
        id: "createSketch",
        input: {},
        src: "createSketchModal",
      },
    },
    saveCanvasModalOpen: {
      on: {
        CLICK_AWAY: {
          target: "canvasWithoutModals",
        },
      },
      invoke: {
        id: "saveCanvas",
        input: {},
        src: "saveCanvasModal",
      },
    },
  },
});
