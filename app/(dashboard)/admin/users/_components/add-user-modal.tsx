"use client";

import CustomSelect from "@/app/components/customselect";
import { errorToast, successToast } from "@/lib/toast";
import { createUser } from "@/services/user.service";
import type { CreateUserPayload, UserStatus } from "@/types/user";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdAdd, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { z } from "zod";

const addUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required."),
  username: z.string().trim().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
  position: z.string().trim().min(1, "Position is required."),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type AddUserFormValues = z.infer<typeof addUserSchema>;

const INITIAL_FORM: AddUserFormValues = {
  name: "",
  username: "",
  password: "",
  position: "Technician",
  status: "ACTIVE",
};

type AddUserModalProps = {
  accessToken?: string;
};

export default function AddUserModal({ accessToken }: AddUserModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    defaultValues: INITIAL_FORM,
    mode: "onChange",
  });

  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      reset(INITIAL_FORM);
      setErrorMessage("");
      setIsPasswordVisible(false);
    }

    onOpenChange();
  };

  const onSubmit = async (values: AddUserFormValues) => {
    setErrorMessage("");

    const payload: CreateUserPayload = {
      name: values.name.trim(),
      username: values.username.trim(),
      password: values.password,
      position: values.position.trim(),
      status: values.status as UserStatus,
    };

    try {
      await createUser({
        accessToken,
        payload,
      });

      reset(INITIAL_FORM);
      onOpenChange();
      successToast("Technician created successfully");
      router.refresh();
    } catch (error) {
      setErrorMessage("Failed to create user. Please try again in a moment.");
      if (error instanceof AxiosError) {
        errorToast(
          error.response?.data?.message ||
            "Failed to create user. Please try again in a moment.",
        );
      }
    }
  };

  return (
    <>
      <Button
        color="primary"
        startContent={<MdAdd size={18} />}
        onPress={onOpen}
      >
        Add Technician
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={handleModalOpenChange}
        size="lg"
        scrollBehavior="inside"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">
                <p className="text-foreground text-base font-semibold">
                  Add Technician User
                </p>
                <p className="text-default-500 text-xs font-normal">
                  Create a new technician account for operations access.
                </p>
              </ModalHeader>

              <ModalBody className="grid grid-cols-1 gap-3">
                <Controller
                  control={control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Input
                      label="Name"
                      labelPlacement="outside"
                      placeholder="John Doe"
                      value={field.value}
                      onValueChange={field.onChange}
                      isRequired
                      isInvalid={Boolean(fieldState.error)}
                      errorMessage={fieldState.error?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="username"
                  render={({ field, fieldState }) => (
                    <Input
                      label="Username"
                      labelPlacement="outside"
                      placeholder="technician.username"
                      value={field.value}
                      onValueChange={field.onChange}
                      isRequired
                      isInvalid={Boolean(fieldState.error)}
                      errorMessage={fieldState.error?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <Input
                      label="Password"
                      labelPlacement="outside"
                      placeholder="Enter password"
                      type={isPasswordVisible ? "text" : "password"}
                      value={field.value}
                      onValueChange={field.onChange}
                      isRequired
                      isInvalid={Boolean(fieldState.error)}
                      errorMessage={fieldState.error?.message}
                      endContent={
                        <button
                          type="button"
                          onClick={() => setIsPasswordVisible((prev) => !prev)}
                          className="text-default-500 hover:text-foreground transition-colors"
                          aria-label={
                            isPasswordVisible
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {isPasswordVisible ? (
                            <MdVisibilityOff size={18} />
                          ) : (
                            <MdVisibility size={18} />
                          )}
                        </button>
                      }
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="position"
                  render={({ field, fieldState }) => (
                    <Input
                      label="Position"
                      labelPlacement="outside"
                      placeholder="Senior Technician"
                      value={field.value}
                      onValueChange={field.onChange}
                      isRequired
                      isInvalid={Boolean(fieldState.error)}
                      errorMessage={fieldState.error?.message}
                    />
                  )}
                />

                <CustomSelect
                  control={control}
                  name="status"
                  label="Status"
                  options={[
                    { label: "ACTIVE", value: "ACTIVE" },
                    { label: "INACTIVE", value: "INACTIVE" },
                  ]}
                  isRequired
                />

                {errorMessage ? (
                  <p className="text-danger text-xs">{errorMessage}</p>
                ) : null}
              </ModalBody>

              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                  isDisabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isSubmitting}
                  isDisabled={!isValid}
                >
                  Save User
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
