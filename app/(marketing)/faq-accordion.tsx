"use client";
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle } from "flowbite-react";

export default function FaqAccordion() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-(--breakpoint-xl) px-4 py-8 sm:py-16 lg:px-6">
        <h2 className="mb-6 text-center text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white lg:mb-8 lg:text-4xl">
          Frequently asked questions
        </h2>
        <div className="mx-auto max-w-(--breakpoint-md)">
          <Accordion flush>
            <AccordionPanel>
              <AccordionTitle className="bg-transparent dark:bg-transparent">
                Can I use HOM in open-source projects?
              </AccordionTitle>
              <AccordionContent>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  HOM is an open-source library of interactive components built
                  on top of Tailwind CSS including buttons, dropdowns, modals,
                  navbars, and more.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Check out this guide to learn how to&nbsp;
                  <a
                    href="#"
                    className="text-primary-600 hover:underline dark:text-primary-500"
                  >
                    get started
                  </a>
                  &nbsp;and start developing websites even faster with
                  components on top of Tailwind CSS.
                </p>
              </AccordionContent>
            </AccordionPanel>
            <AccordionPanel>
              <AccordionTitle className="bg-transparent dark:bg-transparent">
                Is there a Figma file available?
              </AccordionTitle>
              <AccordionContent>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  HOM is first conceptualized and designed using the Figma
                  software so everything you see in the library has a design
                  equivalent in our Figma file.
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Check out the&nbsp;
                  <a
                    href="#"
                    className="text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Figma design system
                  </a>
                  &nbsp;based on the utility classes from Tailwind CSS and
                  components from HOM.
                </p>
              </AccordionContent>
            </AccordionPanel>
            <AccordionPanel>
              <AccordionTitle className="bg-transparent dark:bg-transparent">
                What are the differences between HOM and Tailwind UI?
              </AccordionTitle>
              <AccordionContent>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  The main difference is that the core components from HOM are
                  open source under the MIT license, whereas Tailwind UI is a
                  paid product. Another difference is that HOM relies on smaller
                  and standalone components, whereas Tailwind UI offers sections
                  of pages.
                </p>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  However, we actually recommend using both HOM, HOM Pro, and
                  even Tailwind UI as there is no technical reason stopping you
                  from using the best of two worlds.
                </p>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  Learn more about these technologies:
                </p>
                <ul className="list-disc pl-5 text-gray-500 dark:text-gray-400">
                  <li>
                    <a
                      href="#"
                      className="text-primary-600 hover:underline dark:text-primary-500"
                    >
                      HOM Pro
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Tailwind UI
                    </a>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionPanel>
            <AccordionPanel>
              <AccordionTitle className="bg-transparent dark:bg-transparent">
                What about browser support?
              </AccordionTitle>
              <AccordionContent>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  The main difference is that the core components from HOM are
                  open source under the MIT license, whereas Tailwind UI is a
                  paid product. Another difference is that HOM relies on smaller
                  and standalone components, whereas Tailwind UI offers sections
                  of pages.
                </p>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  However, we actually recommend using both HOM, HOM Pro, and
                  even Tailwind UI as there is no technical reason stopping you
                  from using the best of two worlds.
                </p>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  Learn more about these technologies:
                </p>
                <ul className="list-disc pl-5 text-gray-500 dark:text-gray-400">
                  <li>
                    <a
                      href="#"
                      className="text-primary-600 hover:underline dark:text-primary-500"
                    >
                      HOM Pro
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Tailwind UI
                    </a>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionPanel>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
