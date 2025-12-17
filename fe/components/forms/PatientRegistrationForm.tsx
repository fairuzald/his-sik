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
import { BloodTypeEnum, GenderEnum } from "@/sdk/output/types.gen";
import { useState } from "react";

export interface PatientFormValues {
  username: string;
  password: string;
  full_name: string;
  email?: string;
  phone_number?: string;
  nik: string;
  date_of_birth: string;
  gender: GenderEnum;
  bpjs_number?: string;
  blood_type?: BloodTypeEnum;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

interface PatientRegistrationFormProps {
  onSubmit: (data: PatientFormValues) => void;
  isLoading: boolean;
  submitText?: string;
}

export function PatientRegistrationForm({
  onSubmit,
  isLoading,
  submitText = "Register",
}: PatientRegistrationFormProps) {
  const [formData, setFormData] = useState<PatientFormValues>({
    username: "",
    password: "",
    full_name: "",
    email: "",
    phone_number: "",
    nik: "",
    date_of_birth: "",
    gender: GenderEnum.L,
    bpjs_number: "",
    address: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof PatientFormValues, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* User Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Account Information</h3>

        <div className="space-y-2">
          <Label htmlFor="username">Username *</Label>
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
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={e => handleChange("password", e.target.value)}
            required
            minLength={6}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={e => handleChange("full_name", e.target.value)}
            required
          />
        </div>

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

      {/* Patient-Specific Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Patient Information</h3>

        <div className="space-y-2">
          <Label htmlFor="nik">NIK (16 digits) *</Label>
          <Input
            id="nik"
            value={formData.nik}
            onChange={e => handleChange("nik", e.target.value)}
            required
            minLength={16}
            maxLength={16}
            pattern="[0-9]{16}"
            placeholder="1234567890123456"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of Birth *</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={e => handleChange("date_of_birth", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select
            value={formData.gender}
            onValueChange={value => handleChange("gender", value)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={GenderEnum.L}>Male (L)</SelectItem>
              <SelectItem value={GenderEnum.P}>Female (P)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bpjs_number">BPJS Number (optional)</Label>
          <Input
            id="bpjs_number"
            value={formData.bpjs_number}
            onChange={e => handleChange("bpjs_number", e.target.value)}
            maxLength={20}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="blood_type">Blood Type</Label>
          <Select
            value={formData.blood_type}
            onValueChange={value =>
              handleChange("blood_type", value as BloodTypeEnum)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select blood type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={BloodTypeEnum.A}>A</SelectItem>
              <SelectItem value={BloodTypeEnum.B}>B</SelectItem>
              <SelectItem value={BloodTypeEnum.AB}>AB</SelectItem>
              <SelectItem value={BloodTypeEnum.O}>O</SelectItem>
              <SelectItem value={BloodTypeEnum["A+"]}>A+</SelectItem>
              <SelectItem value={BloodTypeEnum["A-"]}>A-</SelectItem>
              <SelectItem value={BloodTypeEnum["B+"]}>B+</SelectItem>
              <SelectItem value={BloodTypeEnum["B-"]}>B-</SelectItem>
              <SelectItem value={BloodTypeEnum["AB+"]}>AB+</SelectItem>
              <SelectItem value={BloodTypeEnum["AB-"]}>AB-</SelectItem>
              <SelectItem value={BloodTypeEnum["O+"]}>O+</SelectItem>
              <SelectItem value={BloodTypeEnum["O-"]}>O-</SelectItem>
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

        <div className="space-y-2">
          <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
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

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Registering..." : submitText}
      </Button>
    </form>
  );
}
