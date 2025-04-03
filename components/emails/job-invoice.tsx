export default function JobInvoiceEmailTemplate({
  invoice_url,
  name,
}: {
  invoice_url: string;
  name: string;
}) {
  return (
    <div>
      <h1>Welcome, {name}</h1>
      <a href={invoice_url}>Pay Invoice</a>
    </div>
  );
}
