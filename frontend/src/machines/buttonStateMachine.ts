import { fromPromise, setup } from "xstate";

export const machine = setup({
  types: {
    context: {} as { data: null; message: string; canSubmit: boolean },
    events: {} as
      | { type: "CLICK" }
      | { type: "RESET" }
      | { type: "RETRY" }
      | { type: "UPDATE" },
  },
  actions: {
    updateCanSubmit: function ({ context, event }) {
      if (event.type === "UPDATE") {
        console.log(context);
      }
    },
  },
  actors: {
    sendRequest: fromPromise(async () => {}),
  },
  guards: {
    canSumbit: function ({ context }) {
      if (context) {
        return true;
      } else {
        return false;
      }
    },
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCMCuAXdB7AdgWlnQEN0wBiAJQFEBlKgFQG0AGAXUVAActYBLdXrg4gAHogAsAJgA0IAJ6IAjADZFAOgCcAVnEbxi3QA5lG5QGYA7AF8rstJlwFipNbwgAbcgGEAMgEkvAGkWdiQQbj4BITCxBDNJCzVFQwtdZWVDSXELM2NZBQQVDTVJZl1xZksdSRMzGzsMbHxCEjBXD3IAVQAFABEAQXoqEOEI-kEcYViDROUsjT1FCwWNMvzEEzVmZY0zLSzmRTN9DXqQeyanVrV3LCIIXhwoMghcNseANywAazbYMBwEAoYAAjqg4OgRmExlFJjFEIZLGpshpFKj9kczIotOsEFpEmktIZKuJlKlJIpFGcLo4Wi5bvdHs8wAAnFlYFlqTjuEgAMw5AFs1P9AcCwRCoVweONoqBYsczCVmIjknpxLkieJcVpNKZ8VIzIdFIcNIZqY1ac42qz2SzKAwKABNSXhaWwqaIeKJZKpUwZLI5PLyRBaRWE3alSQLZj7LQ2WwgHBYCBwYQ05pW0ZuiYehB4ZS4vCGdRLQ7MbYWIkWCyGcTmhwZ65uTxZyI5+GFatqHLaYkZY6SKNmXFFbtlPSVStSWr1y50toMh5PVsyuFykNYzQqdLY2spEy4syKlTxdKhtFZZKzy3XWCoADG97g8Gh2dloiUzASan2yoy4gqY0tWDPFlGRP1jQpHRjDmZRr0bFwbQ5Fd3Q7JZEh7IlmH7KQowLEDjR-HZtm0bJNQyeMrCAA */
  context: {
    data: null,
    message: "",
    canSubmit: false,
  },
  id: "button-state",
  initial: "idle",
  on: {
    RESET: {
      target: "#button-state.idle",
    },
  },
  states: {
    idle: {
      on: {
        CLICK: {
          target: "loading",
          guard: {
            type: "canSumbit",
          },
        },
        UPDATE: {
          target: "idle",
          actions: {
            type: "updateCanSubmit",
          },
        },
      },
    },
    loading: {
      invoke: {
        id: "sendRequest",
        input: {},
        onDone: {
          target: "success",
        },
        onError: {
          target: "error",
        },
        src: "sendRequest",
      },
    },
    success: {},
    error: {
      on: {
        RETRY: {
          target: "loading",
        },
      },
    },
  },
});
