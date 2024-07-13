"use client";

import { Form, FormField, FormItem, FormLabel } from "../ui/form";
import { storiesSchema } from "@/ValidationSchemas/stories";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type StoryFormData = z.infer<typeof storiesSchema>;

const StoryForm = () => {
  const form = useForm<StoryFormData>({
    resolver: zodResolver(storiesSchema),
  });

  async function onSubmit(values: z.infer<typeof storiesSchema>) {
    console.log(values);
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default StoryForm;
