import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { APP_NAME } from "@/lib/constants";
import { auth } from "@/auth";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CredentialsSignInForm from "./credentials-signin-form";
import { redirect } from "next/navigation";
import prisma from "@/../prisma/db";

export const metadata: Metadata = {
  title: "Sign in",
};

async function signinPage(props: {
  searchParams: Promise<{ callbackUrl: string }>;
}) {
  const { callbackUrl } = await props.searchParams;
  const session = await auth();

  if (session) {
    return redirect(callbackUrl || "/");
  }
  const settings = await prisma.adminSettings.findMany({
    where: {
      category: "GLOBAL",
      subCategory: "header",
    },
    orderBy: {
      order: "asc",
    },
  });

  const logo = settings?.find((item) => item.type === "logo");
  const name = settings?.find((item) => item.type === "name");

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href={`/`} className="flex-center">
            <Image
              src={logo?.value || ""}
              width={100}
              height={100}
              alt={`${APP_NAME} logo`}
              priority={true}
            />
          </Link>
          <CardTitle className="text-center">
            {name?.value ? name?.value : APP_NAME}
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CredentialsSignInForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default signinPage;
