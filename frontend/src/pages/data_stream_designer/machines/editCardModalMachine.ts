import { setup, fromPromise, and } from "xstate";

export const editCardModalMachine = setup({
  types: {
    context: {} as { currentCard: {} },
    events: {} as
      | { type: "RETRY" }
      | { type: "BACK" }
      | { type: "RESET" }
      | { type: "UPDATE_FORM_INFO" }
      | { type: "UPDATE" }
      | { type: "DELETE" },
  },
  actions: {
    updateFormInfo: function ({ context, event }, params) {
      // Add your action code here
      // ...
    },
  },
  actors: {
    updateCardsInDB: fromPromise(async ({ currentCard, event }) => {
      if (event.type === "DELETE") {
        return await deleteResource(currentCard.cardName, currentCard.cardDetail);
      }

      return await createResource(
        currentCard.cardName,
        currentCard,
        currentCard.cardDetail
      );
    }),
  },
  guards: {
    isCardValid: and([
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
    currentCard: {},
  },
  id: "editCardModal",
  initial: "emptyForm",
  on: {
    RESET: {
      target: "#editCardModal.emptyForm",
    },
    DELETE: {
      target: "#editCardModal.loading",
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
        UPDATE: {
          target: "loading",
          guard: {
            type: "isCardValid",
          },
        },
      },
    },
    loading: {
      invoke: {
        id: "updateCanvas",
        input: {
          currentCard: "object",
        },
        onDone: {
          target: "closeForm",
        },
        onError: {
          target: "failed",
        },
        src: "updateCardsInDB",
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
