"use client";

import { Button } from "flowbite-react";
import { CheckCircle2, Circle } from "lucide-react";
import { updateDocusignIntegrationMetadataJobContractTemplateId } from "./action";
import { useParams } from "next/navigation";

export default function ToggleTableContractButton({
  jobContractTemplateId,
  templateId,
}: {
  jobContractTemplateId: string;
  templateId: string;
}) {
  const isSelected = jobContractTemplateId === templateId;
  const { businessId } = useParams<{ businessId: string }>();

  return (
    <Button
      onClick={() =>
        updateDocusignIntegrationMetadataJobContractTemplateId(
          businessId,
          templateId,
        )
      }
      className="cursor-pointer"
      color={isSelected ? "default" : "alternative"}
      outline
      size="sm"
    >
      {jobContractTemplateId === templateId ? <CheckCircle2 /> : <Circle />}
    </Button>
  );
}
