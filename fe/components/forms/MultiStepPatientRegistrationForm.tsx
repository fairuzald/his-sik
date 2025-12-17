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
import { Check } from "lucide-react";
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

interface MultiStepPatientRegistrationFormProps {
  onSubmit: (data: SimplePatientFormValues) => void;
  isLoading: boolean;
  submitText?: string;
}

const STEPS = [
  {
    id: 1,
    title: "Account",
    description: "Create your login credentials",
  },
  {
    id: 2,
    title: "Profile",
    description: "Tell us about yourself",
  },
  {
    id: 3,
    title: "Patient Info",
    description: "Required patient details",
  },
];

export function MultiStepPatientRegistrationForm({
  onSubmit,
  isLoading,
  submitText = "Create Account",
}: MultiStepPatientRegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
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

  const handleChange = (
    field: keyof SimplePatientFormValues,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return (
          formData.username.length >= 3 &&
          formData.password.length >= 6 &&
          formData.full_name.length > 0
        );
      case 2:
        return true; // Email and phone are optional
      case 3:
        return (
          formData.nik.length === 16 &&
          formData.date_of_birth.length > 0 &&
          formData.gender.length > 0
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      onSubmit(formData);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm transition-colors ${
                  currentStep > step.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : currentStep === step.id
                      ? "border-primary bg-background text-primary"
                      : "border-muted bg-background text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="font-semibold">{step.id}</span>
                )}
              </div>
              <div className="text-center">
                <p
                  className={`text-xs font-medium ${
                    currentStep >= step.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </p>
              </div>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`mx-1 h-0.5 flex-1 transition-colors ${
                  currentStep > step.id ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Account Information */}
        {currentStep === 1 && (
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold">Create Your Account</h3>
              <p className="text-muted-foreground text-xs">
                Choose a username and secure password
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="username" className="text-sm">
                Username <span className="text-destructive">*</span>
              </Label>
              <Input
                id="username"
                value={formData.username}
                onChange={e => handleChange("username", e.target.value)}
                required
                minLength={3}
                maxLength={50}
                placeholder="Choose a unique username"
                autoFocus
                className="h-9"
              />
              <p className="text-muted-foreground text-xs">
                At least 3 characters
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm">
                Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={e => handleChange("password", e.target.value)}
                required
                minLength={6}
                placeholder="At least 6 characters"
                className="h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="full_name" className="text-sm">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={e => handleChange("full_name", e.target.value)}
                required
                placeholder="Your full legal name"
                className="h-9"
              />
            </div>
          </div>
        )}

        {/* Step 2: Contact Information */}
        {currentStep === 2 && (
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <p className="text-muted-foreground text-xs">
                How can we reach you? (Optional but recommended)
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => handleChange("email", e.target.value)}
                placeholder="your.email@example.com"
                autoFocus
                className="h-9"
              />
              <p className="text-muted-foreground text-xs">
                For account recovery and notifications
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone_number" className="text-sm">
                Phone Number
              </Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={e => handleChange("phone_number", e.target.value)}
                placeholder="08123456789"
                className="h-9"
              />
              <p className="text-muted-foreground text-xs">
                For appointment reminders and updates
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Patient Information */}
        {currentStep === 3 && (
          <div className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold">Patient Information</h3>
              <p className="text-muted-foreground text-xs">
                Required for medical records and appointments
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="nik" className="text-sm">
                NIK - Indonesian ID Number{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nik"
                value={formData.nik}
                onChange={e => handleChange("nik", e.target.value)}
                required
                minLength={16}
                maxLength={16}
                pattern="[0-9]{16}"
                placeholder="1234567890123456"
                autoFocus
                className="h-9"
              />
              <p className="text-muted-foreground text-xs">
                16-digit National ID number
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="date_of_birth" className="text-sm">
                Date of Birth <span className="text-destructive">*</span>
              </Label>
              <Input
                id="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={e => handleChange("date_of_birth", e.target.value)}
                required
                className="h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="gender" className="text-sm">
                Gender <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.gender}
                onValueChange={value => handleChange("gender", value)}
                required
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={GenderEnum.L}>Male</SelectItem>
                  <SelectItem value={GenderEnum.P}>Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border border-muted bg-muted/50 p-3">
              <p className="text-xs">
                <span className="font-medium">Note:</span> Additional details
                like BPJS number, blood type, address, and emergency contacts
                can be added later in your profile settings.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-3 pt-2">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={isLoading}
              size="sm"
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          {currentStep < STEPS.length ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
              className="ml-auto"
              size="sm"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isLoading || !validateStep(currentStep)}
              className="ml-auto"
              size="sm"
            >
              {isLoading ? "Creating Account..." : submitText}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
