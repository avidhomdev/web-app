import { NewJobFromBidEmailTemplate } from "@/components/emails/new-job-from-bid";
import { IJob } from "@/types/job";
import { Enums } from "@/types/supabase";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Replace with specific origin in production
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ bidId: string }> },
) {
  const { bidId } = await params;
  const headersList = await request.headers;

  const authHeader = headersList.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { success: false, error: "Missing or invalid Authorization header" },
      { headers: corsHeaders, status: 401 },
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
      { headers: corsHeaders, status: 401 },
    );
  }

  const { data: bid, error: bidError } = await supabase
    .from("business_location_customer_bids")
    .select(
      `*,
      customer: customer_id!inner(*),
      media: business_location_customer_bid_media(*),
      products: business_location_customer_bid_products(*)
      `,
    )
    .eq("id", Number(bidId))
    .limit(1)
    .maybeSingle();

  if (!bid || bidError) {
    return NextResponse.json(
      { success: false, error: "Missing bid information" },
      { headers: corsHeaders, status: 400 },
    );
  }

  const insertJob = {
    address: bid.customer.address,
    bid_id: bid.id,
    business_id: bid.business_id,
    business_location_id: bid.location_id,
    city: bid.customer.city,
    commission: bid.commission,
    creator_id: user.id,
    customer_id: bid.customer.id,
    full_name: bid.customer.full_name,
    postal_code: bid.customer.postal_code,
    state: bid.customer.state,
    has_water_rebate: bid.has_water_rebate,
    water_rebate_company: bid.water_rebate_company,
    hoa_approval_required: bid.hoa_approval_required,
    hoa_contact_name: bid.hoa_contact_name,
    hoa_contact_email: bid.hoa_contact_email,
    hoa_contact_phone: bid.hoa_contact_phone,
    discount: bid.discount,
    lead_type: bid.lead_type,
  };

  const { data: job, error: jobInsertError } = await supabase
    .from("business_location_jobs")
    .insert(insertJob)
    .select("*")
    .single();

  if (jobInsertError) {
    return NextResponse.json(
      {
        success: false,
        error: jobInsertError.message,
      },
      { headers: corsHeaders, status: 400 },
    );
  }

  const jobProfiles = [
    {
      profile_id: user.id,
      role: "closer" as Enums<"job_roles">,
    },
    {
      profile_id: bid.customer.creator_id || user.id,
      role: "setter" as Enums<"job_roles">,
    },
  ];

  const jobProfileInsert = jobProfiles.map((jobProfile) => ({
    ...jobProfile,
    business_id: bid.customer.business_id,
    location_id: bid.customer.location_id,
    job_id: job.id,
  }));

  const { error: jobProfileInsertError } = await supabase
    .from("business_location_job_profiles")
    .insert(jobProfileInsert);

  if (jobProfileInsertError) {
    return NextResponse.json(
      {
        success: false,
        error: jobProfileInsertError.message,
      },
      { headers: corsHeaders, status: 400 },
    );
  }

  const jobMediaInsert = bid.media.map((m) => ({
    business_id: m.business_id,
    location_id: m.location_id,
    job_id: job.id,
    path: m.path,
    name: m.name,
    type: m.type,
  }));

  const { error: jobMediaInsertError } = await supabase
    .from("business_location_job_media")
    .insert(jobMediaInsert);

  if (jobMediaInsertError) {
    return NextResponse.json(
      {
        success: false,
        error: jobMediaInsertError.message,
      },
      { headers: corsHeaders, status: 400 },
    );
  }

  const { error: jobProductsInsertError } = await supabase
    .from("business_location_job_products")
    .insert(
      bid.products.map((product) => ({
        job_id: job.id,
        business_id: bid.customer.business_id,
        location_id: bid.customer.location_id,
        product_id: product.product_id,
        number_of_units: product.units,
        unit_price: product.unit_price,
        total_price: product.units * product.unit_price,
      })),
    );

  if (jobProductsInsertError) {
    return NextResponse.json(
      {
        success: false,
        error: jobProductsInsertError.message,
      },
      { headers: corsHeaders, status: 400 },
    );
  }

  if (bid.notes) {
    const { error: jobMessagesInsertError } = await supabase
      .from("business_location_job_messages")
      .insert({
        business_id: bid.business_id,
        location_id: bid.location_id,
        job_id: job.id,
        author_id: bid.creator_id,
        message: bid.notes,
      });

    if (jobMessagesInsertError) {
      return NextResponse.json(
        {
          success: false,
          error: jobMessagesInsertError.message,
        },
        { headers: corsHeaders, status: 400 },
      );
    }
  }

  return supabase
    .from("business_location_jobs")
    .select(
      `
      *,
      messages: business_location_job_messages(*, author: author_id(*)),
      products: business_location_job_products(*, product: product_id(*)),
      profiles: business_location_job_profiles(*, profile: profile_id(*))
      `,
    )
    .eq("id", job.id)
    .limit(1)
    .single()
    .overrideTypes<IJob>()
    .then(async ({ data, error }) => {
      if (error)
        return NextResponse.json(
          {
            success: false,
            error: error.message,
          },
          { headers: corsHeaders, status: 400 },
        );

      await resend.emails.send({
        from: "no-reply <no-reply@avid-hom.com>",
        to: ["devavidhom@gmail.com"],
        subject: "New Job",
        react: NewJobFromBidEmailTemplate({
          job: data,
        }),
      });

      return NextResponse.json(
        { success: true, job },
        { headers: corsHeaders },
      );
    });
}
