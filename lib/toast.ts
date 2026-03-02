import { addToast } from "@heroui/toast";

export function successToast(message: string, description?: string) {
  addToast({
    title: message,
    description,
    color: "success",
  });
}

export function errorToast(message: string, description?: string) {
  addToast({
    title: message,
    description,
    color: "danger",
    size: "sm",
  });
}
