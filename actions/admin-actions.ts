"use server";

import { UserRole, AdminType, ChefType } from "@prisma/client";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { UserResponseType } from "@/types";
import { ResponseType } from "./user-actions";

export const getAllUsers = async (): Promise<
  ResponseType<UserResponseType[]>
> => {
  try {
    const session = await auth();
    const { id: userId, role } = session?.user || {};

    if (!userId || role !== UserRole.ADMIN) {
      throw new Error("Unauthorized access. Please log in as an admin.");
    }

    // Get the admin profile to determine the admin type
    const adminProfile = await prisma.adminProfile.findUnique({
      where: {
        userId,
      },
    });

    if (!adminProfile) {
      throw new Error("Admin profile not found.");
    }

    const users = await prisma.user.findMany({
      where:
        adminProfile.type === AdminType.ADMIN
          ? {
              admin: null,
            }
          : {}, // If SUPER_ADMIN, return all users
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        organizer: {
          select: {
            id: true,
          },
        },
        admin: {
          select: {
            type: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    if (users.length === 0) {
      return { data: [] };
    }

    // Format the user data
    const formattedUsers = users
      .filter((user) => user.admin?.type !== AdminType.SUPER_ADMIN)
      .map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role ?? (user.organizer ? "ORGANIZER" : "USER"),
        createdAt: format(new Date(user.createdAt), "PPP p"),
      }));

    return { success: true, data: formattedUsers };
  } catch (error) {
    console.error("Get all users error:", error);
    return {
      error: "An error occurred while fetching users. Please try again later.",
    };
  }
};

export const getUser = async (
  id: string
): Promise<ResponseType<UserResponseType>> => {
  try {
    const session = await auth();
    const { id: userId, role } = session?.user || {};

    if (!userId || role !== UserRole.ADMIN) {
      throw new Error("Unauthorized access. Please log in as an admin.");
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        organizer: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      return { error: "User not found." };
    }

    // Format the user data
    const formattedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role ?? (user.organizer ? "ORGANIZER" : "USER"),
      createdAt: format(new Date(user.createdAt), "PPP p"),
    };

    return { success: true, data: formattedUser };
  } catch (error) {
    console.error("Get user error:", error);
    return {
      error: "An error occurred while fetching user. Please try again later.",
    };
  }
};

export const assignChefRole = async (
  id: string,
  chefType: ChefType
): Promise<ResponseType> => {
  try {
    const session = await auth();
    const { id: userId, role } = session?.user || {};

    if (!userId && role !== UserRole.ADMIN) {
      throw new Error("Not authenticated.");
    }

    await prisma.user.update({
      where: { id },
      data: { role: UserRole.CHEF, chefType },
    });

    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Assign chef role error:", error);
    return {
      error:
        "An error occurred while assigning the chef role. Please try again.",
    };
  }
};

export const assignUserRole = async (
  id: string,
  userRole: UserRole
): Promise<ResponseType> => {
  try {
    const session = await auth();
    const { id: userId, role } = session?.user || {};

    if (!userId || role !== UserRole.ADMIN) {
      throw new Error("Not authenticated.");
    }

    // Get the admin profile to determine the admin type
    const adminProfile = await prisma.adminProfile.findUnique({
      where: {
        userId,
      },
    });

    if (!adminProfile) {
      throw new Error("Admin profile not found.");
    }

    // Check if the logged-in user is not a SUPER_ADMIN and trying to assign the ADMIN role
    if (
      userRole === UserRole.ADMIN &&
      adminProfile.type !== AdminType.SUPER_ADMIN
    ) {
      throw new Error("Only super admins can assign the admin role.");
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    // Update the user's role
    await prisma.user.update({
      where: { id },
      data: { role: userRole },
    });

    // Automatically create an AdminProfile if the role is set to ADMIN
    if (userRole === UserRole.ADMIN) {
      await prisma.adminProfile.upsert({
        where: { userId: id },
        update: {}, // Do nothing if the profile already exists
        create: {
          userId: id,
          type: AdminType.ADMIN,
        },
      });
    }

    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Assign user role error:", error);
    return {
      error:
        "An error occurred while assigning the user role. Please try again.",
    };
  }
};

export const deleteUser = async (id: string): Promise<ResponseType> => {
  try {
    const session = await auth();
    const { id: userId, role } = session?.user || {};

    if (!userId || role !== UserRole.ADMIN) {
      throw new Error("Not authenticated.");
    }

    // Get the admin profile to determine the admin type
    const adminProfile = await prisma.adminProfile.findUnique({
      where: {
        userId,
      },
    });

    if (!adminProfile) {
      throw new Error("Admin profile not found.");
    }

    // Check if the user to be deleted is an admin
    const userToDelete = await prisma.user.findUnique({
      where: { id },
      include: {
        admin: true,
      },
    });

    if (!userToDelete) {
      throw new Error("User not found.");
    }

    // Prevent deletion of other admins by non-super admins
    if (adminProfile.type === AdminType.ADMIN && userToDelete.admin !== null) {
      throw new Error("You do not have permission to delete other admins.");
    }

    // Proceed to delete the user
    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Delete user error:", error);
    return {
      error: "An error occurred while deleting the user. Please try again.",
    };
  }
};
