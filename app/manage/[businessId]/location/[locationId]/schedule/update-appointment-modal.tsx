import ErrorAlert from "@/components/error-alert";
import SubmitButton from "@/components/submit-button";
import initialFormState, {
  TInitialFormState,
} from "@/constants/initial-form-state";
import { useLocationContext } from "@/contexts/location";
import { DAYJS_DATETIME } from "@/enums/dayjs-formats";
import { dayjsLocalDate } from "@/utils/dayjs-helpers";
import dayjs, { Dayjs } from "dayjs";
import {
  Button,
  Card,
  Checkbox,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput,
  theme,
} from "flowbite-react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { DeleteAppointment, UpdateAppointment } from "./action";
import { AppointmentProfile, BusinessAppointment } from "./page";
import { useLocationInstallers } from "./use-location-installers";
import { ConfirmModal } from "@/components/confirm-modal";

export function UpdateAppointmentModal({
  close,
  day,
  appointment,
}: {
  close: () => void;
  day: Dayjs;
  appointment: BusinessAppointment;
}) {
  const {
    location: { profiles },
  } = useLocationContext();
  const startOfDayMinString = day.startOf("day").format(DAYJS_DATETIME);
  const endOfDayMinString = day.endOf("day").format(DAYJS_DATETIME);
  const [range, setRange] = useState({
    start: startOfDayMinString,
    end: endOfDayMinString,
  });
  const router = useRouter();

  const [state, action] = useActionState(UpdateAppointment<TInitialFormState>, {
    ...initialFormState,
    data: {
      business_id: appointment.business_id,
      id: appointment.id,
      location_id: appointment.location_id,
      job_id: appointment.job_id,
      start_datetime: dayjs(appointment.start_datetime)
        .set("day", day.get("day"))
        .format(DAYJS_DATETIME),
      end_datetime: dayjs(appointment.end_datetime)
        .set("day", day.get("day"))
        .format(DAYJS_DATETIME),
      profiles: appointment.profiles.reduce<Record<string, AppointmentProfile>>(
        (dictionary, profile) => {
          dictionary[profile.profile_id] = profile;
          return dictionary;
        },
        {},
      ),
    },
  });

  const installers = useLocationInstallers({
    businessId: appointment.business_id,
    locationId: Number(appointment.location_id),
    range,
  });

  useEffect(() => {
    if (state.success && state.data) {
      router.refresh();
      if (state.dismiss) close();
    }
  }, [state.success, state.dismiss, router, state.data, close]);

  const remove = useCallback(async () => {
    await DeleteAppointment(appointment.id);
    await router.refresh();
    close();
  }, [appointment.id, close, router]);

  return (
    <>
      <Modal dismissible show onClose={close}>
        <ModalHeader>
          <span>{`Change JOB-${appointment.job.id} appointment day to ${dayjsLocalDate(day)}`}</span>
        </ModalHeader>
        <ModalBody>
          {state.error && (
            <div className="my-4">
              <ErrorAlert message={state.error} />
            </div>
          )}
          <Card
            theme={{
              root: {
                base: twMerge(theme.card.root.base, " shadow-xs"),
                children: twMerge(theme.card.root.children, "p-3"),
              },
            }}
          >
            <ul className="grid gap-2">
              <li>{appointment.job.full_name}</li>
              <li>
                <b>Address:</b>
                <p className="ml-2 text-sm">
                  {appointment.job.address}
                  <br />
                  {`${appointment.job.city}, ${appointment.job.state}`}
                </p>
              </li>
            </ul>
          </Card>
          <br />
          <form
            action={action}
            className="grid gap-6"
            id="update-appointment-schedule"
          >
            <input type="hidden" name="id" value={state.data.id} />
            <input
              type="hidden"
              name="location_id"
              value={state.data.location_id}
            />
            <input type="hidden" name="job_id" value={state.data.job_id} />
            <input
              type="hidden"
              name="business_id"
              value={state.data.business_id}
            />
            <fieldset className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1">
                <Label>Start</Label>
                <TextInput
                  defaultValue={state.data.start_datetime}
                  min={startOfDayMinString}
                  max={endOfDayMinString}
                  name="start_datetime"
                  onChange={(e) =>
                    setRange((prevState) => ({
                      ...prevState,
                      start: e.target.value,
                    }))
                  }
                  required
                  type="datetime-local"
                />
              </div>
              <div className="grid gap-1">
                <Label>End</Label>
                <TextInput
                  defaultValue={state.data.end_datetime}
                  min={range.start}
                  max={endOfDayMinString}
                  name="end_datetime"
                  onChange={(e) =>
                    setRange((prevState) => ({
                      ...prevState,
                      end: e.target.value,
                    }))
                  }
                  required
                  type="datetime-local"
                />
              </div>
            </fieldset>
            <ul>
              {profiles.flatMap((profile) =>
                profile.is_installer ? (
                  <li key={profile.profile_id}>
                    <Label
                      className="flex items-center gap-2"
                      disabled={!installers[profile.profile_id!]}
                      htmlFor={profile.profile_id}
                    >
                      <Checkbox
                        defaultChecked={Boolean(
                          state.data.profiles[profile.profile_id!],
                        )}
                        disabled={!installers[profile.profile_id!]}
                        id={profile.profile_id}
                        name={`profiles__${profile.profile_id}__profile_id`}
                        value={profile.profile_id}
                      />
                      <span>
                        {profile.profile.full_name}
                        {!installers[profile.profile_id!] ? (
                          <small className="italic">
                            {" "}
                            (has overlapping appointment)
                          </small>
                        ) : (
                          ""
                        )}
                      </span>
                    </Label>
                  </li>
                ) : (
                  []
                ),
              )}
            </ul>
          </form>
        </ModalBody>
        <ModalFooter>
          <div className="flex grow items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <SubmitButton
                form="update-appointment-schedule"
                pendingText="Updating..."
              >
                Update
              </SubmitButton>
              <Button color="gray" onClick={close}>
                Cancel
              </Button>
            </div>
          </div>
          <ConfirmModal
            description={`Are you sure you want to remove this appointment?`}
            onConfirmClick={remove}
            trigger={(toggle) => (
              <span
                className="cursor-pointer text-lg text-red-500 active:opacity-50"
                onClick={toggle}
              >
                <Trash2 />
              </span>
            )}
          />
        </ModalFooter>
      </Modal>
    </>
  );
}
