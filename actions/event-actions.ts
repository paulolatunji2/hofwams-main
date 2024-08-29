"use server";

import { UserRole } from "@prisma/client";
import { isAfter } from "date-fns";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import {
  drinkSchema,
  DrinkValues,
  eventSchema,
  EventValues,
  mealSchema,
  MealValues,
} from "@/schema/event";
import { ResponseType } from "./user-actions";
import { EventResponseType } from "@/types";

export const createMeal = async (values: MealValues): Promise<ResponseType> => {
  try {
    const session = await auth();
    const { id: userId } = session?.user || {};

    if (!userId) {
      throw new Error("Not authenticated.");
    }

    const { name, type } = mealSchema.parse(values);

    const existingMeal = await prisma.meal.findFirst({
      where: {
        name: {
          mode: "insensitive",
          equals: name,
        },
      },
    });

    if (existingMeal) {
      return { error: "Meal already exists!" };
    }

    await prisma.meal.create({
      data: {
        name,
        type,
      },
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Create meal error:", error);
    return {
      error:
        "An error occurred while creating the meal. Please try again later.",
    };
  }
};

export const createDrink = async (
  values: DrinkValues
): Promise<ResponseType> => {
  try {
    const session = await auth();
    const { id: userId } = session?.user || {};

    if (!userId) {
      throw new Error("Not authenticated.");
    }

    const { name, type } = drinkSchema.parse(values);

    const existingDrink = await prisma.drink.findFirst({
      where: {
        name: {
          mode: "insensitive",
          equals: name,
        },
      },
    });

    if (existingDrink) {
      return { error: "Drink already exists!" };
    }

    await prisma.drink.create({
      data: {
        name,
        type,
      },
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Create meal error:", error);
    return {
      error:
        "An error occurred while creating the meal. Please try again later.",
    };
  }
};

export const getAllMeals = async (): Promise<ResponseType<MealValues[]>> => {
  try {
    const session = await auth();
    const { id: userId } = session?.user || {};

    if (!userId) {
      throw new Error("Not authenticated.");
    }

    const meals = await prisma.meal.findMany();

    return { success: true, data: meals };
  } catch (error) {
    console.error("Get all meals error:", error);
    return {
      error:
        "An error occurred while getting all the meals. Please try again later.",
    };
  }
};

export const getAllDrinks = async (): Promise<ResponseType<DrinkValues[]>> => {
  try {
    const session = await auth();
    const { id: userId } = session?.user || {};

    if (!userId) {
      throw new Error("Not authenticated.");
    }

    const drinks = await prisma.drink.findMany();

    return { success: true, data: drinks };
  } catch (error) {
    console.error("Get all meals error:", error);
    return {
      error:
        "An error occurred while getting all the meals. Please try again later.",
    };
  }
};

export const createEvent = async (
  values: EventValues
): Promise<ResponseType<{ link: string }>> => {
  try {
    const session = await auth();
    const { id: userId } = session?.user || {};

    if (!userId) {
      throw new Error("Not authenticated.");
    }

    const defaultDomain = process.env.NEXT_PUBLIC_DOMAIN;
    // Get the current domain
    const domain =
      typeof window !== "undefined"
        ? `${window.location.protocol}//${window.location.host}`
        : defaultDomain;

    const {
      name,
      description,
      maxNumberOfGuests,
      allowExtraGuest,
      maxNumberOfExtraGuest,
      allowMinor,
      meals,
      drinks,
      mealTimeType,
      date,
      location,
      time,
    } = eventSchema.parse(values);

    // Combine date and time into a single DateTime
    const timeString = time || "00:00"; // Default to midnight if time is not provided
    const eventDateTime = new Date(
      `${date.toISOString().split("T")[0]}T${timeString}`
    );

    if (isNaN(eventDateTime.getTime())) {
      throw new Error("Invalid date or time.");
    }
    // Find or create the Organizer
    let organizer = await prisma.organizer.findUnique({
      where: { userId },
    });

    if (!organizer) {
      organizer = await prisma.organizer.create({
        data: {
          userId,
        },
      });
    }

    // Handle Meals
    const mealConnections = await Promise.all(
      meals.map(async (meal) => {
        const existingMeal = await prisma.meal.findFirst({
          where: {
            name: {
              mode: "insensitive",
              equals: meal,
            },
          },
        });

        if (existingMeal) {
          return { id: existingMeal.id };
        }
      })
    );

    // Handle Drinks
    const drinkConnections = await Promise.all(
      drinks.map(async (drink) => {
        const existingDrink = await prisma.drink.findFirst({
          where: {
            name: {
              mode: "insensitive",
              equals: drink,
            },
          },
        });

        if (existingDrink) {
          return { id: existingDrink.id };
        }
      })
    );

    // Create the Event
    const event = await prisma.event.create({
      data: {
        name,
        description,
        maxNumberOfGuests,
        allowExtraGuest,
        maxNumberOfExtraGuest,
        allowMinor,
        mealTimeType,
        availableSlot: maxNumberOfGuests,
        date: eventDateTime,
        location,
        organizerId: organizer.id,
        meals: {
          connect: mealConnections.filter(
            (connection) => connection !== undefined
          ),
        },
        drinks: {
          connect: drinkConnections.filter(
            (connection) => connection !== undefined
          ),
        },
      },
    });

    // Generate the link using the event ID
    const link = `${domain}/event/${event.id}`;

    // Update the event with the generated link
    await prisma.event.update({
      where: { id: event.id },
      data: { link },
    });

    // Revalidate the cache for the homepage or other relevant paths
    revalidatePath("/dashboard/organizer");

    return { success: true, data: { link } };
  } catch (error) {
    console.error("Create event error:", error);
    return {
      error:
        "An error occurred while creating the event. Please try again later.",
    };
  }
};

export const getEvent = async (
  id: string
): Promise<ResponseType<EventResponseType>> => {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id,
      },
      include: {
        meals: { select: { name: true } },
        drinks: { select: { name: true } },
      },
    });

    if (!event) {
      return { error: "Event not found." };
    }

    const formattedEvent = {
      id: event.id,
      name: event.name,
      description: event.description,
      maxNumberOfGuests: event.maxNumberOfGuests,
      allowExtraGuest: event.allowExtraGuest,
      maxNumberOfExtraGuest: event.maxNumberOfExtraGuest,
      availableSlot: event.availableSlot,
      slotTaken: event.slotTaken,
      allowMinor: event.allowMinor,
      organizerId: event.organizerId,
      meals: event.meals.map((meal) => meal.name),
      drinks: event.drinks.map((drink) => drink.name),
      mealTimeType: event.mealTimeType,
      date: event.date,
      location: event.location,
      link: event.link,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };

    return { success: true, data: formattedEvent };
  } catch (error) {
    console.error("Get event error:", error);
    return {
      error:
        "An error occurred while getting the event. Please try again later.",
    };
  }
};

export const getAllEvents = async (
  upcomingOnly?: boolean
): Promise<ResponseType<EventResponseType[]>> => {
  try {
    const session = await auth();
    const { id: userId, role } = session?.user || {};

    if (!userId || !role) {
      return { error: "Unauthorized access. Please log in." };
    }

    const events = await prisma.event.findMany({
      include: {
        meals: { select: { name: true } },
        drinks: { select: { name: true } },
      },
      orderBy: {
        date: "asc",
      },
    });

    if (events.length === 0) {
      return { error: "No event found." };
    }

    const filteredEvents = upcomingOnly
      ? events.filter((event) => isAfter(new Date(event.date), new Date()))
      : events;

    const formattedEvents = filteredEvents.map((event) => ({
      id: event.id,
      name: event.name,
      description: event.description,
      maxNumberOfGuests: event.maxNumberOfGuests,
      allowExtraGuest: event.allowExtraGuest,
      maxNumberOfExtraGuest: event.maxNumberOfExtraGuest,
      availableSlot: event.availableSlot,
      slotTaken: event.slotTaken,
      allowMinor: event.allowMinor,
      organizerId: event.organizerId,
      meals: event.meals.map((meal) => meal.name),
      drinks: event.drinks.map((drink) => drink.name),
      mealTimeType: event.mealTimeType,
      date: event.date,
      location: event.location,
      link: event.link,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    }));

    return { success: true, data: formattedEvents };
  } catch (error) {
    console.error("Get events error:", error);
    return {
      error:
        "An error occurred while getting the events. Please try again later.",
    };
  }
};

export const getAllOrganizerEvents = async (
  upcomingOnly?: boolean
): Promise<ResponseType<EventResponseType[]>> => {
  try {
    const session = await auth();
    const { id: userId } = session?.user || {};

    if (!userId) {
      return { error: "Unauthorized access. Please log in." };
    }

    const organizer = await prisma.organizer.findUnique({
      where: {
        userId,
      },
    });

    if (!organizer) {
      return { error: "Organizer not found." };
    }

    const events = await prisma.event.findMany({
      where: {
        organizerId: organizer?.id,
      },
      include: {
        meals: {
          select: {
            name: true,
            type: true,
          },
        },
        drinks: {
          select: {
            name: true,
            type: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    if (events.length === 0) {
      return { data: [] };
    }

    // Filter for upcoming events if the upcomingOnly flag is true
    const filteredEvents = upcomingOnly
      ? events.filter((event) => isAfter(new Date(event.date), new Date()))
      : events;

    const formattedEvents = filteredEvents.map((event) => ({
      id: event.id,
      name: event.name,
      description: event.description,
      maxNumberOfGuests: event.maxNumberOfGuests,
      allowExtraGuest: event.allowExtraGuest,
      maxNumberOfExtraGuest: event.maxNumberOfExtraGuest,
      availableSlot: event.availableSlot,
      slotTaken: event.slotTaken,
      allowMinor: event.allowMinor,
      organizerId: event.organizerId,
      meals: event.meals.map((meal) => meal.name),
      drinks: event.drinks.map((drink) => drink.name),
      mealTimeType: event.mealTimeType,
      date: event.date,
      location: event.location,
      link: event.link,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    }));

    revalidatePath("/dashboard/organizer/events");
    return { success: true, data: formattedEvents };
  } catch (error) {
    console.error("Get events error:", error);
    return {
      error:
        "An error occurred while getting the events. Please try again later.",
    };
  }
};

export const updateEvent = async (
  id: string,
  values: EventValues
): Promise<ResponseType<EventResponseType>> => {
  try {
    const session = await auth();
    const { id: userId, role } = session?.user || {};

    if (!userId && role !== UserRole.ADMIN) {
      return { error: "Unauthorized access. Please log in." };
    }

    const eventData = eventSchema.parse(values);

    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return { error: "Event not found." };
    }

    const { time, date, meals, drinks, ...rest } = eventData;

    // Combine date and time into a single DateTime
    const timeString = time || "00:00"; // Default to midnight if time is not provided
    const eventDateTime = date
      ? new Date(`${date.toISOString().split("T")[0]}T${timeString}`)
      : new Date(`${new Date().toISOString().split("T")[0]}T${timeString}`);

    if (isNaN(eventDateTime.getTime())) {
      throw new Error("Invalid date or time.");
    }

    // Handle Meals
    const mealConnections = await Promise.all(
      meals.map(async (meal) => {
        const existingMeal = await prisma.meal.findFirst({
          where: {
            name: {
              mode: "insensitive",
              equals: meal,
            },
          },
        });

        if (existingMeal) {
          return { id: existingMeal.id };
        }
      })
    );

    // Handle Drinks
    const drinkConnections = await Promise.all(
      drinks.map(async (drink) => {
        const existingDrink = await prisma.drink.findFirst({
          where: {
            name: {
              mode: "insensitive",
              equals: drink,
            },
          },
        });

        if (existingDrink) {
          return { id: existingDrink.id };
        }
      })
    );

    const event = await prisma.event.update({
      where: { id },
      include: {
        meals: { select: { name: true } },
        drinks: { select: { name: true } },
      },
      data: {
        ...rest,
        date: eventDateTime,
        meals: {
          connect: mealConnections.filter(
            (connection) => connection !== undefined
          ),
        },
        drinks: {
          connect: drinkConnections.filter(
            (connection) => connection !== undefined
          ),
        },
      },
    });

    const formattedEvent = {
      id: event.id,
      name: event.name,
      description: event.description,
      maxNumberOfGuests: event.maxNumberOfGuests,
      allowExtraGuest: event.allowExtraGuest,
      maxNumberOfExtraGuest: event.maxNumberOfExtraGuest,
      availableSlot: event.availableSlot,
      slotTaken: event.slotTaken,
      allowMinor: event.allowMinor,
      organizerId: event.organizerId,
      meals: event.meals.map((meal) => meal.name),
      drinks: event.drinks.map((drink) => drink.name),
      mealTimeType: event.mealTimeType,
      date: event.date,
      location: event.location,
      link: event.link,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };

    revalidatePath("/dashboard/admin/events");
    return { success: true, data: formattedEvent };
  } catch (error) {
    console.error("Update event error:", error);
    return {
      error:
        "An error occurred while updating the event. Please try again later.",
    };
  }
};

export const deleteEvent = async (id: string): Promise<ResponseType> => {
  try {
    const session = await auth();
    const { id: userId, role } = session?.user || {};

    if (!userId && role !== UserRole.ADMIN) {
      return { error: "Unauthorized access. Please log in." };
    }

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return { error: "Event not found." };
    }

    await prisma.event.delete({
      where: { id },
    });

    revalidatePath("/dashboard/admin/events");
    return { success: true };
  } catch (error) {
    console.error("Delete event error:", error);
    return {
      error:
        "An error occurred while deleting the event. Please try again later.",
    };
  }
};
