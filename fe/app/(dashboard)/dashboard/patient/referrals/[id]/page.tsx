"use client";

import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { safeApiCall } from "@/lib/api-handler";
import { getReferralApiReferralsReferralIdGet } from "@/sdk/output/sdk.gen";
import { ReferralDto } from "@/sdk/output/types.gen";
import { format } from "date-fns";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PatientReferralDetailPage() {
  const params = useParams();
  const referralId = params.id as string;
  const [referral, setReferral] = useState<ReferralDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReferral = async () => {
      setIsLoading(true);
      const result = await safeApiCall(
        getReferralApiReferralsReferralIdGet({
          path: { referral_id: referralId },
        })
      );
      if (result) {
        setReferral(result);
      }
      setIsLoading(false);
    };
    fetchReferral();
  }, [referralId]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!referral) {
    return <div className="p-8 text-center">Referral not found</div>;
  }

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/patient/referrals">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <H2 className="text-primary text-2xl font-bold tracking-tight">
            Referral Details
          </H2>
          <P className="text-muted-foreground">
            Created on {format(new Date(referral.created_at), "PPP")}
          </P>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Referral Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-muted-foreground text-sm">
                Referred To Facility
              </Label>
              <p className="mt-1 font-medium">
                {referral.referred_to_facility}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Specialty</Label>
              <p className="mt-1">{referral.specialty || "-"}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Status</Label>
              <div className="mt-1">
                <Badge
                  variant={
                    referral.referral_status === "completed"
                      ? "default"
                      : "secondary"
                  }
                  className={
                    referral.referral_status === "completed"
                      ? "bg-green-500"
                      : ""
                  }
                >
                  {referral.referral_status}
                </Badge>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">
                Date Created
              </Label>
              <p className="mt-1">
                {format(new Date(referral.created_at), "PPP p")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Doctor Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-muted-foreground text-sm">
                Referring Doctor
              </Label>
              <p className="font-mono mt-1 text-sm">
                {referral.referring_doctor_id.substring(0, 8)}...
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground text-sm">Visit ID</Label>
              <p className="font-mono mt-1 text-sm">
                {referral.visit_id?.substring(0, 8) || "-"}...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clinical Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-muted-foreground text-sm">
              Reason for Referral
            </Label>
            <p className="mt-1 whitespace-pre-wrap">{referral.reason}</p>
          </div>
          {referral.diagnosis && (
            <div>
              <Label className="text-muted-foreground text-sm">Diagnosis</Label>
              <p className="mt-1 whitespace-pre-wrap">{referral.diagnosis}</p>
            </div>
          )}
          {referral.notes && (
            <div>
              <Label className="text-muted-foreground text-sm">
                Additional Notes
              </Label>
              <p className="mt-1 whitespace-pre-wrap">{referral.notes}</p>
            </div>
          )}
          {referral.attachment_url && (
            <div>
              <Label className="text-muted-foreground text-sm">Attachment</Label>
              <p className="mt-1">
                <a
                  href={referral.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View Attachment
                </a>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          <strong>Note:</strong> This referral was created by your doctor. If
          you have any questions about this referral, please contact your
          healthcare provider or the facility listed above.
        </p>
      </div>
    </div>
  );
}
