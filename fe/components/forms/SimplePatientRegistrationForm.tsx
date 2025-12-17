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
import { GenderEnum } from "@/sdk/output/types.gen";
import { useState } from "react";

export interface SimplePatientFormValues {
  username: string;
  password: string;
  full_name: string;
  email?: string;
  phone_number?: string;
  nik: string;
  date_of_birth: string;
  gender: GenderEnum;
}

interface SimplePatientRegistrationFormProps {
  onSubmit: (data: SimplePatientFormValues) => void;
  isLoading: boolean;
  submitText?: string;
}

export function SimplePatientRegistrationForm({
  onSubmit,
  isLoading,
  submitText = "Register",
}: SimplePatientRegistrationFormProps) {
  const [formData, setFormData] = useState<SimplePatientFormValues>({
    username: "",
    password: "",
    full_name: "",
    email: "",
    phone_number: "",
    nik: "",
    date_of_birth: "",
    gender: GenderEnum.L,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    field: keyof SimplePatientFormValues,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Account Information */}
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
            placeholder="Choose a username"
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
            placeholder="At least 6 characters"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={e => handleChange("full_name", e.target.value)}
            required
            placeholder="Your full name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={e => handleChange("email", e.target.value)}
            placeholder="your.email@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input
            id="phone_number"
            value={formData.phone_number}
            onChange={e => handleChange("phone_number", e.target.value)}
            placeholder="08123456789"
          />
        </div>
      </div>

      {/* Patient Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Patient Information</h3>
        <p className="text-muted-foreground text-sm">
          Additional details can be updated later in your profile.
        </p>

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
          <p className="text-muted-foreground text-xs">
            Your Indonesian National ID number
          </p>
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
              <SelectItem value={GenderEnum.L}>Male</SelectItem>
              <SelectItem value={GenderEnum.P}>Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating Account..." : submitText}
      </Button>
    </form>
  );
}

