"use client";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { storiesSchema } from "@/ValidationSchemas/stories";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

type StoryFormData = z.infer<typeof storiesSchema>;

const StoryForm = () => {
  const form = useForm<StoryFormData>({
    resolver: zodResolver(storiesSchema),
  });

  async function onSubmit(values: z.infer<typeof storiesSchema>) {
    console.log(values);
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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Story Title..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Controller
            name="description"
            control={form.control}
            render={({ field }) => (
              <SimpleMDE
                placeholder={"Description"}
                {...field}
                defaultValue={field.value}
              />
            )}
          />
          <div className="flex w-full space-x-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value || "UPCOMING"}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UPCOMING">Upcoming</SelectItem>
                        <SelectItem value="ONGOING">Ongoing</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={(field.value ?? 1).toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Rating..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="storyTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Story Time</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0000 - 9999"
                      {...field}
                      max={9999}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input
                    placeholder="This will turn into an upload field eventually"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input
                    placeholder="This will turn into a dynamic cat dropdown later"
                    {...field}
                    defaultValue={field.value}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default StoryForm;
