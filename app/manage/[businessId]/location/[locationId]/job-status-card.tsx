"use client";

import BarChart from "@/components/bar-chart";
import { Button, ButtonGroup, Card } from "flowbite-react";
import { useState } from "react";

const TIME_PERIODS = ["1W", "1M", "3M", "6M", "12M"];

export default function JobStatusCard() {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("1W");
  return (
    <Card>
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="text-xl font-semibold">Job Status</h3>
        <ButtonGroup>
          {TIME_PERIODS.map((timePeriod) => (
            <Button
              key={timePeriod}
              size="sm"
              color={timePeriod === selectedTimePeriod ? "primary" : "gray"}
              onClick={() => setSelectedTimePeriod(timePeriod)}
            >
              {timePeriod}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      <BarChart
        series={[
          {
            type: "bar",
            xKey: "month",
            yKey: "subscriptions",
            yName: "Leads",
            fill: "#f87171",
          },
          {
            type: "bar",
            xKey: "month",
            yKey: "services",
            yName: "Complete",
            fill: "#34d399",
          },
          {
            type: "bar",
            xKey: "month",
            yKey: "products",
            yName: "Quit",
            fill: "#a78bfa",
          },
        ]}
        data={[
          { month: "Jan", subscriptions: 222, services: 250, products: 200 },
          { month: "Feb", subscriptions: 240, services: 255, products: 210 },
          { month: "Mar", subscriptions: 280, services: 245, products: 195 },
          { month: "Apr", subscriptions: 300, services: 260, products: 205 },
          { month: "May", subscriptions: 350, services: 235, products: 215 },
          { month: "Jun", subscriptions: 420, services: 270, products: 200 },
        ]}
      />
    </Card>
  );
}
