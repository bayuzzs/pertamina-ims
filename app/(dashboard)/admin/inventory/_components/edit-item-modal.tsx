"use client";

import CustomSelect from "@/app/components/customselect";
import { errorToast, successToast } from "@/lib/toast";
import { updateItem } from "@/services/item.service";
import type {
  Item,
  ItemStatus,
  ItemUnit,
  UpdateItemPayload,
} from "@/types/item";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { MdEdit } from "react-icons/md";
import { z } from "zod";

type EditItemModalProps = {
  item: Item;
  accessToken?: string;
};

const editItemSchema = z.object({
  name: z.string().trim().min(1, "Item name is required."),
  description: z.string().trim().min(1, "Description is required."),
  vendor: z.string().trim().min(1, "Vendor is required."),
  location: z.string().trim().min(1, "Location is required."),
  cost: z
    .string()
    .trim()
    .min(1, "Cost is required.")
    .refine((value) => Number(value) > 0, "Cost must be greater than 0."),
  stock: z
    .string()
    .trim()
    .min(1, "Stock is required.")
    .refine((value) => Number(value) >= 0, "Stock cannot be negative."),
  unit: z.enum(["pcs", "liter"]),
  status: z.enum(["active", "discontinued"]),
});

type EditItemFormValues = z.infer<typeof editItemSchema>;

const toDefaultValues = (item: Item): EditItemFormValues => ({
  name: item.name,
  description: item.description,
  vendor: item.vendor,
  location: item.location,
  cost: String(item.cost),
  stock: String(item.stock),
  unit: item.unit,
  status: item.status,
});

export default function EditItemModal({
  item,
  accessToken,
}: EditItemModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm<EditItemFormValues>({
    resolver: zodResolver(editItemSchema),
    defaultValues: toDefaultValues(item),
    mode: "onChange",
  });

  const handleModalOpen = () => {
    reset(toDefaultValues(item));
    setErrorMessage("");
    onOpen();
  };

  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      reset(toDefaultValues(item));
      setErrorMessage("");
    }

    onOpenChange();
  };

  const onSubmit = async (values: EditItemFormValues) => {
    setErrorMessage("");

    const payload: UpdateItemPayload = {
      name: values.name.trim(),
      description: values.description.trim(),
      vendor: values.vendor.trim(),
      location: values.location.trim(),
      cost: Number(values.cost),
      stock: Number(values.stock),
      unit: values.unit as ItemUnit,
      status: values.status as ItemStatus,
    };

    try {
      await updateItem({
        accessToken,
        id: item.id,
        payload,
      });

      onOpenChange();
      successToast("Item updated successfully");
      router.refresh();
    } catch (error) {
      setErrorMessage("Failed to update item. Please try again in a moment.");
      if (error instanceof AxiosError) {
        errorToast(
          error.response?.data?.message ||
            "Failed to update item. Please try again in a moment.",
        );
      }
    }
  };

  return (
    <>
      <Tooltip content="Edit item">
        <Button isIconOnly size="sm" variant="light" onPress={handleModalOpen}>
          <MdEdit size={18} />
        </Button>
      </Tooltip>

      <Modal
        isOpen={isOpen}
        onOpenChange={handleModalOpenChange}
        size="2xl"
        scrollBehavior="inside"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">
                <p className="text-foreground text-base font-semibold">
                  Edit Inventory Item
                </p>
                <p className="text-default-500 text-xs font-normal">
                  You can edit all fields below except item number.
                </p>
              </ModalHeader>

              <ModalBody className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  label="Item No"
                  labelPlacement="outside"
                  value={item.itemNo}
                  isReadOnly
                  isDisabled
                />
                <Controller
                  control={control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Input
                      label="Item Name"
                      labelPlacement="outside"
                      placeholder="Item name"
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
                  name="description"
                  render={({ field, fieldState }) => (
                    <Textarea
                      label="Description"
                      labelPlacement="outside"
                      placeholder="Item description"
                      value={field.value}
                      onValueChange={field.onChange}
                      className="sm:col-span-2"
                      minRows={3}
                      isRequired
                      isInvalid={Boolean(fieldState.error)}
                      errorMessage={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="vendor"
                  render={({ field, fieldState }) => (
                    <Input
                      label="Vendor"
                      labelPlacement="outside"
                      placeholder="PT Vendor"
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
                  name="location"
                  render={({ field, fieldState }) => (
                    <Input
                      label="Location"
                      labelPlacement="outside"
                      placeholder="Warehouse A - Rack 1"
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
                  name="cost"
                  render={({ field, fieldState }) => (
                    <Input
                      type="number"
                      label="Cost"
                      labelPlacement="outside"
                      placeholder="0"
                      min={0}
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
                  name="stock"
                  render={({ field, fieldState }) => (
                    <Input
                      type="number"
                      label="Stock"
                      labelPlacement="outside"
                      placeholder="0"
                      min={0}
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
                  name="unit"
                  label="Unit"
                  options={[
                    { label: "pcs", value: "pcs" },
                    { label: "liter", value: "liter" },
                  ]}
                  isRequired
                />
                <CustomSelect
                  control={control}
                  name="status"
                  label="Status"
                  options={[
                    { label: "active", value: "active" },
                    { label: "discontinued", value: "discontinued" },
                  ]}
                  isRequired
                />
                {errorMessage ? (
                  <p className="text-danger text-xs sm:col-span-2">
                    {errorMessage}
                  </p>
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
                  Save Changes
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
