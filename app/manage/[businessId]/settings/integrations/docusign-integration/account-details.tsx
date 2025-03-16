"use client";

import { Tables } from "@/types/supabase";
import { IDocusignAccount } from "@/utils/docusign";
import { Button, Card, Label, Modal, Select } from "flowbite-react";
import { SettingsIcon, Trash2Icon } from "lucide-react";
import Form from "next/form";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { updateDocusignIntegrationAccount } from "./action";

function ChangeAccountForm({
  accounts,
  integration,
  isEditing,
  setIsEditing,
}: {
  accounts: IDocusignAccount[];
  integration: Tables<"business_integrations">;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    integration.account_id ?? "",
  );
  const [isChangeModalShown, setIsChangeModalShown] = useState(false);
  const [confirmChange, setConfirmChange] = useState(false);
  const closeChangeModal = () => setIsChangeModalShown(false);

  const selectedAccount = accounts?.find(
    (account) => account.account_id === selectedAccountId,
  );

  return (
    <>
      <Form
        action={updateDocusignIntegrationAccount}
        className="grid max-w-sm gap-2 md:gap-4"
      >
        <input
          type="hidden"
          name="business_id"
          value={integration.business_id}
        />
        {selectedAccount && (
          <input
            type="hidden"
            name="base_uri"
            value={selectedAccount.base_uri}
          />
        )}
        <div>
          <Label htmlFor="account_id" className="mb-2 block">
            Linked account:
          </Label>
          <Select
            id="account_id"
            name="account_id"
            onChange={(e) => {
              setSelectedAccountId(e.target.value);
              if (isEditing) setIsChangeModalShown(true);
            }}
            required
            value={selectedAccountId}
          >
            <option disabled value="">
              Select an account
            </option>
            {accounts?.map((account) => (
              <option key={account.account_id} value={account.account_id}>
                {account.account_name}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex justify-end gap-x-2">
          {isEditing && (
            <Button
              color="secondary"
              onClick={() => setIsEditing(false)}
              outline
            >
              Cancel
            </Button>
          )}
          <Button
            disabled={isEditing && !confirmChange}
            color="primary"
            title={
              confirmChange ? "Save new account" : "Select different account"
            }
            type="submit"
          >
            Save
          </Button>
        </div>
      </Form>
      <Modal
        show={isChangeModalShown}
        size="md"
        onClose={closeChangeModal}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="text-lg font-normal text-gray-500 dark:text-gray-400">
              Change account
            </h3>
            <p className="mb-5 text-sm text-gray-400 dark:text-gray-500">
              Are you sure you want to change the linked account?
            </p>
            <div className="flex flex-col justify-center gap-2 sm:flex-row sm:gap-4">
              <Button
                color="failure"
                onClick={() => {
                  setConfirmChange(true);
                  closeChangeModal();
                }}
              >
                Yes, I&apos;m sure
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setSelectedAccountId("");
                  closeChangeModal();
                }}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

function RevokeButton({ businessId }: { businessId: string }) {
  const [isRevoking, setIsRevoking] = useState(false);
  const closeRevoking = () => setIsRevoking(false);

  return (
    <>
      <Button
        color="red"
        onClick={() => setIsRevoking(true)}
        disabled={isRevoking}
        pill
      >
        <Trash2Icon className="size-5" />
      </Button>
      <Modal show={isRevoking} size="md" onClose={closeRevoking} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="text-lg font-normal text-gray-500 dark:text-gray-400">
              Revoke access
            </h3>
            <p className="mb-5 text-sm text-gray-400 dark:text-gray-500">
              Are you sure you want to revoke access to DocuSign?
            </p>
            <div className="flex flex-col justify-center gap-2 sm:flex-row sm:gap-4">
              <Button
                color="failure"
                href={`/docusign/revoke?businessId=${businessId}`}
              >
                Yes, I&apos;m sure
              </Button>
              <Button color="gray" onClick={closeRevoking}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default function AccountDetails({
  accounts,
  integration,
}: {
  accounts: IDocusignAccount[];
  integration: Tables<"business_integrations">;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const selectedAccount = accounts?.find(
    (account) => account.account_id === integration.account_id,
  );

  return (
    <>
      {!selectedAccount || isEditing ? (
        <ChangeAccountForm
          integration={integration}
          accounts={accounts}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      ) : (
        <Card className="max-w-sm bg-gray-100 shadow-none">
          <div className="flex items-center justify-between">
            <hgroup className="leading-snug tracking-tight">
              <small>Selected Account</small>
              <h3 className="text-lg font-semibold">
                {selectedAccount.account_name}
              </h3>
            </hgroup>
            <div className="flex gap-2">
              <Button color="light" onClick={() => setIsEditing(true)} pill>
                <SettingsIcon className="size-5" />
              </Button>
              <RevokeButton businessId={integration.business_id} />
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
