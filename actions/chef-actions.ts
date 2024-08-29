"use server";

import { ChefType, Cuisine, Department, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { ResponseType } from "./user-actions";
import {
  CreateChefProfileValues,
  CreateCuisineValues,
  UpdateChefProfileValues,
  UpdateCuisineValues,
} from "@/schema/chef";
import { ChefProfileResponseType } from "@/types";

export const assignDepartment = async (
  chefId: string,
  department: Department
): Promise<ResponseType> => {
  try {
    const session = await auth();
    const { id: userId, role, chefType } = session?.user || {};

    if (
      !userId &&
      (role !== UserRole.ADMIN || chefType !== ChefType.EXECUTIVE_CHEF)
    ) {
      throw new Error("Unauthorized.");
    }

    await prisma.chefProfile.update({
      where: { id: chefId },
      data: { department },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Assign department error:", error);
    return {
      error:
        "An error occurred while assigning the department. Please try again.",
    };
  }
};

export const createChefProfile = async (
  values: CreateChefProfileValues
): Promise<ResponseType> => {
  try {
    const session = await auth();
    const { id: userId, role, chefType } = session?.user || {};

    if (!userId && role !== UserRole.CHEF && !chefType) {
      throw new Error("Unauthorized");
    }

    const { nationality, specialty, cuisines } = values;

    const existingChefProfile = await prisma.chefProfile.findUnique({
      where: { userId },
    });

    const cuisineConnections = await Promise.all(
      cuisines.map(async (cuisine) => {
        const existingCuisine = await prisma.cuisine.findFirst({
          where: {
            name: {
              mode: "insensitive",
              equals: cuisine,
            },
          },
        });

        if (existingCuisine) {
          return { id: existingCuisine.id };
        }
      })
    );

    if (existingChefProfile) {
      throw new Error("Chef profile already exists.");
    }

    await prisma.chefProfile.create({
      data: {
        userId: userId as string,
        nationality,
        specialty,
        role: chefType as ChefType,
        cuisines: {
          connect: cuisineConnections.filter(
            (connection) => connection !== undefined
          ),
        },
      },
      include: {
        cuisines: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/chef/profile");
    return { success: true };
  } catch (error) {
    console.error("Create chef profile error:", error);
    return {
      error:
        "An error occurred while creating the chef profile. Please try again.",
    };
  }
};

export const getChefProfile = async (): Promise<
  ResponseType<ChefProfileResponseType>
> => {
  try {
    const session = await auth();
    const { id: userId } = session?.user || {};

    if (!userId) {
      throw new Error("Not authenticated.");
    }

    const chefProfile = await prisma.chefProfile.findUnique({
      where: { userId },
      include: {
        cuisines: {
          select: { name: true },
        },
        user: { select: { name: true } },
      },
    });

    if (!chefProfile) {
      return { error: "Chef profile not found." };
    }

    const formattedChefProfile = {
      id: chefProfile.id,
      name: chefProfile.user.name,
      nationality: chefProfile.nationality,
      specialty: chefProfile.specialty,
      role: chefProfile.role,
      cuisines: chefProfile.cuisines.map((cuisine) => cuisine.name),
      department: chefProfile.department,
      createdAt: chefProfile.createdAt,
      updatedAt: chefProfile.updatedAt,
      userId: chefProfile.userId,
    };

    return { success: true, data: formattedChefProfile };
  } catch (error) {
    console.error("Get chef profile error:", error);
    return {
      error:
        "An error occurred while fetching the chef profile. Please try again.",
    };
  }
};

export const getChefProfileById = async (
  id: string
): Promise<ResponseType<ChefProfileResponseType>> => {
  try {
    const session = await auth();
    const { id: userId, role, chefType } = session?.user || {};

    if (!userId) {
      throw new Error("Unauthorized.");
    }

    if (role === UserRole.ADMIN) {
      const chefProfile = await prisma.chefProfile.findUnique({
        where: { id },
        include: {
          cuisines: {
            select: { name: true },
          },
          user: { select: { name: true } },
        },
      });

      if (!chefProfile) {
        return { error: "Chef profile not found." };
      }

      const formattedChefProfile = {
        id: chefProfile.id,
        name: chefProfile.user.name,
        nationality: chefProfile.nationality,
        specialty: chefProfile.specialty,
        role: chefProfile.role,
        cuisines: chefProfile.cuisines.map((cuisine) => cuisine.name),
        department: chefProfile.department,
        createdAt: chefProfile.createdAt,
        updatedAt: chefProfile.updatedAt,
        userId: chefProfile.userId,
      };

      return { success: true, data: formattedChefProfile };
    } else if (chefType === ChefType.EXECUTIVE_CHEF) {
      const chefProfile = await prisma.chefProfile.findUnique({
        where: {
          id: id,
          role: {
            not: ChefType.EXECUTIVE_CHEF,
          },
        },
        include: {
          cuisines: {
            select: { name: true },
          },
          user: { select: { name: true } },
        },
      });

      if (!chefProfile) {
        return { error: "Chef profile not found." };
      }

      const formattedChefProfile = {
        id: chefProfile.id,
        name: chefProfile.user.name,
        nationality: chefProfile.nationality,
        specialty: chefProfile.specialty,
        role: chefProfile.role,
        cuisines: chefProfile.cuisines.map((cuisine) => cuisine.name),
        department: chefProfile.department,
        createdAt: chefProfile.createdAt,
        updatedAt: chefProfile.updatedAt,
        userId: chefProfile.userId,
      };

      return { success: true, data: formattedChefProfile };
    } else {
      throw new Error("Unauthorized.");
    }
  } catch (e) {
    console.error("Get chef profile error:", e);
    return {
      error:
        "An error occurred while fetching the chef profile. Please try again.",
    };
  }
};

export const getAllChefProfiles = async (): Promise<
  ResponseType<ChefProfileResponseType[]>
> => {
  try {
    const session = await auth();
    const { id: userId, role, chefType } = session?.user || {};

    if (!userId) {
      throw new Error("Unauthenticated");
    }

    if (role === UserRole.ADMIN) {
      const chefProfiles = await prisma.chefProfile.findMany({
        include: {
          cuisines: {
            select: { name: true },
          },
          user: { select: { name: true } },
        },
      });

      if (!chefProfiles) {
        return { data: [], error: "Chef profile not found." };
      }

      const formattedChefProfiles = chefProfiles.map((chefProfile) => ({
        name: chefProfile.user.name,
        id: chefProfile.id,
        nationality: chefProfile.nationality,
        specialty: chefProfile.specialty,
        role: chefProfile.role,
        cuisines: chefProfile.cuisines.map((cuisine) => cuisine.name),
        department: chefProfile.department,
        createdAt: chefProfile.createdAt,
        updatedAt: chefProfile.updatedAt,
        userId: chefProfile.userId,
      }));

      return { success: true, data: formattedChefProfiles };
    } else if (chefType === ChefType.EXECUTIVE_CHEF) {
      const chefProfiles = await prisma.chefProfile.findMany({
        where: {
          role: {
            not: ChefType.EXECUTIVE_CHEF,
          },
        },
        include: {
          cuisines: {
            select: { name: true },
          },
          user: { select: { name: true } },
        },
      });

      if (!chefProfiles) {
        return { data: [], error: "Chef profile not found." };
      }

      const formattedChefProfiles = chefProfiles.map((chefProfile) => ({
        name: chefProfile.user.name,
        id: chefProfile.id,
        nationality: chefProfile.nationality,
        specialty: chefProfile.specialty,
        role: chefProfile.role,
        cuisines: chefProfile.cuisines.map((cuisine) => cuisine.name),
        department: chefProfile.department,
        createdAt: chefProfile.createdAt,
        updatedAt: chefProfile.updatedAt,
        userId: chefProfile.userId,
      }));

      return { success: true, data: formattedChefProfiles };
    } else {
      throw new Error("Unauthorized");
    }
  } catch (error) {
    console.error("Get all chef profiles error:", error);
    return {
      error:
        "An error occurred while fetching the chef profiles. Please try again.",
    };
  }
};

export const updateChefProfile = async (
  data: UpdateChefProfileValues
): Promise<ResponseType> => {
  try {
    const session = await auth();
    const { id: userId } = session?.user || {};

    if (!userId) {
      throw new Error("Not authenticated.");
    }

    const { cuisines } = data;
    const existingChefProfile = await prisma.chefProfile.findUnique({
      where: { userId },
    });

    if (!existingChefProfile) {
      throw new Error("Chef profile not found.");
    }

    const cuisineConnections =
      cuisines &&
      (await Promise.all(
        cuisines.map(async (cuisine) => {
          const existingCuisine = await prisma.cuisine.findFirst({
            where: {
              name: {
                mode: "insensitive",
                equals: cuisine,
              },
            },
          });

          if (existingCuisine) {
            return { id: existingCuisine.id };
          }
        })
      ));

    await prisma.chefProfile.update({
      where: { userId },
      data: {
        ...data,
        cuisines: {
          connect:
            cuisineConnections &&
            cuisineConnections.filter((connection) => connection !== undefined),
        },
      },
      include: {
        cuisines: {
          select: { name: true },
        },
      },
    });

    revalidatePath("/dashboard/chef/profile");

    return { success: true };
  } catch (error) {
    console.error("Update chef profile error:", error);
    return {
      error:
        "An error occurred while updating the chef profile. Please try again.",
    };
  }
};

export const deleteChefProfile = async (): Promise<ResponseType> => {
  try {
    const session = await auth();
    const { id: userId } = session?.user || {};

    if (!userId) {
      throw new Error("Not authenticated.");
    }
    const existingChefProfile = await prisma.chefProfile.findUnique({
      where: { userId },
    });

    if (!existingChefProfile) {
      throw new Error("Chef profile not found.");
    }

    await prisma.chefProfile.delete({ where: { userId } });

    revalidatePath("/dashboard/chef/profile");

    return { success: true };
  } catch (error) {
    console.error("Delete chef profile error:", error);
    return {
      error:
        "An error occurred while deleting the chef profile. Please try again.",
    };
  }
};

export const createCuisine = async (
  data: CreateCuisineValues
): Promise<ResponseType<Cuisine>> => {
  try {
    const session = await auth();
    const { id: userId, role } = session?.user || {};

    if (!userId || !role) {
      throw new Error("Not authenticated.");
    }

    const { name } = data;

    const existingCuisine = await prisma.cuisine.findFirst({
      where: {
        name: {
          mode: "insensitive",
          equals: name,
        },
      },
    });

    if (existingCuisine) {
      throw new Error("Cuisine already exists.");
    }

    const cuisine = await prisma.cuisine.create({
      data: {
        name,
      },
    });
    revalidatePath("/dashboard/chef/profile");
    return { success: true, data: cuisine };
  } catch (error) {
    console.error("Create cuisine error:", error);
    return {
      error: "An error occurred while creating the cuisine. Please try again.",
    };
  }
};

export const getAllCuisines = async (): Promise<ResponseType<string[]>> => {
  try {
    const session = await auth();
    const { id: userId, role } = session?.user || {};

    if (!userId || !role) {
      throw new Error("Not authenticated.");
    }

    const cuisines = await prisma.cuisine.findMany({
      orderBy: { name: "asc" },
    });

    if (cuisines.length === 0) {
      return { data: [], error: "No cuisines found." };
    }

    const formattedCuisines = cuisines.map((cuisine) => cuisine.name);

    return { success: true, data: formattedCuisines };
  } catch (error) {
    console.error("Get cuisines error:", error);
    return {
      error:
        "An error occurred while fetching cuisines. Please try again later.",
    };
  }
};

export const getCuisine = async (
  id?: string,
  name?: string
): Promise<ResponseType<Cuisine>> => {
  try {
    const session = await auth();
    const { id: userId, role } = session?.user || {};

    if (!userId || !role) {
      throw new Error("Not authenticated.");
    }

    const cuisine = await prisma.cuisine.findFirst({
      where: { OR: [{ id }, { name: { mode: "insensitive", equals: name } }] },
    });

    return { success: true, data: cuisine };
  } catch (error) {
    console.error("Get cuisine error:", error);
    return {
      error: "An error occurred while fetching the cuisine. Please try again.",
    };
  }
};

export const updateCuisine = async (
  id: string,
  data: UpdateCuisineValues
): Promise<ResponseType<Cuisine>> => {
  try {
    const session = await auth();
    const { id: userId, role } = session?.user || {};

    if (!userId || !role) {
      throw new Error("Not authenticated.");
    }

    const { name } = data;

    const existingCuisine = await prisma.cuisine.findUnique({
      where: { id },
    });

    if (!existingCuisine) {
      throw new Error("Cuisine not found.");
    }

    if (existingCuisine.name === name) {
      throw new Error("Cuisine already exists.");
    }

    const cuisine = await prisma.cuisine.update({
      where: { id },
      data: {
        name,
      },
    });
    return { success: true, data: cuisine };
  } catch (error) {
    console.error("Update cuisine error:", error);
    return {
      error: "An error occurred while updating the cuisine. Please try again.",
    };
  }
};
