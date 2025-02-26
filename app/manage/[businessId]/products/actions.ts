"use server";

import { formStateResponse } from "@/constants/initial-form-state";
import { ServerActionWithState } from "@/types/server-actions";
import { formatArrayFormFieldsIntoDictionary } from "@/utils/format-array-form-fields-into-dictionary";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function UpdateProduct<T>(...args: ServerActionWithState<T>) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;
  const fields = Object.fromEntries(formData);
  const newState = {
    ...state,
    data: fields,
  };

  const updates = {
    name: fields.name as string,
    unit: fields.unit as string,
    unit_price: Number(fields.unit_price),
    lead_price: Number(fields.lead_price),
    units_in_stock: Number(fields.units_in_stock),
  };

  const { data: product, error } = await supabase
    .from("business_products")
    .update(updates)
    .eq("id", Number(fields.id))
    .select("id")
    .single();

  if (error) {
    return formStateResponse({ ...newState, error: error.message });
  }

  const locationsDictionary = formatArrayFormFieldsIntoDictionary(
    "location",
    fields,
  );

  const locationsInsert = Object.entries(locationsDictionary).map(
    ([key, entry]) => ({
      location_id: Number(key),
      status: Number(entry.status),
      product_id: Number(product.id),
      business_id: fields.business_id as string,
    }),
  );

  const { error: productLocationInsertError } = await supabase
    .from("business_product_locations")
    .upsert(locationsInsert);

  if (productLocationInsertError)
    return formStateResponse({
      ...newState,
      error: productLocationInsertError?.message,
    });

  await supabase.from("business_logs").insert({
    snapshot: JSON.stringify(updates),
    message: `Update product`,
    record_id: fields.id as string,
    record_table_name: "business_products",
    business_id: fields.business_id as string,
    profile_id: fields.profile_id as string,
  });

  return formStateResponse({ success: true, dismiss: true });
}

export async function DeleteProduct(id: number) {
  const supabase = await createSupabaseServerClient();
  return supabase.from("business_products").delete().eq("id", id);
}
