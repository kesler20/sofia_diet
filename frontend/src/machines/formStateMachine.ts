import { createMachine } from "xstate";

export const formStateMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDMD2AnAtgOjJgDgC4CeAYhpgMQCqACgCICCAKgKID6pASgPICy7AJIA5Ujy58WgnsIDaABgC6iUPlSwAloQ2oAdipAAPRABYATCewAOeWflWA7AEZbTswE4ANCGKIAzGZO2E4AbGEBAKxOJu4OEREhAL6J3mhY2MgaADZZkORYlBB6YNgaugBuqADWJWk4mTl5FAhllQDGAIbaegqKvQZqmt36SEaI7mYR2O4RViZOEe5WEQ6TXj6Idpbz4RFmc8tLSSkgdRnZuRD5VGDo6BjY+FldZ68XTVgtFaidw739o0GWh0I1AxgQUXcwTCIQcDhC8hCjhMIW8vgQViCoV2jisFhRZmSqQoGQ62UglC4rGYXAAmgDVOpgXoDOCnPDsH4uX4nE48SZVvsTGjNvJ5NgdiEuS4rH4EQEiacScgyZdKAAhRgAYQA0gyQEDhqzEOyQpzubz+YK5iKEH4TH5sKt3E4-LL3OZolZkiddKgIHADHUBkyjaNwQBaVEbBBRxVnPBEMgUENDEHGhD7KzYeQuPxLdn7GbCmP2yxmDyu92ekzek5vRpXFOA0Pp8OIZziqzLEwohwogW2vni+zSwJmZ3ueQReMktpZdRga6p5mgsYIXlOKG56dy+Rcsyw212MzQsKBB3yByY2fpFXkiArsNg0xmW3d7ARHZckzT6eH9wfUSIA */
  id : "form",

  states: {
    emptyForm: {
      on: {
        UPDATE_FROM_INFORMATION: {
          target: "filledForm",
          actions: "updateFormInfo"
        }
      }
    },

    filledForm: {
      invoke: {
        src: "runSideEffect",
        onDone: "closeForm",
        onError: {
          target: "failed",
          reenter: true
        }
      }
    },

    closeForm: {
      type: "final"
    },

    failed: {
      on: {
        RETRY: "filledForm",
        BACK: "emptyForm"
      }
    }
  },

  initial: "emptyForm"
})