import Linky from "@/components/linky";
import PageHeaderWithActions from "@/components/page-header-with-actions";
import { ILocationEmployee } from "@/types/location";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { Breadcrumb, BreadcrumbItem, Card, List } from "flowbite-react";
import { ChevronLeftIcon } from "lucide-react";
import CustomerSearchInput from "./customer-search-input";
import PageForm from "./page-form";

type TPage = {
  params: Promise<{ locationId: string; businessId: string }>;
  searchParams: Promise<{ customerId: string; customerSearch: string }>;
};

export default async function Page(props: TPage) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { businessId, locationId } = params;

  const supabase = await createSupabaseServerClient();
  const [
    { data: profiles, error },
    { data: products, error: fetchProductsError },
    { data: customers },
    { data: customer },
  ] = await Promise.all([
    supabase
      .from("business_location_profiles")
      .select("*, profile: profile_id(id,full_name)")
      .eq("location_id", Number(locationId))
      .overrideTypes<ILocationEmployee[]>(),
    supabase
      .from("business_products")
      .select("*, business_product_locations!inner(*)")
      .match({
        business_id: businessId,
        "business_product_locations.location_id": locationId,
        "business_product_locations.status": 1,
      }),
    supabase
      .from("business_location_customers")
      .select("*")
      .eq("location_id", Number(locationId))
      .or(
        `full_name.ilike.%${searchParams.customerSearch}%, email.ilike.%${searchParams.customerSearch}%`,
      )
      .limit(5),
    supabase
      .from("business_location_customers")
      .select("*, creator: creator_id(*)")
      .eq("id", Number(searchParams.customerId))
      .maybeSingle(),
  ]);

  if (error) throw error;
  if (fetchProductsError) throw fetchProductsError;
  return (
    <>
      <PageHeaderWithActions
        title="New Job"
        subtitle="Add a new job"
        renderBreadcrumbs={() => (
          <Breadcrumb aria-label="Back to jobs">
            <BreadcrumbItem
              href={`/manage/${businessId}/location/${locationId}/jobs`}
              icon={() => <ChevronLeftIcon className="mr-2" />}
            >
              Back to Jobs
            </BreadcrumbItem>
          </Breadcrumb>
        )}
      />
      {searchParams.customerId ? (
        <PageForm
          customer={customer}
          profiles={profiles ?? []}
          products={products ?? []}
        />
      ) : (
        <Card>
          <CustomerSearchInput />
          {Object(searchParams).hasOwnProperty("customerSearch") && (
            <List unstyled>
              {customers && customers.length > 0 ? (
                <p>
                  Select a customer or{" "}
                  <Linky href="?customerId=new">create new</Linky>
                </p>
              ) : (
                <p>
                  No customers found.{" "}
                  <Linky href="?customerId=new">Create new</Linky>
                </p>
              )}
              {customers?.map((customer) => (
                <li key={customer.id} className="grid">
                  <Linky href={`?customerId=${customer.id}`}>
                    {customer.full_name}
                  </Linky>
                  <i className="text-sm">{customer.email}</i>
                </li>
              ))}
            </List>
          )}
        </Card>
      )}
    </>
  );
}
