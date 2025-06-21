import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import dayjs from "dayjs";

type NewAppointmentEmailTemplateProps = {
  start_datetime: string;
  end_datetime: string;
  name: string;
  emails: string;
};

const DISPLAY_DAYJS_FORMAT = "MMMM D, YYYY h:mm A";
const GOOGLE_CAL_DAY_FORMAT = "YYYYMMDDThhmmss";

function formatDate(date: string, format: string) {
  return dayjs(date).format(format);
}

function GoogleCalendarButton({
  name,
  start_datetime,
  end_datetime,
  emails,
}: NewAppointmentEmailTemplateProps) {
  const BASE_URL = `https://calendar.google.com/calendar/render`;
  const params = new URLSearchParams({
    action: encodeURIComponent("TEMPLATE"),
    text: name,
    dates: `${formatDate(start_datetime, GOOGLE_CAL_DAY_FORMAT)}/${formatDate(end_datetime, GOOGLE_CAL_DAY_FORMAT)}`,
    add: emails,
  });

  const href = `${BASE_URL}?${params.toString()}`;

  return (
    <Button
      className="bg-brand rounded-lg px-[18px] py-3 text-white"
      href={href}
    >
      Add to Google Calendar
    </Button>
  );
}

export function NewAppointmentEmailTemplate({
  start_datetime,
  end_datetime,
  name,
  emails,
}: NewAppointmentEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#2250f4",
                offwhite: "#fafbfb",
              },
              spacing: {
                0: "0px",
                20: "20px",
                45: "45px",
              },
            },
          },
        }}
      >
        <Preview>New Appointment to Schedule</Preview>
        <Body className="bg-offwhite font-sans text-base">
          <Container className="bg-white p-45">
            <Heading className="my-0 text-center leading-8">
              New appointment
            </Heading>
            <Section>
              <Row>
                <Text className="text-base">
                  We have a new appointment on your schedule.
                </Text>
              </Row>
              <Row className="items-center justify-center text-center">
                <td align="center" className="w-1/2 pr-[16px]" colSpan={1}>
                  <GoogleCalendarButton
                    emails={emails}
                    end_datetime={end_datetime}
                    name={name}
                    start_datetime={start_datetime}
                  />
                </td>
              </Row>
            </Section>
            <Section>
              <Row>
                <ul>
                  <b>{name}</b>
                  <li>
                    <b>Start:</b>{" "}
                    {dayjs(start_datetime).format(DISPLAY_DAYJS_FORMAT)}
                  </li>
                  <li>
                    <b>End:</b>{" "}
                    {dayjs(end_datetime).format(DISPLAY_DAYJS_FORMAT)}
                  </li>
                </ul>
              </Row>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
