"use client";

import { ConfirmModal } from "@/components/confirm-modal";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { DeleteJobMedia } from "./actions";

export default function DeleteMediaModal({ id }: { id: number }) {
  const router = useRouter();

  return (
    <ConfirmModal
      description={`Are you sure you want to delete this?`}
      onConfirmClick={async () => {
        await DeleteJobMedia(id);
        router.refresh();
      }}
      trigger={(toggle) => (
        <div
          className="cursor-pointer rounded-sm bg-white p-1 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
          onClick={toggle}
        >
          <Trash2Icon className="size-4 text-red-500" />
        </div>
      )}
    />
  );
}
