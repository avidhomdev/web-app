"use server";

import { formStateResponse } from "@/constants/initial-form-state";
import { ServerActionWithState } from "@/types/server-actions";
import { formatArrayFormFieldsIntoDictionary } from "@/utils/format-array-form-fields-into-dictionary";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function AddProduct<T>(...args: ServerActionWithState<T>) {
  const supabase = await createSupabaseServerClient();
  const [state, formData] = args;
  const fields = Object.fromEntries(formData);

  const newState = {
    ...state,
    data: fields,
  };

  const insert = {
    business_id: fields.business_id as string,
    min_units: Number(fields.min_units),
    name: fields.name as string,
    unit: fields.unit as string,
    unit_price: Number(fields.unit_price),
    units_in_stock: Number(fields.units_in_stock),
  };

  const locationsDictionary = formatArrayFormFieldsIntoDictionary(
    "location",
    fields,
  );

  const { data: product, error } = await supabase
    .from("business_products")
    .insert(insert)
    .select("id")
    .single();

  if (error) return formStateResponse({ ...newState, error: error?.message });

  const locationsInsert = Object.entries(locationsDictionary).map(
    ([key, entry]) => ({
      location_id: Number(key),
      status: Number(entry.status),
      product_id: Number(product?.id),
      business_id: fields.business_id as string,
    }),
  );

  const { error: productLocationInsertError } = await supabase
    .from("business_product_locations")
    .insert(locationsInsert);

  if (productLocationInsertError)
    return formStateResponse({
      ...newState,
      error: productLocationInsertError?.message,
    });

  const headersList = await headers();
  const origin = headersList.get("origin");
  revalidatePath("/manage/[businessId]/products");
  return redirect(`${origin}/manage/${fields.business_id}/products`);
}
