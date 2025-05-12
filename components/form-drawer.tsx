"use client";

import initialFormState, {
  TInitialFormState,
} from "@/constants/initial-form-state";
import { Drawer, DrawerHeader, DrawerItems } from "flowbite-react";
import {
  PropsWithChildren,
  ReactNode,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from "react";
import ErrorAlert from "./error-alert";

type TFormDrawer = PropsWithChildren<{
  closeCallback?: () => unknown;
  defaultIsOpen?: boolean;
  FormAction: (
    prevState: TInitialFormState,
    formData: FormData,
  ) => Promise<TInitialFormState>;
  renderTrigger: (arg: () => void) => ReactNode;
  title: string;
  titleIcon: () => ReactNode;
}>;

export default function FormDrawer({
  children,
  closeCallback,
  defaultIsOpen = false,
  FormAction,
  renderTrigger,
  title,
  titleIcon,
}: TFormDrawer) {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);
  const [state, action] = useActionState(FormAction, initialFormState);

  useEffect(() => {
    if (state.success && state.dismiss) setIsOpen(() => false);
  }, [state.success, state.dismiss, setIsOpen]);

  const close = useCallback(() => {
    setIsOpen(() => false);
    if (closeCallback) closeCallback();
  }, [closeCallback]);

  const toggle = useCallback(() => setIsOpen((prevState) => !prevState), []);

  return (
    <>
      {renderTrigger(toggle)}
      {isOpen && (
        <Drawer open={isOpen} onClose={close} position="right">
          <DrawerHeader title={title} titleIcon={titleIcon} />
          <DrawerItems>
            {state.error && (
              <div className="my-4">
                <ErrorAlert message={state.error} />
              </div>
            )}
            <form action={action} className="my-4">
              {children}
            </form>
          </DrawerItems>
        </Drawer>
      )}
    </>
  );
}
