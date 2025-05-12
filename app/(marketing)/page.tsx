import { Avatar, Button } from "flowbite-react";
import FaqAccordion from "./faq-accordion";

export default function Page() {
  return (
    <>
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-(--breakpoint-xl) px-4 py-8 text-center lg:px-12 lg:py-16">
          <a
            href="#"
            className="mb-7 inline-flex items-center justify-between rounded-full bg-gray-100 p-1 pr-4 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            <span className="mr-3 rounded-full bg-primary-600 px-4 py-1.5 text-xs text-white">
              New
            </span>
            &nbsp;
            <span className="text-sm font-medium">
              HOM is out! See what&apos;s new
            </span>
            <svg
              className="ml-2 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
            We invest in the world&apos;s potential
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-500 dark:text-gray-400 sm:px-16 lg:text-xl xl:px-48">
            Here at HOM we focus on markets where technology, innovation, and
            capital can unlock long-term value and drive economic growth.
          </p>
          <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0 lg:mb-16">
            <Button
              color="info"
              href="#"
              size="lg"
              className="[&>span]:items-center"
            >
              Learn more
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
            <Button
              color="gray"
              outline
              size="lg"
              className="[&>span]:items-center"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
              Watch video
            </Button>
          </div>
        </div>
      </section>
      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-(--breakpoint-xl) items-center gap-16 px-4 py-8 lg:grid lg:grid-cols-2 lg:px-6 lg:py-16">
          <div className="text-gray-500 dark:text-gray-400 sm:text-lg">
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              We didn&apos;t reinvent the wheel
            </h2>
            <p className="mb-4">
              We are strategists, designers and developers. Innovators and
              problem solvers. Small enough to be simple and quick, but big
              enough to deliver the scope you want at the pace you need. Small
              enough to be simple and quick, but big enough to deliver the scope
              you want at the pace you need.
            </p>
            <p>
              We are strategists, designers and developers. Innovators and
              problem solvers. Small enough to be simple and quick.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <img
              alt=""
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-2.png"
              className="w-full rounded-lg"
            />
            <img
              alt=""
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-1.png"
              className="mt-4 w-full rounded-lg lg:mt-10"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-(--breakpoint-xl) items-center gap-8 px-4 py-8 sm:py-16 md:grid md:grid-cols-2 lg:px-6 xl:gap-16">
          <div>
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Let&apos;s create more tools and ideas that brings us together.
            </h2>
            <p className="mb-6 text-gray-500 dark:text-gray-400 md:text-lg">
              HOM helps you connect with friends and communities of people who
              share your interests. Connecting with your friends and family as
              well as discovering new ones is easy with features like Groups.
            </p>
            <div className="items-center space-y-4 sm:flex sm:space-x-4 sm:space-y-0">
              <Button
                href="#"
                className="border-0 bg-gray-800 text-white hover:bg-gray-700 focus:outline-hidden focus:ring-4 focus:ring-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-800"
              >
                <svg
                  className="mr-3 h-7 w-7"
                  aria-hidden="true"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                >
                  <path
                    fill="currentColor"
                    d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                  />
                </svg>
                <div className="text-left">
                  <div className="mb-1 text-xs">Download on the</div>
                  <div className="-mt-1 font-sans text-sm font-semibold">
                    Mac App Store
                  </div>
                </div>
              </Button>
              <Button
                href="#"
                className="border-0 bg-gray-800 text-white hover:bg-gray-700 focus:outline-hidden focus:ring-4 focus:ring-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-800"
              >
                <svg
                  className="mr-3 h-7 w-7"
                  aria-hidden="true"
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"
                  />
                </svg>
                <div className="text-left">
                  <div className="mb-1 text-xs">Get in on</div>
                  <div className="-mt-1 font-sans text-sm font-semibold">
                    Google Play
                  </div>
                </div>
              </Button>
            </div>
          </div>
          <img
            alt="mobile app"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/cta/iphone-mockup.png"
            className="mx-auto hidden w-64 md:flex"
          />
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-(--breakpoint-xl) px-4 py-8 sm:py-16 lg:px-6">
          <div className="mb-8 max-w-(--breakpoint-md) lg:mb-16">
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Designed for business teams like yours
            </h2>
            <p className="text-gray-500 dark:text-gray-400 sm:text-xl">
              Here at HOM we focus on markets where technology, innovation, and
              capital can unlock long-term value and drive economic growth.
            </p>
          </div>
          <div className="space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3">
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 lg:h-12 lg:w-12">
                <svg
                  className="h-5 w-5 text-primary-600 dark:text-primary-300 lg:h-6 lg:w-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold dark:text-white">
                Marketing
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Plan it, create it, launch it. Collaborate seamlessly with all
                the organization and hit your marketing goals every month with
                our marketing plan.
              </p>
            </div>
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 lg:h-12 lg:w-12">
                <svg
                  className="h-5 w-5 text-primary-600 dark:text-primary-300 lg:h-6 lg:w-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold dark:text-white">Legal</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Protect your organization, devices and stay compliant with our
                structured workflows and custom permissions made for you.
              </p>
            </div>
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 lg:h-12 lg:w-12">
                <svg
                  className="h-5 w-5 text-primary-600 dark:text-primary-300 lg:h-6 lg:w-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold dark:text-white">
                Business Automation
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Auto-assign tasks, send Slack messages, and much more. Now power
                up with hundreds of new templates to help you get started.
              </p>
            </div>
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 lg:h-12 lg:w-12">
                <svg
                  className="h-5 w-5 text-primary-600 dark:text-primary-300 lg:h-6 lg:w-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold dark:text-white">
                Finance
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Audit-proof software built for critical financial operations
                like month-end close and quarterly budgeting.
              </p>
            </div>
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 lg:h-12 lg:w-12">
                <svg
                  className="h-5 w-5 text-primary-600 dark:text-primary-300 lg:h-6 lg:w-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold dark:text-white">
                Enterprise Design
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Craft beautiful, delightful experiences for both marketing and
                product with real cross-company collaboration.
              </p>
            </div>
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 lg:h-12 lg:w-12">
                <svg
                  className="h-5 w-5 text-primary-600 dark:text-primary-300 lg:h-6 lg:w-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold dark:text-white">
                Operations
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Keep your company’s lights on with customizable, iterative, and
                structured workflows built for all efficient teams and
                individual.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-(--breakpoint-xl) px-4 py-8 lg:px-6 lg:py-16">
          <div className="space-y-8 sm:gap-6 lg:grid lg:grid-cols-3 lg:space-y-0 xl:gap-10">
            <div className="mx-auto flex max-w-lg flex-col rounded-lg border border-gray-100 bg-white p-6 text-center text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white xl:p-8">
              <h3 className="mb-4 text-2xl font-semibold">Starter</h3>
              <p className="text-gray-500 dark:text-gray-400 sm:text-lg">
                Best option for personal use &amp; for your next project.
              </p>
              <div className="my-8 flex items-baseline justify-center">
                <span className="mr-2 text-5xl font-extrabold">$29</span>
                <span className="text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <ul className="mb-8 space-y-4 text-left">
                <li className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Individual configuration</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>No setup, or hidden fees</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Team size:{" "}
                    <span className="font-semibold">1 developer</span>
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Premium support:&nbsp;
                    <span className="font-semibold">6 months</span>
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Free updates:{" "}
                    <span className="font-semibold">6 months</span>
                  </span>
                </li>
              </ul>
              <Button href="#">Get started</Button>
            </div>
            <div className="mx-auto flex max-w-lg flex-col rounded-lg border border-gray-100 bg-white p-6 text-center text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white xl:p-8">
              <h3 className="mb-4 text-2xl font-semibold">Company</h3>
              <p className="text-gray-500 dark:text-gray-400 sm:text-lg">
                Relevant for multiple users, extended &amp; premium support.
              </p>
              <div className="my-8 flex items-baseline justify-center">
                <span className="mr-2 text-5xl font-extrabold">$99</span>
                <span className="text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <ul className="mb-8 space-y-4 text-left">
                <li className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Individual configuration</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>No setup, or hidden fees</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Team size:&nbsp;
                    <span className="font-semibold">10 developers</span>
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Premium support:&nbsp;
                    <span className="font-semibold">24 months</span>
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Free updates:{" "}
                    <span className="font-semibold">24 months</span>
                  </span>
                </li>
              </ul>
              <Button href="#">Get started</Button>
            </div>
            <div className="mx-auto flex max-w-lg flex-col rounded-lg border border-gray-100 bg-white p-6 text-center text-gray-900 shadow-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white xl:p-8">
              <h3 className="mb-4 text-2xl font-semibold">Enterprise</h3>
              <p className="text-gray-500 dark:text-gray-400 sm:text-lg">
                Best for large scale uses and extended redistribution rights.
              </p>
              <div className="my-8 flex items-baseline justify-center">
                <span className="mr-2 text-5xl font-extrabold">$499</span>
                <span className="text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <ul className="mb-8 space-y-4 text-left">
                <li className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Individual configuration</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>No setup, or hidden fees</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Team size:&nbsp;
                    <span className="font-semibold">100+ developers</span>
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Premium support:&nbsp;
                    <span className="font-semibold">36 months</span>
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    Free updates:{" "}
                    <span className="font-semibold">36 months</span>
                  </span>
                </li>
              </ul>
              <Button href="#">Get started</Button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-(--breakpoint-xl) items-center gap-8 px-4 py-8 lg:grid lg:grid-cols-2 lg:px-6 lg:py-16 xl:gap-16">
          <div className="text-gray-500 sm:text-lg">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white md:text-4xl">
              Stats that matter
            </h2>
            <p className="mb-8 dark:text-gray-400 lg:text-xl">
              Our rigorous security and compliance standards are at the heart of
              all we do. We work tirelessly to protect you and your customers.
            </p>
            <div className="grid gap-6 dark:border-gray-700 sm:grid-cols-2 lg:grid-cols-1">
              <div className="flex">
                <div className="mr-4 shrink-0">
                  <svg
                    aria-hidden
                    className="h-8 w-8 text-primary-600 dark:text-primary-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="mb-1 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    $76 billion
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    24h trading volume on HOM exchange
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="mr-4 shrink-0">
                  <svg
                    aria-hidden
                    className="h-8 w-8 text-primary-600 dark:text-primary-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="mb-1 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    90%
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    of U.S adults have bought from businesses using HOM
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="mr-4 shrink-0">
                  <svg
                    aria-hidden
                    className="h-8 w-8 text-primary-600 dark:text-primary-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="mb-1 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    135+
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    currencies and payment methods supported
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="mr-4 shrink-0">
                  <svg
                    aria-hidden
                    className="h-8 w-8 text-primary-600 dark:text-primary-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="mb-1 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    40%
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    countries with local acquiring optimizing acceptance rates
                  </p>
                </div>
              </div>
            </div>
          </div>
          <img
            className="mx-auto mb-4 hidden sm:flex"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/social-proof/table-professor.svg"
            alt="table professor illustration"
          />
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-(--breakpoint-xl) px-4 py-8 lg:px-6 lg:py-16">
          <div className="mx-auto max-w-(--breakpoint-md) text-center">
            <h2 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Testimonials
            </h2>
            <p className="mb-8 text-gray-500 dark:text-gray-400 sm:text-xl lg:mb-16">
              Explore the whole collection of open-source web components and
              elements built with the utility classes from Tailwind
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6">
              <figure className="rounded-sm bg-gray-50 p-6 dark:bg-gray-800">
                <blockquote className="text-sm text-gray-500 dark:text-gray-400">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Solid foundation for any project
                  </h3>
                  <p className="my-4">
                    &quot;This is a very complex and beautiful set of elements.
                    Under the hood it comes with the best things from 2
                    different worlds: Figma and Tailwind.&quot;
                  </p>
                </blockquote>
                <figcaption className="flex items-center space-x-3">
                  <Avatar
                    img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png"
                    rounded
                    size="sm"
                  >
                    <div className="space-y-0.5 font-medium dark:text-white">
                      <div>Bonnie Green</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        CTO at Open AI
                      </div>
                    </div>
                  </Avatar>
                </figcaption>
              </figure>
              <figure className="rounded-sm bg-gray-50 p-6 dark:bg-gray-800">
                <blockquote className="text-sm text-gray-500 dark:text-gray-400">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    A must-have for designers
                  </h3>
                  <p className="my-4">
                    &quot;This is a very complex and beautiful set of elements.
                    Under the hood it comes with the best things from 2
                    different worlds: Figma and Tailwind.&quot;
                  </p>
                </blockquote>
                <figcaption className="flex items-center space-x-3">
                  <Avatar
                    img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/karen-nelson.png"
                    rounded
                    size="sm"
                  >
                    <div className="space-y-0.5 font-medium dark:text-white">
                      <div>Lana Byrd</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Software Engineer at Tesla
                      </div>
                    </div>
                  </Avatar>
                </figcaption>
              </figure>
              <figure className="rounded-sm bg-gray-50 p-6 dark:bg-gray-800">
                <blockquote className="text-sm text-gray-500 dark:text-gray-400">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Speechless with how easy this was to integrate
                  </h3>
                  <p className="my-4">
                    &quot;I recently got my hands on HOM Pro, and holy crap,
                    I&apos;m speechless with how easy this was to integrate
                    within my application. Most templates are a pain, code is
                    scattered, and near impossible to theme.&quot;
                  </p>
                </blockquote>
                <figcaption className="flex items-center space-x-3">
                  <Avatar
                    img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png"
                    rounded
                    size="sm"
                  >
                    <div className="space-y-0.5 font-medium dark:text-white">
                      <div>Jese Leos</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        CEO at Oracle
                      </div>
                    </div>
                  </Avatar>
                </figcaption>
              </figure>
            </div>
            <div className="space-y-6">
              <figure className="rounded-sm bg-gray-50 p-6 dark:bg-gray-800">
                <blockquote className="text-sm text-gray-500 dark:text-gray-400">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Efficient Collaborating
                  </h3>
                  <p className="my-4">
                    &quot;HOM is just awesome. It contains tons of predesigned
                    components and pages starting from login screen to complex
                    dashboard. Perfect choice for your next SaaS
                    application.&quot;
                  </p>
                </blockquote>
                <figcaption className="flex items-center space-x-3">
                  <Avatar
                    img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/joseph-mcfall.png"
                    rounded
                    size="sm"
                  >
                    <div className="space-y-0.5 font-medium dark:text-white">
                      <div>Joseph McFall</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Junior Designer at Adobe
                      </div>
                    </div>
                  </Avatar>
                </figcaption>
              </figure>
              <figure className="rounded-sm bg-gray-50 p-6 dark:bg-gray-800">
                <blockquote className="text-sm text-gray-500 dark:text-gray-400">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Mindblowing workflow and variants
                  </h3>
                  <p className="my-4">
                    &quot;HOM provides a robust set of design tokens and
                    components based on the popular Tailwind CSS framework.
                  </p>
                  <p className="my-4">
                    From the most used UI components like forms and navigation
                    bars to the whole app screens designed both for desktop and
                    mobile, this UI kit provides a solid foundation for any
                    project.&quot;
                  </p>
                </blockquote>
                <figcaption className="flex items-center space-x-3">
                  <Avatar
                    img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png"
                    rounded
                    size="sm"
                  >
                    <div className="space-y-0.5 font-medium dark:text-white">
                      <div>Helene Engels</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        CFO at Microsoft
                      </div>
                    </div>
                  </Avatar>
                </figcaption>
              </figure>
              <figure className="rounded-sm bg-gray-50 p-6 dark:bg-gray-800">
                <blockquote className="text-sm text-gray-500 dark:text-gray-400">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Perfect choice for a SaaS application
                  </h3>
                  <p className="my-4">
                    &quot;HOM provides a robust set of design tokens and
                    components based on the popular Tailwind CSS framework.
                  </p>
                  <p className="my-4">
                    From the most used UI components like forms and navigation
                    bars to the whole app screens designed both for desktop and
                    mobile, this UI kit provides a solid foundation for any
                    project.&quot;
                  </p>
                </blockquote>
                <figcaption className="flex items-center space-x-3">
                  <Avatar
                    img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/sofia-mcguire.png"
                    rounded
                    size="sm"
                  >
                    <div className="space-y-0.5 font-medium dark:text-white">
                      <div>Leslie Livingston</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Creative Director at Apple
                      </div>
                    </div>
                  </Avatar>
                </figcaption>
              </figure>
            </div>
            <div className="space-y-6">
              <figure className="rounded-sm bg-gray-50 p-6 dark:bg-gray-800">
                <blockquote className="text-sm text-gray-500 dark:text-gray-400">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Solid foundation for any project
                  </h3>
                  <p className="my-4">
                    &quot;I recently got my hands on HOM Pro, and holy crap,
                    I&apos;m speechless with how easy this was to integrate
                    within my application. Most templates are a pain, code is
                    scattered, and near impossible to theme.&quot;
                  </p>
                </blockquote>
                <figcaption className="flex items-center space-x-3">
                  <Avatar
                    img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gouch.png"
                    rounded
                    size="sm"
                  >
                    <div className="space-y-0.5 font-medium dark:text-white">
                      <div>Michael Gough</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Front-end engineer at Meta
                      </div>
                    </div>
                  </Avatar>
                </figcaption>
              </figure>
              <figure className="rounded-sm bg-gray-50 p-6 dark:bg-gray-800">
                <blockquote className="text-sm text-gray-500 dark:text-gray-400">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Mindblowing workflow and variants
                  </h3>
                  <p className="my-4">
                    &quot;HOM is just awesome. It contains tons of predesigned
                    components and pages starting from login screen to complex
                    dashboard. Perfect choice for your next SaaS
                    application.&quot;
                  </p>
                </blockquote>
                <figcaption className="flex items-center space-x-3">
                  <Avatar
                    img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/neil-sims.png"
                    rounded
                    size="sm"
                  >
                    <div className="space-y-0.5 font-medium dark:text-white">
                      <div>Neil Sims</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Software architect at Amazon
                      </div>
                    </div>
                  </Avatar>
                </figcaption>
              </figure>
              <figure className="rounded-sm bg-gray-50 p-6 dark:bg-gray-800">
                <blockquote className="text-sm text-gray-500 dark:text-gray-400">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Speechless with how easy this was to integrate
                  </h3>
                  <p className="my-4">
                    &quot;This is a very complex and beautiful set of elements.
                    Under the hood it comes with the best things from 2
                    different worlds: Figma and Tailwind.&quot;
                  </p>
                </blockquote>
                <figcaption className="flex items-center space-x-3">
                  <Avatar
                    img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/robert-brown.png"
                    rounded
                    size="sm"
                  >
                    <div className="space-y-0.5 font-medium dark:text-white">
                      <div>Robert Brown</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Junior developer at SAP
                      </div>
                    </div>
                  </Avatar>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <FaqAccordion />
    </>
  );
}
