"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { userSchema } from "@/ValidationSchemas/users";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import DeleteUserButton from "@/components/buttons/DeleteUserButton";
import Link from "next/link";
import { toast } from "sonner";

type UserFormData = z.infer<typeof userSchema>;

interface Props {
  user?: User;
}

export default function UserAdminForm({ user }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  async function onSubmit(values: z.infer<typeof userSchema>) {
    try {
      setIsSubmitting(true);
      setError("");
      if (user) {
        await axios.patch(`/api/users/${user.id}`, values);
        router.push(`/admin/users/${user.id}`);
        router.refresh();
        toast.success("User updated succesfully");
      } else {
        const response = await axios.post("/api/users", values);
        const newUser = response.data;
        router.push(`/admin/users/${newUser.id}`);
        router.refresh();
        toast.success("User created succesfully");
      }
      setIsSubmitting(false);
    } catch (error) {
      setError("Unknown error occurred");
      setIsSubmitting(false);
      toast.error("User update failed", {
        className: "error",
        description: `ERROR! ${error}`,
      });
    }
  }
  return (
    <div className="rounded-md border w-full p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="name"
            defaultValue={user?.name || ""}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Full Name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            defaultValue={user?.email || ""}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Email" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            defaultValue=""
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    required={user ? false : true}
                    placeholder="Enter Password"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex w-full space-x-4">
            <FormField
              control={form.control}
              name="role"
              defaultValue={user?.role}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Status..."
                          defaultValue={user?.role}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="AUTHOR">Author</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
          <div id="btn-container" className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {user ? "Update User" : "Submit User"}
              </Button>
              {user && (
                <Link href={`/admin/users/${user?.id}/profile`}>
                  <Button variant={"outline"}>Profile</Button>
                </Link>
              )}
            </div>
            <div className="flex items-center gap-2">
              {user && (
                <DeleteUserButton
                  objectId={user.id}
                  type="User account"
                  path="users"
                  redirect={`/admin/users`}
                />
              )}
            </div>
          </div>
        </form>
      </Form>
      <p className="text-destructive">{error}</p>
    </div>
  );
}
