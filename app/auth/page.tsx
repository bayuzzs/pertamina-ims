"use client";

import { Button, Input, Link } from "@heroui/react";
import { Tab, Tabs } from "@heroui/tabs";
import { addToast } from "@heroui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Key } from "react";
import {
  Controller,
  type FieldErrors,
  useForm,
  useWatch,
} from "react-hook-form";
import { MdBarChart, MdFactory, MdVerifiedUser } from "react-icons/md";
import { z } from "zod";

type Role = "admin" | "technician";

const loginSchema = z.object({
  role: z.enum(["admin", "technician"]),
  username: z.string().trim().min(1, "Username wajib diisi."),
  password: z.string().min(1, "Password wajib diisi."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: "admin",
      username: "",
      password: "",
    },
  });

  const role = useWatch({
    control,
    name: "role",
  });

  const showErrorToast = (message: string) => {
    addToast({
      title: "Login Gagal",
      description: message,
      color: "danger",
    });
  };

  const handleRoleChange = (key: Key) => {
    const nextRole = String(key);
    if (nextRole === "admin" || nextRole === "technician") {
      setValue("role", nextRole as Role, {
        shouldValidate: true,
      });
    }
  };

  const onInvalid = (errors: FieldErrors<LoginFormValues>) => {
    const firstErrorMessage =
      errors.username?.message ||
      errors.password?.message ||
      errors.role?.message ||
      "Data login tidak valid.";

    showErrorToast(firstErrorMessage);
  };

  const onSubmit = async (values: LoginFormValues) => {
    const { username, password, role: selectedRole } = values;

    try {
      const loginResult = await signIn("credentials", {
        username,
        password,
        role: selectedRole,
        redirect: false,
      });

      if (loginResult?.error || !loginResult?.ok) {
        showErrorToast("Username, password, atau role tidak valid.");
        return;
      }

      const session = await getSession();
      const signedInRole = session?.user?.role;

      if (!signedInRole) {
        showErrorToast("Login berhasil, tetapi sesi tidak tersedia.");
        return;
      }

      if (signedInRole !== selectedRole) {
        await signOut({ redirect: false });
        showErrorToast("Role akun tidak sesuai dengan role yang dipilih.");
        return;
      }

      const submitResult = {
        success: Boolean(loginResult.ok),
        role: signedInRole,
        username: session?.user?.username ?? username,
      };

      console.log("Submit result:", submitResult);

      router.replace(signedInRole === "admin" ? "/admin" : "/technician");
    } catch {
      showErrorToast("Failed to submit form. Please try again.");
    }
  };

  return (
    <main className="bg-default-50 text-foreground min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-2">
        <section className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-linear-to-br bg-[url('/auth-bg.png')] bg-cover bg-center bg-no-repeat" />
          <div className="absolute inset-0 z-10 bg-blue-900/80 mix-blend-multiply"></div>

          <div className="relative z-10 mx-auto flex h-full w-2xl flex-col justify-center p-14 text-white">
            <div className="mb-5 flex items-center gap-3 text-3xl tracking-tight">
              <MdFactory size={48} />
              <span className="text-2xl">Pertamina IMS</span>
            </div>

            <h1 className="max-w-xl text-6xl leading-tight font-bold tracking-tight">
              Efficient Inventory Management for Aviation Fuel.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-white/85">
              Securely manage terminal operations, monitor stock levels, and
              streamline logistics with our enterprise-grade platform.
            </p>

            <div className="mt-10 flex items-center gap-6 text-sm text-white/90">
              <div className="flex items-center gap-2">
                <MdVerifiedUser size={20} />
                <span>Secure Access</span>
              </div>
              <span className="text-white/50">•</span>
              <div className="flex items-center gap-2">
                <MdBarChart size={20} />
                <span>Real-time Data</span>
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-8 space-y-4">
              <div className="flex items-end gap-1">
                <span className="bg-primary h-8 w-9 rounded-sm" />
                <span className="bg-success h-8 w-9 rounded-sm" />
                <span className="bg-danger h-8 w-9 rounded-sm" />
              </div>

              <div>
                <p className="text-default-400 text-xs font-semibold tracking-[0.18em] uppercase">
                  Aviation Fuel Terminal
                </p>
                <h2 className="text-foreground mt-4 text-4xl font-bold tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-default-500 mt-2">
                  Please enter your details to log in to the system.
                </p>
              </div>
            </div>

            <form
              className="space-y-8"
              onSubmit={handleSubmit(onSubmit, onInvalid)}
            >
              <div>
                <label className="text-foreground text-sm font-medium">
                  Select Role
                </label>
                <Tabs
                  aria-label="Select role"
                  selectedKey={role}
                  onSelectionChange={handleRoleChange}
                  fullWidth
                >
                  <Tab key="admin" title="Admin" />
                  <Tab key="technician" title="Technician" />
                </Tabs>
              </div>

              <Controller
                control={control}
                name="username"
                render={({ field }) => (
                  <Input
                    label="Username"
                    labelPlacement="outside"
                    placeholder="your.username"
                    type="text"
                    variant="bordered"
                    value={field.value}
                    onValueChange={field.onChange}
                    isRequired
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <Input
                    placeholder="••••••••"
                    type="password"
                    variant="bordered"
                    value={field.value}
                    onValueChange={field.onChange}
                    label="Password"
                    labelPlacement="outside-top"
                    isRequired
                  />
                )}
              />

              <Button
                type="submit"
                color="primary"
                className="w-full font-semibold"
                isLoading={isSubmitting}
              >
                Sign In
              </Button>
            </form>

            <div className="text-default-400 mt-14 flex items-center justify-between text-xs">
              <p>© 2026 Pertamina.</p>
              <Link href="#" size="sm" color="foreground">
                Help &amp; Support
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
