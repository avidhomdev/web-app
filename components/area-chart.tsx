import { AgAreaSeriesOptions, AgChartOptions } from "ag-charts-community";
import { AgCharts } from "ag-charts-react";

const defaultOptions: AgChartOptions = {
  axes: [
    {
      gridLine: {
        style: [
          {
            stroke: "transparent",
          },
        ],
      },
      label: {
        enabled: false,
      },
      type: "number",
      position: "left",
      title: { enabled: false },
    },
    {
      type: "category",
      position: "bottom",
      label: {
        enabled: false,
      },
    },
  ],
  background: {
    fill: "transparent",
  },
};

export default function AreaChart<T>({
  series,
  data,
}: {
  series: AgAreaSeriesOptions[];
  data: T[];
}) {
  return (
    <AgCharts
      className="bg-white dark:bg-gray-900"
      options={
        {
          ...defaultOptions,
          series,
          data,
        } as AgChartOptions
      }
    />
  );
}
