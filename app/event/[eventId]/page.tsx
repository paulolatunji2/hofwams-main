import { format } from "date-fns";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { EventRegistrationForm } from "@/components/gen/event-registration-form";
import { ThemeToggler } from "@/components/gen/theme-toggler";
import { LeafIcon } from "@/components/gen/icons";

import { getEvent } from "@/actions/event-actions";
import { getAllAllergies } from "@/actions/guest-actions";

export default async function EventRegistrationPage({
  params,
}: {
  params: { eventId: string };
}) {
  const event = await getEvent(params.eventId);

  const allergies = await getAllAllergies();

  if (event.error) {
    return (
      <div className="h-dvh flex items-center justify-center text-4xl font-semibold">
        Error fetching event details.
      </div>
    );
  }

  if (!event.data) {
    return (
      <div className="h-dvh flex items-center justify-center text-4xl font-semibold">
        Even data not available
      </div>
    );
  }

  const { name, description, date, location, allowMinor } = event.data;

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-4 w-full">
          <nav className="mx-auto flex h-14 w-full items-center justify-between gap-3">
            <Link
              href="/"
              className="font-bold hover:text-emerald-400 transition duration-300 text-xl flex items-center gap-2"
            >
              <LeafIcon className="h-6 w-6" />
              Hofwams
            </Link>

            <ThemeToggler />
          </nav>
        </div>
      </header>
      <main className="flex flex-col min-h-[100dvh]">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary">
          <div className="container px-4 md:px-6 text-center text-primary-foreground">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                {name}
              </h1>
              <p className="max-w-[600px] mx-auto text-lg md:text-xl">
                {description}
              </p>
              <p className="text-lg font-medium">
                {format(date, "PPpp")} | {location}
              </p>
              <p className="text-lg font-medium">
                {!allowMinor && "No Minors allowed"}
              </p>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <Card className="mx-auto max-w-3xl">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Register for the event
                </CardTitle>
                <CardDescription>
                  Fill out the form below to secure your spot.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <EventRegistrationForm
                  eventInfo={event.data}
                  allergies={allergies.data ?? []}
                />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </>
  );
}
