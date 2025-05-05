import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";
import UserProfileSettingsForm from "./profile-form";
import { fetchUserProfile } from "@/lib/fetchUserData";

export const metadata: Metadata = {
  title: "User Profile",
};

async function UserProfileSettingsPage() {
  const session = await auth();
  const profile = await fetchUserProfile(session?.user?.id);

  return (
    <SessionProvider session={session}>
      <div className="max-w-3xl mx-auto space-y-4">
        <h2 className="h2-bold text-center">Profile</h2>
        <UserProfileSettingsForm profile={profile} />
      </div>
    </SessionProvider>
  );
}

export default UserProfileSettingsPage;
