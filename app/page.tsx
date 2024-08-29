/* eslint-disable react/no-unescaped-entities */

import Link from "next/link";
import Image from "next/image";

import { CheckIcon } from "@/components/gen/icons";
import { Header } from "@/components/gen/header";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header />

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Reducing Food Waste in Europe
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Food waste is a global issue with significant environmental,
                    social, and economic impacts. The European Union is
                    committed to reducing food waste by 20% by 2025.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Learn More
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Get Involved
                  </Link>
                </div>
              </div>
              <Image
                src="/food-waste.jpg"
                alt="Food Waste"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                width="550"
                height="550"
              />
            </div>
          </div>
        </section>
        <section
          id="impacts"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  The Impacts of Food Waste
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Food waste has significant environmental, social, and economic
                  impacts. It contributes to greenhouse gas emissions, wastes
                  valuable resources, and impacts food security.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Image
                src="/environmental-impact.jpg"
                alt="Environmental Impact"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                width="550"
                height="310"
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Environmental Impact</h3>
                  <p className="text-muted-foreground">
                    Food waste contributes to greenhouse gas emissions, water
                    usage, and land degradation. Reducing food waste can
                    significantly lower the environmental impact of the food
                    system.
                  </p>
                </div>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Social Impact</h3>
                  <p className="text-muted-foreground">
                    Food waste contributes to food insecurity, with millions of
                    people worldwide lacking access to adequate food. Reducing
                    food waste can help address this critical issue.
                  </p>
                </div>
              </div>
              <Image
                src="/social-impact-of-fw.jpeg"
                alt="Social Impact"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                width="550"
                height="310"
              />
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Image
                src="/economic-impact.jpg"
                alt="Economic Impact"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                width="550"
                height="310"
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Economic Impact</h3>
                  <p className="text-muted-foreground">
                    Food waste represents a significant economic loss, with
                    billions of dollars worth of food being thrown away each
                    year. Reducing food waste can lead to cost savings and
                    increased profitability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="solutions" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Solutions to Reduce Food Waste
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The European Union has implemented a range of policies and
                  initiatives to help reduce food waste across the continent.
                  These include education, regulation, and incentives for
                  businesses and consumers.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">
                    Education and Awareness
                  </h3>
                  <p className="text-muted-foreground">
                    Educating consumers and businesses about the importance of
                    reducing food waste and providing them with practical tips
                    and resources is a key part of the EU's strategy.
                  </p>
                </div>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-primary" />
                    <span>Campaigns to raise awareness</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-primary" />
                    <span>Guidance for businesses and consumers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-primary" />
                    <span>Collaboration with stakeholders</span>
                  </li>
                </ul>
              </div>
              <Image
                src="/education-and-awareness.jpg"
                alt="Education and Awareness"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                width="550"
                height="310"
              />
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Image
                src="/regulations-and-incentives.jpeg"
                alt="Regulation and Incentives"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                width="550"
                height="310"
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">
                    Regulation and Incentives
                  </h3>
                  <p className="text-muted-foreground">
                    The EU has implemented a range of regulations and incentives
                    to encourage businesses and consumers to reduce food waste,
                    including:
                  </p>
                </div>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-primary" />
                    <span>Mandatory food waste reporting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-primary" />
                    <span>Tax incentives for food donation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-primary" />
                    <span>Funding for food waste reduction projects</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section
          id="resources"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Resources to Learn More
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore these resources to learn more about the EU's efforts
                  to reduce food waste and how you can get involved.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">EU Food Waste Policy</h3>
                  <p className="text-muted-foreground">
                    Learn about the EU's policies and initiatives to reduce food
                    waste, including the Farm to Fork Strategy and the Circular
                    Economy Action Plan.
                  </p>
                  <Link
                    href="#"
                    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Read More
                  </Link>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Get Involved</h3>
                  <p className="text-muted-foreground">
                    Find out how you can get involved in reducing food waste,
                    whether as a business, a consumer, or a community
                    organization.
                  </p>
                  <Link
                    href="#"
                    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Get Involved
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 Hofwams. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Privacy
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Terms of Service
          </Link>
        </nav>
      </footer>
    </div>
  );
}
