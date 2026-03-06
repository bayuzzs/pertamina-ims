"use client";

import { errorToast, successToast } from "@/lib/toast";
import { createInventoryMovement } from "@/services/inventory-movement.service";
import { getActiveItems } from "@/services/item.service";
import type { CreateInventoryMovementPayload } from "@/types/inventory-movement";
import type { Item } from "@/types/item";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { DatePicker } from "@heroui/date-picker";
import { Button, Input, Textarea } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type NewStockRequestFormProps = {
  accessToken?: string;
};

const newStockRequestSchema = z.object({
  itemId: z.string().trim().uuid("Item is required."),
  remark: z.string().trim().optional(),
  area: z.string().trim().min(1, "Area is required."),
  equipment: z.string().trim().min(1, "Equipment is required."),
  date: z.string().trim().min(1, "Date is required."),
  quantity: z
    .string()
    .trim()
    .min(1, "Quantity is required.")
    .regex(/^\d+$/, "Quantity must be a number."),
  technicianNote: z.string().trim().min(1, "Technician note is required."),
});

type NewStockRequestFormValues = z.infer<typeof newStockRequestSchema>;

const INITIAL_FORM: NewStockRequestFormValues = {
  itemId: "",
  remark: "",
  area: "",
  equipment: "",
  date: "",
  quantity: "",
  technicianNote: "",
};

export default function NewStockRequestForm({
  accessToken,
}: NewStockRequestFormProps) {
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm<NewStockRequestFormValues>({
    resolver: zodResolver(newStockRequestSchema),
    defaultValues: INITIAL_FORM,
    mode: "onChange",
  });

  const selectedItemId = watch("itemId");

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId),
    [items, selectedItemId],
  );

  useEffect(() => {
    let isMounted = true;

    const fetchItems = async () => {
      try {
        setItemsLoading(true);
        setItemsError("");

        const activeItems = await getActiveItems({ accessToken });

        if (!isMounted) {
          return;
        }

        setItems(activeItems);
      } catch {
        if (!isMounted) {
          return;
        }

        setItems([]);
        setItemsError("Failed to load active items.");
      } finally {
        if (isMounted) {
          setItemsLoading(false);
        }
      }
    };

    fetchItems();

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  const onSubmit = async (values: NewStockRequestFormValues) => {
    setErrorMessage("");

    const payload: CreateInventoryMovementPayload = {
      itemId: values.itemId,
      remark: values.remark?.trim() || undefined,
      area: values.area.trim(),
      equipment: values.equipment.trim(),
      date: values.date.trim(),
      quantity: values.quantity.trim(),
      technicianNote: values.technicianNote.trim(),
    };

    try {
      await createInventoryMovement({
        accessToken,
        payload,
      });

      reset(INITIAL_FORM);
      successToast("Stock request submitted successfully");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        "Failed to submit stock request. Please try again in a moment.",
      );

      if (error instanceof AxiosError) {
        errorToast(
          error.response?.data?.message ||
            "Failed to submit stock request. Please try again in a moment.",
        );
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Controller
          control={control}
          name="itemId"
          render={({ field, fieldState }) => (
            <Autocomplete
              label="Item"
              labelPlacement="outside"
              placeholder="Search active item"
              selectedKey={field.value || null}
              onSelectionChange={(key) =>
                field.onChange(key ? String(key) : "")
              }
              onBlur={field.onBlur}
              isRequired
              isLoading={itemsLoading}
              isDisabled={itemsLoading || items.length === 0}
              isInvalid={Boolean(fieldState.error)}
              errorMessage={fieldState.error?.message}
              className="sm:col-span-2"
            >
              {items.map((item) => (
                <AutocompleteItem
                  key={item.id}
                  textValue={`${item.itemNo} ${item.name}`}
                >
                  {`${item.itemNo} - ${item.name}`}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          )}
        />

        <Controller
          control={control}
          name="quantity"
          render={({ field, fieldState }) => (
            <Input
              type="number"
              label="Quantity"
              labelPlacement="outside"
              placeholder="0"
              min={1}
              value={field.value}
              onValueChange={field.onChange}
              isRequired
              isInvalid={Boolean(fieldState.error)}
              errorMessage={fieldState.error?.message}
              description={
                selectedItem
                  ? `Available stock: ${selectedItem.stock} ${selectedItem.unit}`
                  : "Select item first to see current stock"
              }
            />
          )}
        />

        <Controller
          control={control}
          name="date"
          render={({ field, fieldState }) => (
            <DatePicker
              label="Date"
              labelPlacement="outside"
              onChange={(value) =>
                field.onChange(value ? value.toString() : "")
              }
              onBlur={field.onBlur}
              isRequired
              isInvalid={Boolean(fieldState.error)}
              errorMessage={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="area"
          render={({ field, fieldState }) => (
            <Input
              label="Area"
              labelPlacement="outside"
              placeholder="Area name"
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
          name="equipment"
          render={({ field, fieldState }) => (
            <Input
              label="Equipment"
              labelPlacement="outside"
              placeholder="Equipment name"
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
          name="remark"
          render={({ field, fieldState }) => (
            <Textarea
              label="Remark"
              labelPlacement="outside"
              placeholder="Optional remark"
              value={field.value}
              onValueChange={field.onChange}
              minRows={2}
              className="sm:col-span-2"
              isInvalid={Boolean(fieldState.error)}
              errorMessage={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="technicianNote"
          render={({ field, fieldState }) => (
            <Textarea
              label="Technician Note"
              labelPlacement="outside"
              placeholder="Describe purpose and usage details"
              value={field.value}
              onValueChange={field.onChange}
              minRows={3}
              className="sm:col-span-2"
              isRequired
              isInvalid={Boolean(fieldState.error)}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </div>

      {itemsError ? <p className="text-danger text-xs">{itemsError}</p> : null}
      {errorMessage ? (
        <p className="text-danger text-xs">{errorMessage}</p>
      ) : null}

      <div className="flex justify-end">
        <Button
          color="primary"
          type="submit"
          isLoading={isSubmitting}
          isDisabled={!isValid || itemsLoading}
        >
          Submit Request
        </Button>
      </div>
    </form>
  );
}
