"use client";
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
import { Trash } from "lucide-react";

interface Props {
  objectId: number;
  type: string;
  path: string;
  redirect: string;
}

const DeleteButton = ({ objectId, type, path, redirect }: Props) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteObject = async () => {
    try {
      setIsDeleting(true);
      await axios.delete(`/api/${path}/${objectId}`);
      router.push(`${redirect}`);
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
          className={`${buttonVariants({
            variant: "destructive",
          })} text-xs p-1`}
          disabled={isDeleting}
        >
          <Trash />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              {type}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({
                variant: "destructive",
              })}
              disabled={isDeleting}
              onClick={deleteObject}
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
