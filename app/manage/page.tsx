"use client";

import AreaChart from "@/components/area-chart";
import DonutChart from "@/components/donut-chart";
import LineChart from "@/components/line-chart";
import PageHeaderWithActions from "@/components/page-header-with-actions";
import {
  Avatar,
  Button,
  Card,
  Carousel,
  Progress,
  Textarea,
  theme,
  Tooltip,
} from "flowbite-react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ShareIcon,
  StarIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export default function ManagePage() {
  return (
    <>
      <PageHeaderWithActions
        title="Dashboard"
        subtitle="Get a summary of whats going on in the business."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-6 lg:gap-6 xl:gap-8">
        <Card
          className="relative z-10 overflow-hidden lg:col-span-2"
          theme={{
            root: {
              base: twMerge(
                theme.card.root.base,
                "bg-gradient-to-tr from-gray-800 to-gray-900 border-gray-800 dark:border-gray-800 h-72",
              ),
            },
          }}
        >
          <Carousel
            leftControl="&nbsp;"
            rightControl="&nbsp;"
            theme={{
              root: { base: twMerge(theme.carousel.root.base, "z-10") },
              indicators: {
                base: "size-3 rounded-full",
                active: { on: "bg-white", off: "bg-gray-500" },
                wrapper: twMerge(
                  theme.carousel.indicators.wrapper,
                  "bg-gray-700 p-2 rounded-full -bottom-2",
                ),
              },
            }}
          >
            <div className="flex flex-col items-start gap-2">
              <h6 className="text-3xl font-medium tracking-tighter text-gray-300">
                Setter of the month, <br />
                <span className="font-bold text-secondary-400">John Doe</span>
              </h6>
              <p className="font-light text-gray-400">
                The setter of the month is determined by the number of
                appointments set.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2">
              <h6 className="text-3xl font-medium tracking-tighter text-gray-300">
                Installer of the month, <br />
                <span className="font-bold text-emerald-400">John Doe</span>
              </h6>
              <p className="font-light text-gray-400">
                The installer of the month is determined by the number of
                appointments set.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2">
              <h6 className="text-3xl font-medium tracking-tighter text-gray-300">
                Closer of the month, <br />
                <span className="font-bold text-cyan-400">John Doe</span>
              </h6>
              <p className="font-light text-gray-400">
                The closer of the month is determined by the number of
                appointments set.
              </p>
            </div>
          </Carousel>
          <div className="absolute -bottom-4 -right-4 z-0 opacity-10">
            <Image alt="" height={300} src="/images/winners.svg" width={300} />
          </div>
        </Card>
        <Card
          className="lg:col-span-4"
          theme={{
            root: {
              base: twMerge(
                theme.card.root.base,
                "bg-gradient-to-tr from-gray-800 to-gray-900 border-gray-800 dark:border-gray-800",
              ),
            },
          }}
        >
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col items-start gap-4">
              <h6 className="text-3xl font-medium tracking-tighter text-white">
                Welcome back, <br />
                <span className="font-bold text-primary-400">John Doe</span>
              </h6>
              <p className="font-light text-gray-400">
                Best seller of the month you have done 57.6% more sales today.
              </p>
              <Button color="primary" size="sm">
                <ShareIcon className="mr-2 size-4" />
                Share
              </Button>
            </div>
            <div className="grid place-items-center">
              <Image
                alt=""
                height={200}
                src="/images/couple-award.svg"
                width={200}
              />
            </div>
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6 xl:gap-8">
        <Card>
          <div className="grid grid-cols-3 items-center">
            <div className="col-span-2 grid gap-4">
              <h6 className="text-sm font-semibold text-gray-400">Open jobs</h6>
              <p className="text-5xl font-bold tracking-tighter text-gray-600 dark:text-white">
                35
              </p>
              <div className="flex items-center gap-1 text-green-400 dark:text-green-200">
                <TrendingUpIcon />
                <p className="text-sm font-bold">
                  +2.5%{" "}
                  <span className="text-xs font-light text-gray-400">
                    last week
                  </span>
                </p>
              </div>
            </div>
            <Image
              alt=""
              height={200}
              src="/images/construction-tablet.svg"
              width={200}
            />
          </div>
        </Card>
        <Card>
          <div className="grid grid-cols-3 items-center">
            <div className="col-span-2 grid gap-4">
              <h6 className="text-sm font-semibold text-gray-400">
                Closed Jobs
              </h6>
              <p className="text-5xl font-bold tracking-tighter text-gray-600 dark:text-white">
                714k
              </p>
              <div className="flex items-center gap-1 text-red-400 dark:text-red-200">
                <TrendingDownIcon />
                <p className="text-sm font-bold">
                  -1.5%{" "}
                  <span className="text-xs font-light text-gray-400">
                    last week
                  </span>
                </p>
              </div>
            </div>
            <Image
              alt=""
              height={200}
              src="/images/construction-coffee.svg"
              width={200}
            />
          </div>
        </Card>
        <Card>
          <div className="grid grid-cols-3 items-center">
            <div className="col-span-2 grid gap-4">
              <h6 className="text-sm font-semibold text-gray-400">
                Customer Reviews
              </h6>
              <p className="text-5xl font-bold tracking-tighter text-gray-600 dark:text-white">
                7k
              </p>
              <div className="flex items-center gap-1 text-green-400 dark:text-green-200">
                <TrendingUpIcon />
                <p className="text-sm font-bold">
                  +2.5%{" "}
                  <span className="text-xs font-light text-gray-400">
                    last week
                  </span>
                </p>
              </div>
            </div>

            <Image
              alt=""
              height={200}
              src="/images/construction-review.svg"
              width={200}
            />
          </div>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-6 xl:gap-6">
        <div className="xl:col-span-4">
          <Card
            theme={{
              root: {
                base: twMerge(
                  theme.card.root.base,
                  "shadow-none bg-gray-100 border-0 p-2 rounded-xl dark:bg-gray-800",
                ),
                children: twMerge(theme.card.root.children, "p-0 gap-2"),
              },
            }}
          >
            <div className="grid rounded-xl bg-white p-2 dark:bg-gray-900 lg:grid-cols-2">
              <Card
                theme={{
                  root: {
                    base: twMerge(
                      theme.card.root.base,
                      "rounded-2xl bg-emerald-800 bg-gradient-to-br from-emerald-800 to-emerald-500 shadow-none",
                    ),
                  },
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h6 className="text-lg tracking-tighter text-emerald-200">
                      Total Commissions
                    </h6>
                    <p className="font-mono text-3xl font-semibold tracking-tighter text-emerald-200">
                      $18,000
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-green-200">
                    <TrendingUpIcon />
                    <div>
                      <p className="text-sm font-bold">+2.5% </p>
                      <p className="text-xs font-light">last month</p>
                    </div>
                  </div>
                </div>
                <div className="grid h-40">
                  <LineChart
                    series={[
                      {
                        type: "line",
                        yKey: "commission",
                        xKey: "date",
                        stroke: "#a7f3d0",
                        strokeWidth: 4,
                        marker: {
                          enabled: false,
                        },
                        interpolation: { type: "smooth" },
                      },
                    ]}
                    data={[
                      { commission: 1000, date: "2024-02-02" },
                      { commission: 2000, date: "2024-02-03" },
                      { commission: 3000, date: "2024-02-04" },
                      { commission: 1000, date: "2024-02-05" },
                      { commission: 1500, date: "2024-02-06" },
                      { commission: 6230, date: "2024-02-07" },
                      { commission: 4500, date: "2024-02-08" },
                      { commission: 10500, date: "2024-02-09" },
                    ]}
                    style={{ height: "10rem", width: "100%" }}
                  />
                </div>
              </Card>
              <div className="grid items-center gap-4 p-4 lg:gap-6 lg:p-6 xl:gap-8">
                <h6 className="text-lg font-semibold tracking-tighter">Jobs</h6>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold uppercase">Leads</div>
                    <div className="text-sm font-semibold uppercase">
                      100/350
                    </div>
                  </div>
                  <Progress progress={(100 / 350) * 100} color="yellow" />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold uppercase">
                      In Porgress
                    </div>
                    <div className="text-sm font-semibold uppercase">
                      50/350
                    </div>
                  </div>
                  <Progress progress={(50 / 350) * 100} color="cyan" />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold uppercase">
                      Complete
                    </div>
                    <div className="text-sm font-semibold uppercase">
                      150/350
                    </div>
                  </div>
                  <Progress progress={(150 / 350) * 100} color="green" />
                </div>
              </div>
            </div>
            <div className="grid divide-x-0 divide-y-2 divide-gray-100 rounded-xl bg-white dark:divide-gray-700 dark:bg-gray-900 lg:grid-cols-2 lg:divide-x-2 lg:divide-y-0">
              <div className="flex items-center justify-center gap-2 p-4 lg:gap-6 lg:p-6 xl:gap-8">
                <div className="relative size-28">
                  <Tooltip style="auto" content="35% close rate">
                    <svg
                      className="size-full -rotate-90"
                      viewBox="0 0 36 36"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className="stroke-current text-gray-200 dark:text-neutral-700"
                        strokeWidth="2"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className="stroke-current text-lime-600 dark:text-lime-500"
                        strokeWidth="4"
                        strokeDasharray="100"
                        strokeDashoffset="65"
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                      <span className="text-center text-2xl font-bold text-lime-600 dark:text-lime-500">
                        35%
                      </span>
                    </div>
                  </Tooltip>
                </div>
                <div>
                  <p className="font-mono text-3xl font-semibold tracking-tighter">
                    150
                  </p>
                  <h6 className="text-md tracking-tighter text-gray-400">
                    Closed
                  </h6>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 p-4 lg:gap-6 lg:p-6 xl:gap-8">
                <div className="relative size-28">
                  <Tooltip style="auto" content="15% missed">
                    <svg
                      className="size-full -rotate-90"
                      viewBox="0 0 36 36"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className="stroke-current text-gray-200 dark:text-neutral-700"
                        strokeWidth="2"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        className="stroke-current text-rose-600 dark:text-rose-500"
                        strokeWidth="4"
                        strokeDasharray="100"
                        strokeDashoffset="85"
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                      <span className="text-center text-2xl font-bold text-rose-600 dark:text-rose-500">
                        15%
                      </span>
                    </div>
                  </Tooltip>
                </div>
                <div>
                  <p className="font-mono text-3xl font-semibold tracking-tighter">
                    21
                  </p>
                  <h6 className="text-md tracking-tighter text-gray-400">
                    Missed
                  </h6>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="xl:col-span-2">
          <Card>
            <div className="flex items-center justify-between gap-2">
              <h6 className="text-lg font-semibold tracking-tighter">
                Customer reviews
              </h6>
              <div className="flex items-center gap-6">
                <ChevronLeftIcon />
                <ChevronRightIcon />
              </div>
            </div>
            <div className="grid gap-4">
              <Avatar
                rounded
                theme={{
                  root: {
                    base: twMerge(theme.avatar.root.base, "justify-start"),
                  },
                }}
              >
                <div className="font-medium dark:text-white">
                  <div>Jese Leos</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Joined in August 2014
                  </div>
                </div>
              </Avatar>
              <div className="gap flex items-center gap-1">
                <StarIcon className="w-6 fill-yellow-300 stroke-yellow-300" />
                <StarIcon className="w-6 fill-yellow-300 stroke-yellow-300" />
                <StarIcon className="w-6 fill-yellow-300 stroke-yellow-300" />
                <StarIcon className="w-6 fill-yellow-300 stroke-yellow-300" />
                <StarIcon className="w-6 fill-gray-300 stroke-gray-300" />
              </div>
              <p className="text-base">
                After being forced to move twice within five years, our
                customers had a hard time finding us and our sales plummeted.
                The Lorem Ipsum Co. not only revitalized our brand, but saved
                our nearly 100-year-old family business from the brink of ruin
                by optimizing our website for search and creating our Google My
                Business listing.
              </p>

              <Textarea
                id="comment"
                placeholder="Leave a reply..."
                required
                rows={4}
                className="resize-none"
              />
            </div>
          </Card>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        <Card>
          <h6 className="text-lg font-semibold tracking-tighter">
            Setter Leaderboard
          </h6>
          <Avatar.Group>
            <Tooltip
              content="1st Place: John Doe"
              color="auto"
              placement="right"
            >
              <Avatar rounded bordered placeholderInitials="TS" stacked />
            </Tooltip>
            <Tooltip
              content="2nd Place: John Doe"
              color="auto"
              placement="right"
            >
              <Avatar rounded bordered placeholderInitials="TS" stacked />
            </Tooltip>
            <Tooltip
              content="3rd Place: John Doe"
              color="auto"
              placement="right"
            >
              <Avatar rounded bordered placeholderInitials="TS" stacked />
            </Tooltip>
            <Tooltip
              content="4th Place: John Doe"
              color="auto"
              placement="right"
            >
              <Avatar rounded bordered placeholderInitials="TS" stacked />
            </Tooltip>
            <Tooltip
              content="5th Place: John Doe"
              color="auto"
              placement="right"
            >
              <Avatar rounded bordered placeholderInitials="TS" stacked />
            </Tooltip>
          </Avatar.Group>
        </Card>
        <Card>
          <h6 className="text-lg font-semibold tracking-tighter">
            Installer Leaderboard
          </h6>
          <Avatar.Group>
            <Tooltip
              content="1st Place: John Doe"
              color="auto"
              placement="right"
            >
              <Avatar rounded bordered placeholderInitials="TS" stacked />
            </Tooltip>
            <Tooltip
              content="2nd Place: John Doe"
              color="auto"
              placement="right"
            >
              <Avatar rounded bordered placeholderInitials="TS" stacked />
            </Tooltip>
            <Tooltip
              content="3rd Place: John Doe"
              color="auto"
              placement="right"
            >
              <Avatar rounded bordered placeholderInitials="TS" stacked />
            </Tooltip>
            <Tooltip
              content="4th Place: John Doe"
              color="auto"
              placement="right"
            >
              <Avatar rounded bordered placeholderInitials="TS" stacked />
            </Tooltip>
            <Tooltip
              content="5th Place: John Doe"
              color="auto"
              placement="right"
            >
              <Avatar rounded bordered placeholderInitials="TS" stacked />
            </Tooltip>
          </Avatar.Group>
        </Card>
        <Card>
          <h6 className="text-lg font-semibold tracking-tighter">
            Closer Leaderboard
          </h6>
          <Avatar.Group>
            <Tooltip
              content="1st Place: John Doe"
              color="auto"
              placement="right"
            >
              <Avatar rounded bordered placeholderInitials="TS" stacked />
            </Tooltip>
            <Tooltip
              content="2nd Place: John Doe"
              color="auto"
              placement="right"
            >
              <Avatar rounded bordered placeholderInitials="TS" stacked />
            </Tooltip>
            <Tooltip
              content="3rd Place: John Doe"
              color="auto"
              placement="right"
            >
              <Avatar rounded bordered placeholderInitials="TS" stacked />
            </Tooltip>
            <Tooltip
              content="4th Place: John Doe"
              color="auto"
              placement="right"
            >
              <Avatar rounded bordered placeholderInitials="TS" stacked />
            </Tooltip>
            <Tooltip
              content="5th Place: John Doe"
              color="auto"
              placement="right"
            >
              <Avatar rounded bordered placeholderInitials="TS" stacked />
            </Tooltip>
          </Avatar.Group>
        </Card>
      </div>
    </>
  );
}
