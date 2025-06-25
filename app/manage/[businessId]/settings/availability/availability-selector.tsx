"use client";
import {
  createContext,
  PropsWithChildren,
  use,
  useCallback,
  useMemo,
  useState,
  useTransition,
} from "react";

import { useUserContext } from "@/contexts/user";
import dayjs from "dayjs";
import { Button, ButtonGroup, Card } from "flowbite-react";
import { useParams } from "next/navigation";
import { UpdateBusinessProfileAvailability } from "./action";
import { AvailabilityObjectType } from "./page";

type ToggleSlotTimeProps = {
  day: string;
  timeKey: number;
};

const AvailabilityContext = createContext<{
  availability: AvailabilityObjectType | null;
  cancelEditing: () => void;
  isEditing: boolean;
  isSaving: boolean;
  save: () => void;
  slots: AvailabilityObjectType;
  toggleSlotTime: (args: ToggleSlotTimeProps) => void;
} | null>(null);

const generateDefaultSchedule = () => {
  const hours = Array.from({ length: 8 }).reduce<Record<number, boolean>>(
    (agg, _, cur) => {
      agg[cur + 9] = true;
      return agg;
    },
    {},
  );

  return {
    Sunday: {},
    Monday: hours,
    Tuesday: hours,
    Wednesday: hours,
    Thursday: hours,
    Friday: hours,
    Saturday: {},
  };
};

const AvailabilityProvider = ({
  children,
  availability,
}: PropsWithChildren<{
  availability: AvailabilityObjectType | null;
}>) => {
  const [isEditing, setIsEditing] = useState(false);
  const { businessId } = useParams();
  const { user } = useUserContext();
  const [isSaving, startSaving] = useTransition();
  const defaultSlots = availability || generateDefaultSchedule();
  const [slots, setSlots] = useState<AvailabilityObjectType>(defaultSlots);

  const handleToggleSlotTime = useCallback(
    ({ day, timeKey }: ToggleSlotTimeProps) => {
      setIsEditing(true);
      return setSlots((prevState) => {
        const dayKey = day as keyof typeof slots;

        return {
          ...prevState,
          [dayKey]: {
            ...prevState[dayKey],
            [timeKey]: !prevState[dayKey][timeKey],
          },
        };
      });
    },
    [],
  );

  const handleSave = useCallback(() => {
    startSaving(() => {
      if (slots)
        UpdateBusinessProfileAvailability({
          availability: slots,
          businessId: businessId as string,
          profileId: user.id,
        }).finally(() => setIsEditing(false));
    });
  }, [businessId, slots, user.id]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setSlots(defaultSlots);
  }, [defaultSlots]);

  const value = useMemo(
    () => ({
      availability,
      cancelEditing,
      isEditing,
      isSaving,
      toggleSlotTime: handleToggleSlotTime,
      save: handleSave,
      slots,
    }),
    [
      availability,
      cancelEditing,
      isEditing,
      isSaving,
      handleToggleSlotTime,
      handleSave,
      slots,
    ],
  );

  return (
    <AvailabilityContext.Provider value={value}>
      {children}
    </AvailabilityContext.Provider>
  );
};

function DayOfWeekColumn({ day }: { day: string }) {
  const { slots = {}, toggleSlotTime = () => {} } =
    use(AvailabilityContext) || {};
  const slot = slots[day];

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div>{day}</div>
      {Array.from({ length: 15 }, (_, num) => {
        const time = dayjs()
          .startOf("day")
          .set("hour", 6)
          .add(num * 1, "hour");

        const timeKey = time.get("hour");

        const hasTimeSlot = slot[timeKey];

        return (
          <Button
            color={hasTimeSlot ? "default" : "alternative"}
            key={time.toString()}
            onClick={() => toggleSlotTime({ day, timeKey })}
            size="sm"
          >
            {time.format("hh:mm a")}
          </Button>
        );
      })}
    </div>
  );
}

function Selector() {
  const { cancelEditing, isEditing, save, isSaving } =
    use(AvailabilityContext) || {};
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <>
      <div className="self-end">
        <ButtonGroup>
          {isEditing && (
            <Button color="alternative" onClick={cancelEditing}>
              Cancel
            </Button>
          )}
          <Button disabled={isSaving || !isEditing} onClick={save}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </ButtonGroup>
      </div>

      <div className="flex gap-2">
        {days.map((day) => (
          <DayOfWeekColumn key={day} day={day} />
        ))}
      </div>
    </>
  );
}

export default function AvailabilitySelector({
  availability,
}: {
  availability: AvailabilityObjectType | null;
}) {
  return (
    <AvailabilityProvider availability={availability}>
      <Card className="mx-auto">
        <Selector />
      </Card>
    </AvailabilityProvider>
  );
}
