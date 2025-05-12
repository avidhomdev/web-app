"use client";

import { ConfirmModal } from "@/components/confirm-modal";
import initialFormState, {
  TInitialFormState,
} from "@/constants/initial-form-state";
import { useUserContext } from "@/contexts/user";
import { IJobMessage } from "@/types/job";
import { createClient } from "@/utils/supabase/client";
import { Avatar, Button, Card, Spinner, TextInput } from "flowbite-react";
import { SendIcon, Trash2Icon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { CreateJobMessage, DeleteJobMessage } from "./actions";

import getInitials from "@/utils/get-initials";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type TJobMessages = {
  messages: IJobMessage[] | null;
};

function SendMessageButton() {
  const { pending } = useFormStatus();

  return (
    <div>
      <Button disabled={pending} color="light" type="submit" size="sm">
        {pending ? (
          <Spinner size="sm" />
        ) : (
          <SendIcon className="text-gray-400" />
        )}
      </Button>
    </div>
  );
}

export default function JobMessagesCard({ messages }: TJobMessages) {
  const supabase = createClient();
  const router = useRouter();
  const { businessId, locationId, jobId } = useParams();
  const { user } = useUserContext();
  const [, action] = useActionState(
    CreateJobMessage<TInitialFormState>,
    initialFormState,
  );

  const ref = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const channel = supabase
      .channel("job_message_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "business_location_job_messages",
          filter: `job_id=eq.${jobId}`,
        },
        () => {
          router.refresh();
          if (messageInputRef.current) {
            messageInputRef.current.value = "";
          }
        },
      )
      .subscribe();

    if (ref.current) ref.current?.scrollTo(0, ref.current.scrollHeight);

    return () => {
      channel.unsubscribe();
    };
  }, [jobId, router, messageInputRef, ref, supabase]);

  return (
    <Card>
      <h6 className="text-lg font-semibold tracking-tighter">Notes</h6>
      <div
        className="flex h-full max-h-96 w-full flex-col-reverse gap-4 overflow-y-auto"
        ref={ref}
      >
        {messages?.map((message) => {
          const isAuthor = user.id === message.author_id;

          return (
            <div key={message.id} className="flex w-full items-start gap-3">
              <Avatar
                placeholderInitials={getInitials(
                  message.author?.full_name ?? "",
                )}
                rounded
                size="md"
              />
              <div className="group grid w-full gap-2 rounded-sm bg-gray-50 p-3 dark:bg-gray-700">
                <div className="relative flex justify-between gap-2">
                  <p className="font-semibold">{message.author?.full_name}</p>
                  <time
                    className="text-xs text-gray-400"
                    dateTime={dayjs(message.created_at).format(
                      "YYYY-MM-DDTHH:mm",
                    )}
                  >
                    {dayjs(message.created_at).fromNow()}
                  </time>
                  {isAuthor && (
                    <button
                      aria-label="Delete"
                      className="absolute right-0 top-5 hidden cursor-pointer rounded-sm bg-white/30 p-1 hover:bg-white group-hover:block dark:bg-gray-800/30 dark:hover:bg-gray-800"
                    >
                      <ConfirmModal
                        description={`Are you sure you want to remove this message?`}
                        onConfirmClick={async () => {
                          await DeleteJobMessage(message.id);
                          router.refresh();
                        }}
                        trigger={(toggle) => (
                          <span onClick={toggle}>
                            <Trash2Icon className="text-red-500 dark:text-red-600" />
                          </span>
                        )}
                      />
                    </button>
                  )}
                </div>
                <p className="text-gray-400">{message.message}</p>
              </div>
            </div>
          );
        })}
      </div>
      <form action={action} className="group relative">
        <input name="business_id" value={businessId} type="hidden" />
        <input name="location_id" value={locationId} type="hidden" />
        <input name="job_id" value={jobId} type="hidden" />
        <input name="author_id" value={user.id} type="hidden" />
        <div className="group flex items-center gap-3">
          <Avatar
            placeholderInitials={getInitials(user.full_name ?? "")}
            size="md"
            rounded
          />
          <TextInput
            autoComplete="off"
            ref={messageInputRef}
            className="w-full rounded-xs"
            tabIndex={0}
            name="message"
          />
          <SendMessageButton />
        </div>
      </form>
    </Card>
  );
}
