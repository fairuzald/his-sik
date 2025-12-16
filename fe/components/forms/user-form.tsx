"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { User } from "@/data/mock-data";

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: Partial<User> & { password?: string }) => void;
  onCancel: () => void;
}

const roles = [
  { id: "1", name: "Pasien" },
  { id: "2", name: "Dokter" },
  { id: "3", name: "Staf Pendaftaran" },
  { id: "4", name: "Staf Farmasi" },
  { id: "5", name: "Staf Lab" },
  { id: "6", name: "Staf Kasir" },
  { id: "7", name: "Admin" },
];

export function UserForm({ initialData, onSubmit, onCancel }: UserFormProps) {
  const userSchema = z
    .object({
      username: z.string().min(1, "Nama pengguna wajib diisi"),
      email: z.string().email("Email tidak valid").optional().or(z.literal("")),
      phone_number: z.string().optional(),
      role_id: z.string().min(1, "Peran wajib diisi"),
      status: z.string().min(1, "Status wajib diisi"),
      password: z.string().optional(),
    })
    .refine(
      data => {
        if (!initialData && !data.password) {
          return false;
        }
        return true;
      },
      {
        message: "Kata sandi wajib diisi untuk pengguna baru",
        path: ["password"],
      }
    );

  type UserFormValues = z.infer<typeof userSchema>;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: initialData || {
      username: "",
      email: "",
      phone_number: "",
      role_id: "",
      status: "Aktif",
      password: "",
    },
  });

  const handleSubmit = (data: UserFormValues) => {
    const role = roles.find(r => r.id === data.role_id);
    onSubmit({
      ...data,
      role_name: role?.name || "",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Pengguna *</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Telepon</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Peran *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih peran" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Active">Aktif</SelectItem>
                    <SelectItem value="Inactive">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {!initialData && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kata Sandi *</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit">Simpan Pengguna</Button>
        </div>
      </form>
    </Form>
  );
}
