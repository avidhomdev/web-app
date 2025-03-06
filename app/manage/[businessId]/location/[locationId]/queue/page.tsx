import { createSupabaseServerClient } from "@/utils/supabase/server";
import dayjs from "dayjs";
import { Card, List, ListItem } from "flowbite-react";

export default async function Page({
  params,
}: {
  params: Promise<{ businessId: string; locationId: string }>;
}) {
  const { locationId } = await params;

  const supabase = await createSupabaseServerClient();
  const fetchLocationCustomers = supabase
    .from("business_location_customers")
    .select("*, appointments: business_appointments(*)")
    .match({ location_id: locationId })
    .is("appointments", null);

  const fetchEmployees = supabase
    .rpc("ordered_employees", { lid: Number(locationId) })
    .select("*");

  const [
    { data: customers, error: fetchCustomersError },
    { data: employees, error: fetchEmployeesError },
  ] = await Promise.all([fetchLocationCustomers, fetchEmployees]);

  if (fetchEmployeesError || fetchCustomersError) {
    throw fetchEmployeesError?.message || fetchCustomersError?.message;
  }

  return (
    <Card>
      <div className="grid grid-cols-2 gap-2">
        <List unstyled>
          <h2 className="mb-2 border-b text-lg font-semibold">Closer Queue</h2>
          {employees && employees.length > 0
            ? employees.map((employee) => (
                <ListItem
                  className="bg-gray-50 p-2 px-4"
                  key={employee.profile_id}
                >
                  <p>{employee.full_name}</p>
                  <p className="text-sm">
                    {employee.latest_appointment
                      ? dayjs(employee.latest_appointment).format(
                          "MM/DD/YYYY hh:mm a",
                        )
                      : "No previous appointment"}
                  </p>
                </ListItem>
              ))
            : "No employees found."}
        </List>
        <List unstyled>
          <h2 className="mb-2 border-b text-lg font-semibold">
            Customers Queue
          </h2>
          {customers && customers?.length > 0
            ? customers.map((customer) => (
                <ListItem className="bg-gray-50 p-2 px-4" key={customer.id}>
                  {customer.full_name}
                </ListItem>
              ))
            : "No customers found."}
        </List>
      </div>
    </Card>
  );
}
