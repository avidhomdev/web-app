import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface JobInvoiceEmailTemplateProps {
  name: string;
  invoice_url: string;
}

export default function JobInvoiceEmailTemplate({
  name,
  invoice_url,
}: JobInvoiceEmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>New Invoice</Preview>
          <Container className="mx-auto my-[40px] max-w-[465px] rounded-sm border border-solid border-[#eaeaea] p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Make a payment.
            </Heading>
            <Text className="text-[14px] leading-[24px] text-black">
              Hello {name},
            </Text>
            <Text className="text-[14px] leading-[24px] text-black">
              You have one unpaid invoice.
            </Text>

            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                className="rounded-sm bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
                href={invoice_url}
              >
                Pay Invoice
              </Button>
            </Section>
            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{" "}
              <Link href={invoice_url} className="text-blue-600 no-underline">
                {invoice_url}
              </Link>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
