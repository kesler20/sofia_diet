import { setup, fromPromise, assign, and } from "xstate";
import { createResource } from "../../../services";

export const editCanvasModalMachine = setup({
  types: {
    context: {} as { canvas: {} },
    events: {} as
      | { type: "RETRY" }
      | { type: "BACK" }
      | { type: "SUBMIT" }
      | { type: "RESET" }
      | { type: "UPDATE_FORM_INFO" },
  },
  actions: {
    updateFormInfo: assign(({ context, event }) => {
      if (event.type === "UPDATE_FORM_INFO") {
        return event.value;
      }
      return context.canvas;
    }),
  },
  actors: {
    updateCanvas: fromPromise(async ({ canvas }) => {
      const response = await createResource(canvas.name, canvas, "Canvas");

      return canvas;
    }),
  },
  guards: {
    isFormValid: and([
      ({ context, event }) => {
        // Add a guard condition here
        return true;
      },
      ({ context, event }) => {
        // Add another guard condition here
        return true;
      },
    ]),
  },
}).createMachine({
  context: {
    canvas: "defaultCanvas",
  },
  id: "editCanvasModal",
  initial: "emptyForm",
  on: {
    RESET: {
      target: "#editCanvasModal.emptyForm",
    },
  },
  states: {
    emptyForm: {
      on: {
        UPDATE_FORM_INFO: {
          target: "filledForm",
          actions: {
            type: "updateFormInfo",
            params: {
              name: "string",
            },
          },
        },
      },
    },
    filledForm: {
      on: {
        SUBMIT: {
          target: "loading",
          guard: {
            type: "isFormValid",
          },
        },
      },
    },
    loading: {
      invoke: {
        id: "updateCanvas",
        input: {
          canvas: {},
        },
        onDone: {
          target: "closeForm",
        },
        onError: {
          target: "failed",
        },
        src: "updateCanvas",
      },
    },
    closeForm: {
      type: "final",
    },
    failed: {
      on: {
        RETRY: {
          target: "loading",
        },
        BACK: {
          target: "filledForm",
        },
      },
    },
  },
});
