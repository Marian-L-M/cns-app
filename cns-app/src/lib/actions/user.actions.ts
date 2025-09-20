"use server";
import { hashSync } from "bcryptjs";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { signIn, signOut, auth } from "@/auth";
import { formatError } from "@/lib/utils";
import prisma from "@/../prisma/db";
import { signInFormSchema, signUpFormSchema } from "@/ValidationSchemas/users";

// Sign in the user with credential
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!existingUser) {
      return { success: false, message: "Invalid email or password" };
    }

    if (existingUser.role === "INACTIVE") {
      return {
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      };
    }

    await signIn("credentials", user);

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: "invalid email or password" };
  }
}

// Sign user out
export async function signOutUser() {
  await signOut();
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    // backup plain password
    const plainPassword = user.password;

    // hash and overwrite password
    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    // Auto log in after signup
    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: "User registered succesfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: formatError(error) };
  }
}

// Update user settings
export async function updateUserSettings(user: {
  name: string;
  email: string;
}) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error("User not found");

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
      },
    });

    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update user settings
export async function updateOrCreateUserProfile(userProfile: {
  displayName: string;
  profileCatch?: string;
  profileDescription?: string;
  thumbnail?: string;
}) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error("User not found");

    const currentProfile = await prisma.userProfile.findFirst({
      where: {
        UserId: session?.user?.id,
      },
    });

    if (!currentProfile) {
      await prisma.userProfile.create({
        data: {
          UserId: currentUser.id,
          ...userProfile,
        },
      });
    } else if (currentProfile) {
      await prisma.userProfile.update({
        where: {
          UserId: currentUser.id,
        },
        data: {
          ...userProfile,
        },
      });
    }

    return {
      success: true,
      message: "User profile updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
