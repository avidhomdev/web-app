import { ILocationJob, useLocationContext } from "@/contexts/location";
import { DAYJS_DATETIME } from "@/enums/dayjs-formats";
import dayjs, { Dayjs } from "dayjs";
import { useActionState, useEffect, useState } from "react";
import { AddJobToSchedule } from "./action";
import initialFormState, {
  TInitialFormState,
} from "@/constants/initial-form-state";
import { useLocationInstallers } from "./use-location-installers";
import { useRouter } from "next/navigation";
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
import { dayjsLocalDate } from "@/utils/dayjs-helpers";
import ErrorAlert from "@/components/error-alert";
import { twMerge } from "tailwind-merge";
import SubmitButton from "@/components/submit-button";

export function NewAppointmentModal({
  close,
  day,
  selectedJob,
}: {
  close: () => void;
  day: Dayjs;
  selectedJob: ILocationJob;
}) {
  const {
    location: { profiles },
  } = useLocationContext();
  const startOfDayMinString = day.startOf("day").format(DAYJS_DATETIME);
  const endOfDayMinString = day.endOf("day").format(DAYJS_DATETIME);
  const [range, setRange] = useState({
    start: dayjs(day)
      .set("h", 9)
      .set("m", 0)
      .set("s", 0)
      .format(DAYJS_DATETIME),
    end: dayjs(day).set("h", 17).set("m", 0).set("s", 0).format(DAYJS_DATETIME),
  });
  const router = useRouter();

  const [state, action] = useActionState(AddJobToSchedule<TInitialFormState>, {
    ...initialFormState,
    data: {
      business_id: selectedJob.business_id,
      customer_id: selectedJob.customer_id,
      location_id: selectedJob.business_location_id,
      job_id: selectedJob.id,
      start_datetime: range.start,
      end_datetime: range.end,
      profiles: {},
    },
  });

  const installers = useLocationInstallers({
    businessId: selectedJob.business_id,
    locationId: Number(selectedJob.business_location_id),
    range,
  });

  useEffect(() => {
    if (state.success && state.data) {
      router.refresh();
      if (state.dismiss) close();
    }
  }, [state.success, state.dismiss, router, state.data, close]);

  return (
    <Modal dismissible show onClose={close}>
      <ModalHeader>
        <span>{`Add JOB-${selectedJob.id} to the schedule on ${dayjsLocalDate(day)}`}</span>
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
            <li>{selectedJob.full_name}</li>
            <li>
              <b>Address:</b>
              <p className="ml-2 text-sm">
                {selectedJob.address}
                <br />
                {`${selectedJob.city}, ${selectedJob.state}`}
              </p>
            </li>
            <li>
              <b>Products</b>
              {selectedJob.products.length ? (
                <ul className="ml-2 text-sm">
                  {selectedJob.products.map((product) => (
                    <li
                      key={product.id}
                    >{`${product.number_of_units} ${product.product.unit} - ${product.product.name}`}</li>
                  ))}
                </ul>
              ) : (
                <p className="ml-2 text-sm">No products</p>
              )}
            </li>
          </ul>
        </Card>
        <br />
        <form action={action} className="grid gap-6" id="add-job-to-schedule">
          <input
            type="hidden"
            name="business_id"
            value={state.data.business_id}
          />
          <input
            type="hidden"
            name="customer_id"
            value={state.data.customer_id}
          />
          <input
            type="hidden"
            name="location_id"
            value={state.data.location_id}
          />
          <input type="hidden" name="job_id" value={state.data.job_id} />
          <fieldset className="grid gap-2">
            <h3>When</h3>
            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>
          </fieldset>
          <fieldset className="grid gap-2">
            <h3>Who</h3>
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
          </fieldset>
        </form>
      </ModalBody>
      <ModalFooter>
        <SubmitButton form="add-job-to-schedule" pendingText="Submitting...">
          Submit
        </SubmitButton>
        <Button color="gray" onClick={close}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
