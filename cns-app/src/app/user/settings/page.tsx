import { Metadata } from "next";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import UserSettingsForm from "./settings-form";

export const metadata: Metadata = {
  title: "User Settings",
};

async function userSettingsPage() {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="h2-bold text-center">Settings</h2>
        <UserSettingsForm />
      </div>
    </SessionProvider>
  );
}

export default userSettingsPage;
