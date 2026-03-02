"use client";

import { Select, SelectItem } from "@heroui/react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

type CustomSelectOption = {
  label: string;
  value: string;
};

type CustomSelectProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  options: CustomSelectOption[];
  placeholder?: string;
  isRequired?: boolean;
  className?: string;
  isDisabled?: boolean;
};

export default function CustomSelect<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder,
  isRequired,
  className,
  isDisabled,
}: CustomSelectProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Select
          label={label}
          labelPlacement="outside"
          placeholder={placeholder}
          selectedKeys={field.value ? [String(field.value)] : []}
          onSelectionChange={(keys) => {
            const selectedValue = Array.from(keys)[0];
            field.onChange(selectedValue ? String(selectedValue) : "");
          }}
          isRequired={isRequired}
          isDisabled={isDisabled}
          className={className}
          isInvalid={Boolean(fieldState.error)}
          errorMessage={fieldState.error?.message}
        >
          {options.map((option) => (
            <SelectItem key={option.value}>{option.label}</SelectItem>
          ))}
        </Select>
      )}
    />
  );
}
