import React, { ReactNode } from "react";
import { useStateContext } from "../../../contexts/ReactFlowContextProvider";
import { CardDetail } from "../DataStreamDesignerPage";
import { getColumnWithFewestRows } from "@lib/utils";

export default function CanvasValidator(props: { children: ReactNode }) {
  const { nodes, edges, setNodes, canvas, setCanvas } = useStateContext();

  React.useEffect(() => {
    // Save the canvas to local storage
    setCanvas({
      ...canvas,
      nodes: nodes as any,
      edges: edges as any,
    });
  }, [nodes, edges]);

  React.useEffect(() => {
    // Reduce the size of the simulation window to the size of the shortest column in the dataset
    nodes.forEach((node) => {
      // Every time you load in a data set adjust the size of the simulation window.
      if (node.data.cardDetail === CardDetail.DataSet) {
        let dataSet: { [key: string]: number[] } = {};
        node.data.outputParams.forEach((outputParam) => {
          dataSet[outputParam.name] = outputParam.values;
        });
        // Adjust the size of the simulation window
        const shortestColumnInDataSet = getColumnWithFewestRows(dataSet);
        const numberOfRowsInShortestColOfDataSet =
          dataSet[shortestColumnInDataSet].length;
        if (
          numberOfRowsInShortestColOfDataSet >
          Math.round(canvas.simulationEnd - canvas.simulationStart)
        ) {
          setCanvas((prevCanvas) => {
            return {
              ...prevCanvas,
              simulationEnd:
                canvas.simulationStart + numberOfRowsInShortestColOfDataSet,
            };
          });
        }
      }
    });

    // Ensure that the outputParams of the nodes are the same length as the simulation window
    setNodes((prevNodes) => {
      return prevNodes.map((prevNode) => {
        return {
          ...prevNode,
          data: {
            ...prevNode.data,
            outputParams: prevNode.data.outputParams.map((outputParam) => {
              if (
                outputParam.values.length >
                Math.round(canvas.simulationEnd - canvas.simulationStart)
              ) {
                return {
                  ...outputParam,
                  values: outputParam.values.slice(
                    0,
                    Math.round(
                      (canvas.simulationEnd - canvas.simulationStart) /
                        (prevNode.data.stepSize || 1)
                    )
                  ),
                };
              }
              return outputParam;
            }),
          },
        };
      });
    });
  }, []);
  return <>{props.children}</>;
};
