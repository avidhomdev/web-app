"use client";

import { Button, Card, theme } from "flowbite-react";
import { ReactSortable } from "react-sortablejs";
import { twMerge } from "tailwind-merge";

const lists = [
  {
    name: "To Do",
    tasks: [
      {
        id: 1,
        name: "Installation",
      },
      {
        id: 2,
        name: "Take Pictures",
      },
      {
        id: 3,
        name: "Send invoice",
      },
    ],
  },
  {
    name: "In Progress",
    tasks: [
      {
        id: 11,
        name: "Ordering Supplies",
      },
    ],
  },
  {
    name: "Complete",
    tasks: [
      {
        id: 31,
        name: "Send contract",
      },
    ],
  },
  {
    name: "Archived",
    tasks: [],
  },
];

export default function Page() {
  return (
    <div className="h-full overflow-x-scroll">
      <div className="flex h-full gap-4 md:gap-6">
        {lists.map((list) => (
          <div
            key={list.name}
            className="flex w-full min-w-64 flex-col gap-4 rounded-xl border-2 border-dashed border-gray-200 p-4 dark:border-gray-600 md:gap-6 md:p-6"
          >
            <hgroup>
              <h2 className="text-lg font-medium">{list.name}</h2>
              <p className="text-sm font-light">{`${list.tasks.length} tasks`}</p>
            </hgroup>
            <hr />
            <div className="w-full [&>div]:space-y-4">
              <ReactSortable
                animation={100}
                forceFallback
                group="kanban"
                list={list.tasks}
                setList={() => {}}
              >
                {list.tasks.map((task) => (
                  <Card
                    key={task.id}
                    theme={{
                      root: {
                        base: twMerge(
                          theme.card.root.base,
                          "shadow-none cursor-move hover:bg-gray-50 dark:hover:bg-gray-700",
                        ),
                        children: twMerge(theme.card.root.children, "p-4"),
                      },
                    }}
                  >
                    {task.name}
                  </Card>
                ))}
              </ReactSortable>
              <br />
              <Button color="light" size="sm">
                Add task
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
