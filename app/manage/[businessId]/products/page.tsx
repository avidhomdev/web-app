import { createSupabaseServerClient } from "@/utils/supabase/server";
import ProductsHeader from "./products-header";
import ProductsTable from "./products-table";
import { Tables } from "@/types/supabase";

export interface IBusinessProductWithLocation
  extends Tables<"business_products"> {
  locations: Tables<"business_product_locations">[];
}

export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("business_products")
    .select("*, locations: business_product_locations(*)")
    .order("name")
    .overrideTypes<IBusinessProductWithLocation[]>();

  if (error) throw error;

  return (
    <>
      <ProductsHeader />
      <ProductsTable products={data} />
    </>
  );
}
