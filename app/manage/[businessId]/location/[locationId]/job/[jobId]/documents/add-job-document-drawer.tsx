"use client";

import { IDocusignTemplate } from "@/utils/docusign";
import { Button, Drawer, DrawerHeader, DrawerItems, Label, Select, theme } from "flowbite-react";
import { FileIcon } from "lucide-react";
import Form from "next/form";
import { useParams } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { createJobDocusignEnvelope } from "./action";
import { useUserContext } from "@/contexts/user";
import { Tables } from "@/types/supabase";
import SubmitButton from "@/components/submit-button";

export default function AddDocumentDrawer({
  job,
  templates,
}: {
  job: Tables<"business_location_jobs"> & {
    customer: Tables<"business_location_customers"> | null;
  };
  templates: IDocusignTemplate[];
}) {
  const { user } = useUserContext();
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { businessId, locationId, jobId } = useParams();
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Document</Button>
      {isOpen && (
        <Drawer
          open
          onClose={handleClose}
          position="right"
          theme={{
            root: {
              position: {
                right: {
                  on: twMerge(theme.drawer.root.position.right.on, "w-96"),
                },
              },
            },
          }}
        >
          <DrawerHeader
            title="Add Document"
            titleIcon={() => <FileIcon className="mr-2" />}
          />
          <DrawerItems>
            <Form action={createJobDocusignEnvelope}>
              <input type="hidden" name="business_id" value={businessId} />
              <input type="hidden" name="job_id" value={jobId} />
              <input type="hidden" name="location_id" value={locationId} />
              <input
                type="hidden"
                name="profile_email"
                value={user.email ?? ""}
              />
              <input
                type="hidden"
                name="profile_full_name"
                value={user.full_name ?? ""}
              />
              <input
                type="hidden"
                name="customer_email"
                value={job.customer?.email ?? ""}
              />
              <input
                type="hidden"
                name="customer_name"
                value={job.customer?.full_name ?? ""}
              />
              <input
                type="hidden"
                name="customer_address"
                value={job.customer?.address ?? ""}
              />
              <div className="grid gap-2">
                <Label htmlFor="template_id">Template</Label>
                <Select
                  name="template_id"
                  id="template_id"
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  required
                  value={selectedTemplateId}
                >
                  <option value="">Select a template</option>
                  {templates.map((template) => (
                    <option
                      key={template.templateId}
                      value={template.templateId}
                    >
                      {template.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="mt-4">
                <SubmitButton pendingText="Creating document...">
                  <FileIcon className="mr-2" /> Create Document
                </SubmitButton>
              </div>
            </Form>
          </DrawerItems>
        </Drawer>
      )}
    </>
  );
}
