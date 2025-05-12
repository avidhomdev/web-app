"use client";

import { Button, Label, Modal, ModalBody, ModalHeader, TextInput } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export function ConfirmModal({
  description,
  matchStringConfirmation,
  onConfirmClick,
  trigger,
}: {
  description: string;
  matchStringConfirmation?: string;
  onConfirmClick: () => void;
  trigger: (arg: () => void) => void;
}) {
  const [stringInputValue, setStringInputValue] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const toggle = () => setOpenModal((prevState) => !prevState);

  return (
    <>
      {trigger(toggle)}
      <Modal show={openModal} size="md" onClose={toggle} popup>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {description}
            </h3>
            {matchStringConfirmation && (
              <div className="grid gap-2 p-2">
                <Label className="text-red-400 dark:text-red-400">{`Type "${matchStringConfirmation}" to confirm deleting`}</Label>
                <TextInput
                  className="mb-4"
                  value={stringInputValue}
                  onChange={(e) => setStringInputValue(e.target.value)}
                />
              </div>
            )}
            <div className="flex flex-col justify-center gap-2 sm:flex-row sm:gap-4">
              <Button
                disabled={
                  matchStringConfirmation
                    ? matchStringConfirmation !== stringInputValue
                    : false
                }
                color="failure"
                onClick={() => {
                  onConfirmClick();
                  toggle();
                }}
              >
                Yes, I&apos;m sure
              </Button>
              <Button color="gray" onClick={toggle}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
