import Linky from "@/components/linky";
import SupabaseSignedImage from "@/components/supabase-signed-image";
import { ILocationJob } from "@/contexts/location";
import { JOB_STATUS_PROPERTIES } from "@/enums/job-status";
import { Tables } from "@/types/supabase";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import {
  Badge,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "flowbite-react";
import { MapIcon, MapPinIcon, MapPinnedIcon } from "lucide-react";
import { notFound } from "next/navigation";

interface CustomerProps extends Tables<"business_location_customers"> {
  jobs: ILocationJob[];
  bids: Tables<"business_location_customer_bids">[];
}

function CustomerLocationCard({ customer }: { customer: CustomerProps }) {
  return (
    <Card className="group col-span-2 md:col-span-3 lg:col-span-4">
      <div className="flex items-center justify-between gap-2">
        <h6 className="text-lg font-semibold tracking-tighter">Location</h6>
      </div>
      <div className="flex flex-col items-start gap-4 lg:gap-6">
        <div className="grid aspect-video w-full place-items-center rounded-sm bg-gray-100 dark:bg-gray-700">
          <MapPinIcon className="size-14" />
          street view or aerial
        </div>
        <p>
          {customer.address}
          <br />
          {`${customer.city || "NA"}, ${customer.state || "NA"} ${customer.postal_code || "NA"}`}
        </p>
        <div className="flex w-full items-center justify-center gap-2">
          <Button color="light">
            <div className="flex items-center gap-2">
              <MapPinnedIcon />
              Get Directions
            </div>
          </Button>
          <Button color="light">
            <div className="flex items-center gap-2">
              <MapIcon />
              Send Location
            </div>
          </Button>
        </div>
      </div>
    </Card>
  );
}

function CustomerLatestBidsCard({ customer }: { customer: CustomerProps }) {
  const { bids } = customer;
  return (
    <Card className="group col-span-2 md:col-span-3 lg:col-span-4">
      <div className="flex items-center justify-between gap-2">
        <h6 className="text-lg font-semibold tracking-tighter">Bids</h6>
      </div>
      {bids.length ? "Has Bids" : "No bids"}
    </Card>
  );
}

function CustomerGalleryCard({
  media,
}: {
  media: Tables<"business_location_job_media">[];
}) {
  return (
    <Card className="group col-span-2 md:col-span-3 lg:col-span-4">
      <div className="flex items-center justify-between gap-2">
        <h6 className="text-lg font-semibold tracking-tighter">Gallery</h6>
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        {media.length
          ? media.map((m) => (
              <div key={m.id} className="relative aspect-square w-24">
                <SupabaseSignedImage path={m.path} />
              </div>
            ))
          : "No media."}
      </div>
    </Card>
  );
}

function CustomerJobCard({ job }: { job: ILocationJob }) {
  return (
    <Card className="lg:col-span-4">
      <div>
        <div className="flex items-start">
          <Badge color={JOB_STATUS_PROPERTIES[job.job_status].color}>
            {JOB_STATUS_PROPERTIES[job.job_status].name}
          </Badge>
        </div>
        <h6 className="text-lg font-semibold tracking-tighter">
          <Linky
            href={`/manage/${job.business_id}/location/${job.business_location_id}/job/${job.id}`}
          >{`JOB-${job.id}`}</Linky>
        </h6>
      </div>

      {job.products.length ? (
        <Table>
          <TableBody>
            {job.products?.map((product) => (
              <TableRow className="text-xs" key={product.id}>
                <TableCell className="p-1"> {product.product.name}</TableCell>
                <TableCell className="p-1 text-right">
                  {`${product.number_of_units} x ${product.product.unit}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div>No products.</div>
      )}
    </Card>
  );
}

function CustomerNotesCard({ customer }: { customer: CustomerProps }) {
  return (
    <Card className="lg:col-span-4">
      <div className="flex items-center justify-between gap-2">
        <h6 className="text-lg font-semibold tracking-tighter">Notes</h6>
      </div>
      <div>{customer.notes || "No notes found."}</div>
    </Card>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: customer } = await supabase
    .from("business_location_customers")
    .select(
      `*,
      jobs: business_location_jobs(
        *,
        products: business_location_job_products(
          *,
          product: product_id(*)
        ),
        media: business_location_job_media(*)
      ),
      bids: business_location_customer_bids(*)
      `,
    )
    .eq("id", Number(customerId))
    .limit(1)
    .single()
    .overrideTypes<CustomerProps>();

  if (!customer) return notFound();

  const media = customer.jobs.flatMap((j) => j.media);

  return (
    <div className="grid grid-cols-2 items-start gap-6 md:grid-cols-6 lg:grid-cols-12">
      <CustomerLocationCard customer={customer} />
      <CustomerLatestBidsCard customer={customer} />
      <CustomerGalleryCard media={media} />

      {customer.jobs.map((job) => (
        <CustomerJobCard job={job} key={job.id} />
      ))}
      <CustomerNotesCard customer={customer} />
    </div>
  );
}
