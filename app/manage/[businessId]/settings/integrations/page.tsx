import { Button, Card, List, ListItem } from "flowbite-react";
import { AddIntegrationDrawer } from "./add-integration-drawer";

export default function Page() {
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <hgroup className="sm:col-span-3 md:col-span-4">
          <h2 className="font-semibold">Integrations</h2>
          <p className="text-sm text-gray-400">
            Integrations can improve your experience with customers. Things like
            DocuSign, Stripe, and more.
          </p>
        </hgroup>
        <div className="grid gap-6 sm:col-span-9 md:col-span-8">
          <div className="flex flex-row justify-end">
            <AddIntegrationDrawer />
          </div>
          <Card>
            <div>
              <h3 className="font-semibold">Zoom</h3>
              <p>Video conferencing, webinars and chat with customers.</p>
            </div>
            <List unstyled>
              <ListItem>
                ID: <strong className="font-semibold">uuid-1234234</strong>
              </ListItem>
              <ListItem>
                Account:{" "}
                <strong className="font-semibold">Account Owner Name</strong>
              </ListItem>
            </List>
            <div className="flex flex-row gap-x-2">
              <Button color="gray">Settings</Button>
              <Button color="red">Revoke Access</Button>
            </div>
          </Card>
          <Card>
            <div>
              <h3 className="font-semibold">Stripe</h3>
              <p>Accept payments and manage subscriptions.</p>
            </div>
            <List unstyled>
              <ListItem>
                ID: <strong className="font-semibold">uuid-1234234</strong>
              </ListItem>
              <ListItem>
                Account:{" "}
                <strong className="font-semibold">Account Owner Name</strong>
              </ListItem>
            </List>
            <div className="flex flex-row gap-x-2">
              <Button color="gray">Settings</Button>
              <Button color="red">Revoke Access</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
