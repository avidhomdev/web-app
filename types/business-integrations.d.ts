import { Tables } from "./supabase";

export interface BusinessIntegration extends Tables<"business_integrations"> {
  metadata: {
    jobContractTemplateId: string;
  };
}
