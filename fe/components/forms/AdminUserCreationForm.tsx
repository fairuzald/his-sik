"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  BloodTypeEnum,
  GenderEnum,
  StaffDepartmentEnum,
} from "@/sdk/output/types.gen";
import { useState } from "react";

export interface AdminUserFormValues {
  // Common fields
  username: string;
  password: string;
  full_name: string;
  email?: string;
  phone_number?: string;
  role: "patient" | "doctor" | "staff";

  // Patient-specific
  nik?: string;
  date_of_birth?: string;
  gender?: GenderEnum;
  bpjs_number?: string;
  blood_type?: BloodTypeEnum;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;

  // Doctor-specific
  specialty?: string;
  sip_number?: string;
  str_number?: string;

  // Staff-specific
  department?: StaffDepartmentEnum;
}

interface AdminUserCreationFormProps {
  onSubmit: (data: AdminUserFormValues) => void;
  isLoading: boolean;
  submitText?: string;
}

export function AdminUserCreationForm({
  onSubmit,
  isLoading,
  submitText = "Create User",
}: AdminUserCreationFormProps) {
  const [formData, setFormData] = useState<AdminUserFormValues>({
    username: "",
    password: "",
    full_name: "",
    email: "",
    phone_number: "",
    role: "patient",
    // Patient defaults
    nik: "",
    date_of_birth: "",
    gender: GenderEnum.L,
    bpjs_number: "",
    address: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    // Doctor defaults
    specialty: "",
    sip_number: "",
    str_number: "",
    // Staff defaults
    department: StaffDepartmentEnum.REGISTRATION,
  });

  const handleChange = (field: keyof AdminUserFormValues, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Common Fields */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Account Information</h3>

        <div className="space-y-2">
          <Label htmlFor="role">
            Role <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.role}
            onValueChange={value =>
              handleChange("role", value as "patient" | "doctor" | "staff")
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="patient">Patient</SelectItem>
              <SelectItem value="doctor">Doctor</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="username">
              Username <span className="text-destructive">*</span>
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={e => handleChange("username", e.target.value)}
              required
              minLength={3}
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password <span className="text-destructive">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={e => handleChange("password", e.target.value)}
              required
              minLength={6}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="full_name">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={e => handleChange("full_name", e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => handleChange("email", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              value={formData.phone_number}
              onChange={e => handleChange("phone_number", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Patient-Specific Fields */}
      {formData.role === "patient" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Patient Information</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nik">
                NIK <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nik"
                value={formData.nik}
                onChange={e => handleChange("nik", e.target.value)}
                required
                minLength={16}
                maxLength={16}
                pattern="[0-9]{16}"
                placeholder="16-digit ID number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">
                Date of Birth <span className="text-destructive">*</span>
              </Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={e => handleChange("date_of_birth", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="gender">
                Gender <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.gender}
                onValueChange={value => handleChange("gender", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={GenderEnum.L}>Male</SelectItem>
                  <SelectItem value={GenderEnum.P}>Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bpjs_number">BPJS Number</Label>
              <Input
                id="bpjs_number"
                value={formData.bpjs_number}
                onChange={e => handleChange("bpjs_number", e.target.value)}
                maxLength={20}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="blood_type">Blood Type</Label>
            <Select
              value={formData.blood_type}
              onValueChange={value => handleChange("blood_type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select blood type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={BloodTypeEnum.A}>A</SelectItem>
                <SelectItem value={BloodTypeEnum.B}>B</SelectItem>
                <SelectItem value={BloodTypeEnum.AB}>AB</SelectItem>
                <SelectItem value={BloodTypeEnum.O}>O</SelectItem>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={e => handleChange("address", e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="emergency_contact_name">
                Emergency Contact Name
              </Label>
              <Input
                id="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={e =>
                  handleChange("emergency_contact_name", e.target.value)
                }
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergency_contact_phone">
                Emergency Contact Phone
              </Label>
              <Input
                id="emergency_contact_phone"
                value={formData.emergency_contact_phone}
                onChange={e =>
                  handleChange("emergency_contact_phone", e.target.value)
                }
                maxLength={20}
              />
            </div>
          </div>
        </div>
      )}

      {/* Doctor-Specific Fields */}
      {formData.role === "doctor" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Doctor Information</h3>

          <div className="space-y-2">
            <Label htmlFor="specialty">Medical Specialty</Label>
            <Input
              id="specialty"
              value={formData.specialty}
              onChange={e => handleChange("specialty", e.target.value)}
              placeholder="e.g., Cardiology, Pediatrics"
              maxLength={100}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sip_number">SIP Number</Label>
              <Input
                id="sip_number"
                value={formData.sip_number}
                onChange={e => handleChange("sip_number", e.target.value)}
                placeholder="Surat Izin Praktek"
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="str_number">STR Number</Label>
              <Input
                id="str_number"
                value={formData.str_number}
                onChange={e => handleChange("str_number", e.target.value)}
                placeholder="16-digit STR"
                maxLength={16}
                pattern="[0-9]{16}"
              />
            </div>
          </div>
        </div>
      )}

      {/* Staff-Specific Fields */}
      {formData.role === "staff" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Staff Information</h3>

          <div className="space-y-2">
            <Label htmlFor="department">
              Department <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.department}
              onValueChange={value => handleChange("department", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={StaffDepartmentEnum.REGISTRATION}>
                  Registration
                </SelectItem>
                <SelectItem value={StaffDepartmentEnum.PHARMACY}>
                  Pharmacy
                </SelectItem>
                <SelectItem value={StaffDepartmentEnum.LABORATORY}>
                  Laboratory
                </SelectItem>
                <SelectItem value={StaffDepartmentEnum.CASHIER}>
                  Cashier
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Creating..." : submitText}
      </Button>
    </form>
  );
}
