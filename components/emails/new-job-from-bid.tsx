import { IJob } from "@/types/job";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import dayjs from "dayjs";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export function NewJobFromBidEmailTemplate({ job }: { job: IJob }) {
  const steps = [
    {
      id: 1,
      Description: (
        <li className="mb-20" key={1}>
          <strong>Send Contract.</strong>{" "}
          <Link
            href={`${baseUrl}/manage/${job.business_id}/location/${job.business_location_id}/job/${job.id}/documents`}
          >
            Go to your job and send the contract
          </Link>
          , or manually email the customer to sign the contract.
        </li>
      ),
    },
    {
      id: 2,
      Description: (
        <li className="mb-20" key={2}>
          <strong>Collect down payment.</strong> Now that the job has begun, you
          can start by collecting a deposit.
          <Link
            href={`${baseUrl}/manage/${job.business_id}/location/${job.business_location_id}/job/${job.id}/payments`}
          >
            Track or request a payment.
          </Link>
          .
        </li>
      ),
    },
    {
      id: 3,
      Description: (
        <li className="mb-20" key={3}>
          <strong>Add employees to the job.</strong> To get the installers on
          the job, add them as crew members for the install.{" "}
          <Link
            href={`${baseUrl}/manage/${job.business_id}/location/${job.business_location_id}/job/${job.id}`}
          >
            Start with adding crew
          </Link>
          .
        </li>
      ),
    },
    {
      id: 4,
      Description: (
        <li className="mb-20" key={4}>
          <strong>Schedule the install.</strong> Last step is to schedule the
          install. This can be tricky with a busy calendar. Pay close attention
          to when you&apos;re scheduling for conflicts.{" "}
          <Link
            href={`${baseUrl}/manage/${job.business_id}/location/${job.business_location_id}/job/${job.id}`}
          >
            Add to the calendar
          </Link>
          .
        </li>
      ),
    },
  ];
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
        <Preview>New Job from bid</Preview>
        <Body className="bg-offwhite font-sans text-base">
          <Section>
            <Img
              alt="illustration"
              className="mx-auto w-full rounded-[12px] object-cover"
              height={320}
              src="https://www.avid-hom.com/images/pay-laptop.png"
              width={320}
            />
          </Section>
          <Container className="p-45 bg-white">
            <Heading className="my-0 text-center leading-8">
              New Job from Bid
            </Heading>
            <Section>
              <Row>
                <Text className="text-base">
                  Congratulations! You have a new job to schedule out.
                </Text>

                <Text className="text-base">
                  Here&apos;s how to get started:
                </Text>
              </Row>
              <Row>
                <ul>{steps?.map(({ Description }) => Description)}</ul>
              </Row>
            </Section>
            <Section>
              <Heading as="h3" className="text-center">
                Location
              </Heading>
              <Row>
                <ul>
                  <li>
                    <b>Address:</b> {job.address}
                  </li>
                  <li>
                    <b>City:</b> {job.city}
                  </li>
                  <li>
                    <b>State:</b> {job.state}
                  </li>
                  <li>
                    <b>Postal Code:</b> {job.postal_code}
                  </li>
                </ul>
              </Row>
            </Section>
            <Section>
              <Heading as="h3" className="text-center">
                Products
              </Heading>
              <Row>
                <ul>
                  {job.products?.map((product) => (
                    <li key={product.id}>
                      {product.product.name} -{" "}
                      <b>{`${product.number_of_units.toLocaleString()} x ${product.product.unit}`}</b>
                    </li>
                  ))}
                </ul>
              </Row>
            </Section>
            <Section>
              <Heading as="h3" className="text-center">
                People
              </Heading>
              {job.profiles?.map((profile) => (
                <>
                  <Section
                    align="left"
                    className="mt-[16px] max-w-[288px]"
                    key={profile.id}
                  >
                    <Section className="mt-[5px] inline-block max-h-[48px] max-w-[48px] text-left">
                      {profile.profile.avatar_url ? (
                        <Img
                          alt={profile.profile.full_name ?? ""}
                          className="block rounded-full object-cover object-center"
                          height={48}
                          src={profile.profile.avatar_url}
                          width={48}
                        />
                      ) : (
                        <div className="size-12 rounded-full bg-gray-100" />
                      )}
                    </Section>
                    <Section className="ml-[18px] inline-block max-w-[120px] text-left align-top">
                      <Heading
                        as="h3"
                        className="m-0 text-[14px] font-medium leading-[20px] text-gray-900"
                      >
                        {profile.profile.full_name}
                      </Heading>
                      <Text className="m-0 text-[12px] font-medium capitalize leading-[14px] text-gray-500">
                        {profile.role}
                      </Text>
                    </Section>
                  </Section>
                </>
              ))}
            </Section>
            <Section>
              <Heading as="h3" className="text-center">
                Notes
              </Heading>
              <Row>
                <ul className="list-none">
                  {job.messages?.map((message) => (
                    <li key={message.id}>
                      {message.message}
                      <br />
                      <small>{`By: ${message.author?.full_name} on ${dayjs(message.created_at).format("MM-DD-YYYY")}`}</small>
                    </li>
                  ))}
                </ul>
              </Row>
            </Section>
            <Section className="text-center">
              <Button
                className="bg-brand rounded-lg px-[18px] py-3 text-white"
                href={`${baseUrl}/manage/${job.business_id}/location/${job.business_location_id}/job/${job.id}`}
              >
                Go to job
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
