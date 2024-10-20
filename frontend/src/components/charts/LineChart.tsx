import { Line } from "react-chartjs-2";
import { ChartData, ChartOptions, Chart } from "chart.js";
import {
  LineElement,
  PointElement,
  LineController,
  LinearScale,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { SimulationOutputResultType } from "@lib/types";

Chart.register(LineElement, PointElement, LineController, LinearScale, TimeScale);

function LineChart(props: {
  dataSet: SimulationOutputResultType;
  maxWindowSize: number;
}) {
  const chartData: ChartData<"line"> = {
    labels: props.dataSet[Object.keys(props.dataSet)[0]]
      .map((row) => new Date(row.timestamp))
      .slice(-props.maxWindowSize),
    datasets: Object.keys(props.dataSet).map((colName) => {
      return {
        label: colName,
        data: props.dataSet[colName]
          .map((row) => row.value)
          .slice(-props.maxWindowSize),
        borderWidth: 2,
        backgroundColor: "rgba(54, 162, 235, 0.3)",
        borderColor: "rgba(54, 162, 235, 1)",
        tension: 0, // This makes the line straight
        pointRadius: 2, // This controls the size of the data points
      };
    }),
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    animation: false,
    scales: {
      y: {
        title: {
          display: true,
          color: "rgb(154,153,145)",
        },
        ticks: {
          color: "rgb(154,153,145)",
          callback: (value) => value,
        },
      },
      x: {
        type: "time",
        time: {
          unit: "second",
        },
        title: {
          display: true,
          text: "Seconds",
          color: "rgb(154,153,145)",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

export default function LineChartPlotComponent(props: {
  dataSet: SimulationOutputResultType;
  maxWindowSize: number;
}) {
  return (
    <div className="w-full m-2 h-[500px] mt-8">
      <LineChart dataSet={props.dataSet} maxWindowSize={props.maxWindowSize} />
    </div>
  );
}
