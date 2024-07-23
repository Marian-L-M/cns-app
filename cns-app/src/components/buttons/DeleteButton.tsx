"use client";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "../ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

Link;

const DeleteButton = ({ storyId }: { storyId: number }) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteStory = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(`/api/entry/${storyId}`);
      router.push("/stories");
      router.refresh();
    } catch (error) {
      setIsDeleting(false);
      setError("Unknown error occurred");
    }
  };
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger
          className={buttonVariants({
            variant: "destructive",
          })}
          disabled={isDeleting}
        >
          Delete Story
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              Story.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({
                variant: "destructive",
              })}
              disabled={isDeleting}
              onClick={deleteStory}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <p className="text-destructive">{error}</p>
    </>
  );
};

export default DeleteButton;
