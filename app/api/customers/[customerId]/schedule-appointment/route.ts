import { NewAppointmentEmailTemplate } from "@/components/emails/new-appointment";
import { Tables } from "@/types/supabase";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> },
) {
  const { customerId } = await params;
  const headersList = await request.headers;

  const authHeader = headersList.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, error: "Missing or invalid Authorization header" },
      { status: 401 },
    );
  }
  const jwt = authHeader.split(" ")[1];

  const supabase = await createSupabaseServerClient({ jwt });
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(jwt);

  if (authError || !user) {
    return NextResponse.json(
      { success: false, error: "Invalid or expired token" },
      { status: 401 },
    );
  }
  const body: {
    appointment: Tables<"business_appointments">;
    profiles: { business_id: string; profile_id: string }[];
  } = await request.json();
  const {
    appointment: appointmentInsert,
    profiles: appointmentProfilesInsert,
  } = body;

  const { data: customer, error: customerError } = await supabase
    .from("business_location_customers")
    .select("*")
    .eq("id", Number(customerId))
    .limit(1)
    .single();

  if (customerError) {
    return NextResponse.json(
      { success: false, error: customerError.message },
      { status: 401 },
    );
  }

  if (!customer) {
    return NextResponse.json(
      { success: false, error: "No customer found." },
      { status: 404 },
    );
  }

  const { data: appointment, error: appointmentInsertError } = await supabase
    .from("business_appointments")
    .insert(appointmentInsert)
    .select("*")
    .single();

  if (appointmentInsertError) {
    return NextResponse.json(
      { success: false, error: appointmentInsertError.message },
      { status: 401 },
    );
  }

  if (!appointment) {
    return NextResponse.json(
      { success: false, error: "No appointment found." },
      { status: 401 },
    );
  }

  const { data: appointmentProfiles } = await supabase
    .from("business_appointment_profiles")
    .insert(
      appointmentProfilesInsert.map((profile) => ({
        ...profile,
        appointment_id: appointment.id,
      })),
    )
    .select("*,profile: profile_id(email)");

  const toEmails =
    appointmentProfiles?.map(({ profile }) => profile.email!) ?? [];

  await resend.emails.send({
    from: "no-reply <no-reply@avid-hom.com>",
    to: [...toEmails, customer.email],
    bcc: ["devavidhom@gmail.com"],
    subject: "New Appointment",
    react: NewAppointmentEmailTemplate({
      appointment,
    }),
  });

  return NextResponse.json({ success: true, body });
}
