"use client";

import AreaChart from "@/components/area-chart";
import { Button, ButtonGroup, Card } from "flowbite-react";
import { useState } from "react";

const TIME_PERIODS = ["1W", "1M", "3M", "6M", "12M"];

export default function CommissionsCard() {
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("1W");
  return (
    <Card>
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="text-xl font-semibold">Commissions</h3>
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

      <AreaChart
        series={[
          {
            type: "area",
            xKey: "month",
            yKey: "subscriptions",
            yName: "Subscriptions",
            fillOpacity: 0.2,
            strokeOpacity: 1,
            strokeWidth: 4,
            stroke: "#9eb041",
            fill: "#9eb041",
          },
        ]}
        data={[
          { month: "Jan", subscriptions: 222, services: 250, products: 200 },
          { month: "Feb", subscriptions: 240, services: 255, products: 210 },
          { month: "Mar", subscriptions: 280, services: 245, products: 195 },
          { month: "Apr", subscriptions: 300, services: 260, products: 205 },
          { month: "May", subscriptions: 350, services: 235, products: 215 },
          { month: "Jun", subscriptions: 420, services: 270, products: 200 },
          { month: "Jul", subscriptions: 300, services: 255, products: 225 },
          { month: "Aug", subscriptions: 270, services: 305, products: 210 },
          { month: "Sep", subscriptions: 260, services: 280, products: 250 },
          { month: "Oct", subscriptions: 385, services: 250, products: 205 },
          { month: "Nov", subscriptions: 320, services: 265, products: 215 },
          { month: "Dec", subscriptions: 330, services: 255, products: 220 },
        ]}
      />
    </Card>
  );
}
