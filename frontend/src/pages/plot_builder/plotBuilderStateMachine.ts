import { createMachine, assign, StateMachine, TypegenConstraint } from "xstate";

// Define context
export interface Context {
  fileData: File | null;
}

// Define events
export type Events =
  | { type: "upload file clicked" }
  | { type: "file uploaded successfully"; file: File }
  | { type: "back to modify plot" }
  | { type: "file failed to upload" }
  | { type: "add a file" }
  | { type: "select x axis" }
  | { type: "select y axis" }
  | { type: "select plot type" }
  | { type: "select color" }
  | { type: "select z axis" }
  | { type: "select size" }
  | { type: "select surface plot" };

// Define the states that the machine can be in
export const plotBuilderMachineStates = {
  "No files & No Axis selected": {},
  "Upload a file": {},
  "File & No axis selected": {},
  "One dimensional Plot": {},
  "Bar Chart": {},
  "2D PlotType Selected": {},
  "Violin Plot": {},
  "3D Scatter Plot": {},
  "Coloured Bar Chart": {},
  "Coloured 3D Scatter Plot": {},
  "5D Plot": {},
  "2D Coloured PlotType Selected": {},
  "Contour Plot": {},
  "Surface Plot": {},
  "new state 2": {},
};

export type States = keyof typeof plotBuilderMachineStates;

const plotBuilderStateMachine = createMachine<
  Context,
  Events,
  any,
  any,
  any,
  any,
  any,
  States,
  any,
  any
>({
  /** @xstate-layout N4IgpgJg5mDOIC5QAUA2B7ALgAgEIFcBLVCMAJwDoA5dbAM2LmwDJsbsBBAD0Nm1jCowAY0yQAxPgAOGAIYR6jbMNSFhAa0gBtAAwBdRKCnpYhTIXQA7QyC6IATAE4ArBUcB2RwEYAHM-fuzj7uAMwhADQgAJ4O9joU9u463vbOIe5eAGwALL4AvnmRaFh4RCTk1LQMQnys7Ny8-IIiYhDi8gqyikK6BkggxqbmVjZ2CO7Z7hSZwWlhyTqJ9pExCGHZFOnOOtlh6fZhjiEFRRg4BMSklACqMujy2F3VYOLP2NJypAqw+MLCcLA6PhUKgor0bIMzBZrP0xgcfBQdCEvIlfPYZs5Mo4VogQvYvAkkn4QtlsjptmkTiBiucylcKLdPo9ui8AEayDTYTC0AC26AghDoUWwd0w4P6kOGMNAcJCCKRKIyPnRfixOIQiXiAR0PmVjl1PhJ7ipNNKlwqjPunRZryUdFkjAU3Ped3k4qMJihI1hiFybkcAcDQYDPky6vxIUJOpRznsPi8oSOJrOZvKlAAYko6rRZDw+AIhKIJAWWtguI88+6Bp6paNEF4QjNppi8aHMu5De5w2FNoEddlHJl7KSfDrkyULmmKJmhCw2Dm801C61xCXRNhhbneFXJdC6wgG03Mi245l2531ete9tdmF3AcQknCtSU5P6TOwHP2Fv880i201xwAAvCtt30CEaz3H0D0bBFj0yVszw7dJL0cewKFmHQGw7HxHB2bJx1pc1KAAeUsT8BR5MBLFMKxZFQbAaVXP8cE3StwIlSDvRlet7wRZxcl1TUQh0AJu0cChPATbJ2x2R9kR8QjU3pMiKMIKiaOhejGLOZjlxFFNMCiKQwB3LjpVsXi4woATfGVJIRLE6J61whJvHbIddlCA5nCUt8KlwWQyGwABhAALILMD00tRS5YzTI4j0higniNXxVwh1jZxYyyZxvGcdVsmVCgsjPASdA82NMj8ukAqC0KIrIKLAOUdAMDIMzku4yy0q8DLUlSHLj3y9U7IoXIkKCDwE0NewauIihAuC8LIui9cQJ-TqvQsuF0umAbsvxYa+svJw3FK4IZLJbDqufU1-MoAA1CxVEsHSsDWnBy02xLqy6narP4wT7KRUSu2ctYyUk9zgkyMGSWOO7X1qp6XsIN6mJa77Ky8Poku2-cE2s2yhIcsHwzwtyE2pzEKvSeapxCAARbAAGVhFkTAxGCzGWNa9qttraDGwExFkVJESBw8XZTvQs8zzQuVghCASGfpEK2vQfAyEgPB6pWprPoMkojJMwWUp6uNDURIdO3SZU9nDRYEm2LCRNDFEVbVioNYwbXdaWhrVpajb2Lxv6Cegq3IwquN0nth8Igh+NxsDAI-H8I4xyRicUYoX2tZ1hRmbZjmufId7mr50wgIS8Pd26sYyRVmyhq8LDRORcHVmRVwJpmCrsljbxHG9yh7BZgv-YUGkABV4rZljiz50OwPr8z9z2eV8S8Oyh3JbuHGd4cAwQ6Nba9nOiKnDXLG5bXK6Nn4yHtf5jbFX6G4Bg8+Js4HhPJhDR86FMLYV1HhUkBRnyWH5HAGw90UYQX+vuAAtJkREOhMFYOwZgrw2R1QoIyvLXUuxDSkn8HNK+ykKjsGeLUecnBFyAUgEgyOqVXaInvEcYI+IDihEvCSDCEwAx7ESHKAIY8GSumtM8VhQtUpNgPpLRywQdjhibNqIS+pdRGkkR+L8C5GjMIgHIi2YxYbNiHPqbKeVkRhiAc7UBXgXADhVqkSRqlsCUWorRSw2kaSmMbvWHKCRHwZGcfedI7ZuyRkwj4AcnkirZ1OLnBagcDaYECd-OIo5ET+ExPeMqixD5rBEuNUq6Qh4uF8MeSRE9K7zxMovZcLDOLIKjo+AksdjxFQyO2bKhVtjTHloU3C8S8LGioQ9Cgz02ro0rlkwm-hIwNmypkXw-hcIdgERsTCt59iHEkSXdmnNuYLLaWwnqJJKZykxAhUkZ5hynRWfLRWupQiqymXnKeRc9bLUapki58jLZBH4ngrIGQ8oPmWBDUqwyzwDjWTNBskifm62OWXM5ASgVmNxKOAko57BxDxNsRw2RUiXj6udM8IkciiUHBIr5C1nAs2xfjYFTcEyuCkgEQIcoTpAKpe5M+dLPDtkmSk6+9J6lopnmcRpn5WZLxMTioJaxyT8UwSSXwOwcheCduhPsbsdTrJ8qiqw98eZnEWdBPqA5JLDlWY+QeFKgFHGvG7HCEDfJMqnKzbWr9Pxsojhyo+95JImoPu3NIqFIxbE9eAnYPrJXUMoORAA7vwTAnNPz2BtalOI4aiRw38NGpOqxfASR5eiYcypEgySgXkIAA */
  id: "Plot Builder",
  initial: "No files & No Axis selected",
  context: {
    fileData: null,
  },

  states: {
    "No files & No Axis selected": {
      on: {
        "upload file clicked": "Upload a file",
        "add a file": "File & No axis selected",
      },
    },

    "Upload a file": {
      on: {
        "file uploaded successfully": {
          target: "No files & No Axis selected",
          actions: assign(({ context, event }) => ({
            fileData: context.fileData,
          })),
        },
        "back to modify plot": "No files & No Axis selected",
        "file failed to upload": {
          target: "Upload a file",
        },
      },
    },

    "File & No axis selected": {
      description: `Within this state the plot type will be grayed out as well as the z, color and size axis`,

      on: {
        "select x axis": "One dimensional Plot",
        "select y axis": "Violin Plot",
        "select z axis": "Contour Plot",
      },
    },

    "One dimensional Plot": {
      on: {
        "select y axis": "Bar Chart",
        "select plot type": "new state 2",
      },
    },

    "Bar Chart": {
      on: {
        "select plot type": "2D PlotType Selected",
        "select color": "Coloured Bar Chart",
        "select z axis": "3D Scatter Plot",
      },
    },

    "2D PlotType Selected": {
      description: `This can be all the plot types with 2 dimensions, depending on what specific plot type is selected different options will be grayed out`,
    },

    "Violin Plot": {
      on: {
        "select x axis": [
          {
            target: "Bar Chart",
            guard: "x or y axis are not text",
          },
          {
            target: "Bar Chart",
            guard: "select pie chart",
          },
        ],
      },
    },

    "3D Scatter Plot": {
      on: {
        "select color": "Coloured 3D Scatter Plot",
      },
    },

    "Coloured Bar Chart": {
      description: `Gray out the size`,

      on: {
        "select plot type": "2D Coloured PlotType Selected",
        "select z axis": "Coloured 3D Scatter Plot",
      },
    },

    "Coloured 3D Scatter Plot": {
      on: {
        "select size": "5D Plot",
      },
    },

    "5D Plot": {},

    "2D Coloured PlotType Selected": {
      on: {
        "select z axis": "3D Scatter Plot",
      },
    },

    "Contour Plot": {
      on: {
        "select surface plot": "Surface Plot",
      },
    },

    "Surface Plot": {},
    "new state 2": {},
  },
});

export default plotBuilderStateMachine;
