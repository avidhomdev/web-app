import { Tables } from "@/types/supabase";
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

export function NewAppointmentEmailTemplate({
  appointment,
}: {
  appointment: Tables<"business_appointments">;
}) {
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
          <Container className="p-45 bg-white">
            <Heading className="my-0 text-center leading-8">
              New appointment
            </Heading>
            <Section>
              <Row>
                <Text className="text-base">
                  We have a new appointment on your schedule.
                </Text>
                <Text className="text-base">
                  Here&apos;s how to get started:
                </Text>
              </Row>
              <Row className="items-center justify-center text-center">
                <Button
                  className="bg-brand rounded-lg px-[18px] py-3 text-white"
                  href="#"
                >
                  Add to Google Calendar
                </Button>
                <Button
                  className="bg-brand rounded-lg px-[18px] py-3 text-white"
                  href="#"
                >
                  Add to Apple Calendar
                </Button>
              </Row>
            </Section>
            <Section>
              <Heading as="h3" className="text-center">
                Appointment
              </Heading>
              <Row>
                <ul>
                  <li>
                    <b>Start:</b>{" "}
                    {dayjs(appointment.start_datetime).format(
                      "MMMM D, YYYY h:mm A",
                    )}
                  </li>
                  <li>
                    <b>End:</b>{" "}
                    {dayjs(appointment.end_datetime).format(
                      "MMMM D, YYYY h:mm A",
                    )}
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
