import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";
import { fetchUser } from "@/lib/fetchUserData";

import UserProfileForm from "@/components/forms/UserProfileForm";

export const metadata: Metadata = {
  title: "User Profile",
};

export default async function UserProfileSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <div className="max-w-4xl mt-16 mx-auto space-y-4">
        <h1>No user found</h1>
      </div>
    );
  }

  const userId = session?.user.id;

  try {
    const { user } = await fetchUser(userId);

    return (
      <SessionProvider session={session}>
        <div className="max-w-4xl mt-16 mx-auto space-y-4">
          <UserProfileForm user={user} />
        </div>
      </SessionProvider>
    );
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return (
      <div className="max-w-4xl mt-16 mx-auto space-y-4">
        <h1>Error loading profile</h1>
        <p>Unable to load user profile. Please try again later.</p>
      </div>
    );
  }
}
