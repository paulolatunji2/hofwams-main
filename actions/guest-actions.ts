"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { ResponseType } from "./user-actions";
import {
  eventRegistrationSchema,
  EventRegistrationValues,
} from "@/schema/event";
import { GuestResponseType } from "@/types";

export const registerForEvent = async (
  id: string,
  data: EventRegistrationValues
): Promise<ResponseType> => {
  try {
    // Parse and validate input data
    const {
      email,
      age,
      phoneNumber,
      comingWithExtra,
      extraType,
      numberOfExtra,
      numberOfAdults,
      numberOfMinors,
      allergies = [],
      preferredDishes,
      preferredDrinks,
    } = eventRegistrationSchema.parse(data);

    // Find the event
    const event = await prisma.event.findUnique({
      where: {
        id,
      },
      include: {
        guests: true, // Include guests to check for existing registrations
      },
    });

    if (!event || new Date(event.date) < new Date()) {
      return { error: "Event not found or has expired." };
    }

    const numOfExtras = numberOfExtra ?? 0;
    const numOfAdults = numberOfAdults ?? 0;
    const numOfMinors = numberOfMinors ?? 0;

    if (extraType?.length === 2 && numOfExtras < 2) {
      return {
        error: "Number of extra is less than number of extra type selected!",
      };
    }

    // Check if the guest has already registered for the event
    const existingGuest = await prisma.guest.findFirst({
      where: {
        email: {
          mode: "insensitive",
          equals: email,
        },
        phoneNumber: {
          mode: "insensitive",
          equals: phoneNumber,
        },
        eventId: id,
      },
    });

    if (existingGuest) {
      return { error: "Guest has already registered for this event." };
    }

    const {
      allowExtraGuest,
      availableSlot,
      maxNumberOfGuests,
      maxNumberOfExtraGuest,
      slotTaken,
    } = event;

    // Check if the event allows minors and validate the age
    if ((age < 18 || extraType?.includes("MINOR")) && !event.allowMinor) {
      return { error: "No Minors Allowed for this event." };
    }

    // Check if the event allows extra guests and validate the limits

    if (numOfAdults + numOfMinors > numOfExtras)
      return { error: "Invalid number of guests." };

    const totalGuest = comingWithExtra ? numOfExtras + 1 : 1;

    if (allowExtraGuest) {
      if (
        maxNumberOfExtraGuest !== null &&
        numOfExtras > maxNumberOfExtraGuest
      ) {
        return { error: "Number of extra guests exceeds the maximum allowed." };
      }
      if (availableSlot !== null && slotTaken + totalGuest > availableSlot) {
        return { error: "Number of guests exceeds the available slots." };
      }
    } else {
      if (totalGuest > maxNumberOfGuests) {
        return {
          error: "Number of guests exceeds the maximum allowed for the event.",
        };
      } else {
        return {
          error:
            "No extra guests allowed for this event. Strictly by invitation!",
        };
      }
    }

    // Handle allergies: find existing or create new ones
    const allergyIds = await Promise.all(
      allergies.map(async (allergyName) => {
        const allergy = await prisma.allergy.upsert({
          where: { name: allergyName },
          update: {},
          create: { name: allergyName },
          select: { id: true },
        });
        return allergy.id;
      })
    );

    // Handle Meals
    const mealConnections = await Promise.all(
      preferredDishes.map(async (meal) => {
        const mealData = await prisma.meal.findUnique({
          where: { name: meal },
          select: { id: true },
        });
        return mealData ? { id: mealData.id } : undefined;
      })
    );

    // Handle Drinks
    const drinkConnections = await Promise.all(
      preferredDrinks.map(async (drink) => {
        const drinkData = await prisma.drink.findUnique({
          where: { name: drink },
          select: { id: true },
        });
        return drinkData ? { id: drinkData.id } : undefined;
      })
    );

    // Perform the guest registration and update slotTaken transactionally
    await prisma.$transaction(async (prisma) => {
      await prisma.guest.create({
        data: {
          ...data,
          extraType: extraType ? extraType.join(", ") : null,
          allergies: {
            connect: allergyIds.map((id) => ({ id })),
          },
          preferredDishes: {
            connect: mealConnections.filter(
              (connection) => connection !== undefined
            ),
          },
          preferredDrinks: {
            connect: drinkConnections.filter(
              (connection) => connection !== undefined
            ),
          },
          event: { connect: { id: event.id } },
        },
        include: {
          allergies: { select: { name: true } },
          preferredDishes: { select: { name: true } },
          preferredDrinks: { select: { name: true } },
        },
      });

      await prisma.event.update({
        where: { id: event.id },
        data: {
          slotTaken: slotTaken + totalGuest,
          availableSlot:
            availableSlot !== null
              ? availableSlot - totalGuest
              : maxNumberOfGuests - slotTaken - totalGuest,
        },
      });

      // return guest;
    });

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "An error occurred while registering for the event." };
  }
};

export const getAllEventGuest = async (
  id: string
): Promise<ResponseType<GuestResponseType[]>> => {
  try {
    const session = await auth();
    const { id: userId } = session?.user || {};

    if (!userId) {
      throw new Error("Not authenticated.");
    }

    const guests = await prisma.guest.findMany({
      where: {
        eventId: id,
      },
      include: {
        allergies: { select: { name: true } },
        preferredDishes: { select: { name: true } },
        preferredDrinks: { select: { name: true } },
      },
    });

    if (guests.length === 0) {
      return { data: [] };
    }

    const formattedGuestData = guests.map((guest) => ({
      id: guest.id,
      firstName: guest.firstName,
      lastName: guest.lastName,
      fullName: `${guest.firstName} ${guest.lastName}`,
      email: guest.email,
      phoneNumber: guest.phoneNumber,
      age: guest.age,
      nationality: guest.nationality,
      comingWithExtra: guest.comingWithExtra,
      numberOfExtra: guest.numberOfExtra,
      numberOfAdults: guest.numberOfAdults,
      numberOfMinors: guest.numberOfMinors,
      extraType: guest.extraType,
      mealSize: guest.mealSize,
      eventId: guest.eventId,
      preferredDishes: guest.preferredDishes.map((meal) => meal.name),
      preferredDrinks: guest.preferredDrinks.map((drink) => drink.name),
      dietary: guest.dietary,
      allergies: guest.allergies.map((allergy) => allergy.name),
      createdAt: guest.createdAt,
      updatedAt: guest.updatedAt,
    }));

    return { success: true, data: formattedGuestData };
  } catch (error) {
    console.error("Get guest error:", error);
    return {
      error: "An error occurred while fetching the guest. Please try again.",
    };
  }
};

export const getAllAllergies = async (): Promise<ResponseType<string[]>> => {
  try {
    const allergies = await prisma.allergy.findMany({
      select: { name: true },
    });

    if (allergies.length === 0) {
      return { data: [] };
    }

    return { success: true, data: allergies.map((allergy) => allergy.name) };
  } catch (error) {
    console.error("Get allergies error:", error);
    return {
      error:
        "An error occurred while fetching the allergies. Please try again.",
    };
  }
};

export const createAllergy = async (
  name: string
): Promise<ResponseType<string>> => {
  try {
    const existingAllergy = await prisma.allergy.findFirst({
      where: {
        name: {
          mode: "insensitive",
          equals: name,
        },
      },
    });

    if (existingAllergy) {
      return { error: "Allergy already exists." };
    }
    const allergy = await prisma.allergy.create({ data: { name } });

    revalidatePath("/");
    return { success: true, data: allergy.name };
  } catch (error) {
    console.error("Create allergy error:", error);
    return {
      error: "An error occurred while creating the allergy. Please try again.",
    };
  }
};
