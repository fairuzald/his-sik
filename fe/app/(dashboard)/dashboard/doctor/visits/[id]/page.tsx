"use client";

import { LabOrderTab } from "@/components/dashboard/doctor/visit-detail/LabOrderTab";
import { MedicalRecordTab } from "@/components/dashboard/doctor/visit-detail/MedicalRecordTab";
import { PrescriptionTab } from "@/components/dashboard/doctor/visit-detail/PrescriptionTab";
import { WearableDataTab } from "@/components/dashboard/doctor/visit-detail/WearableDataTab";
import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { safeApiCall } from "@/lib/api-handler";
import {
  getVisitApiVisitsVisitIdGet,
  listLabOrdersApiLabOrdersGet,
  listLabTestsApiLabTestsGet,
  listMedicalRecordsApiMedicalRecordsGet,
  listPrescriptionsApiPrescriptionsGet,
  updateVisitApiVisitsVisitIdPatch,
} from "@/sdk/output/sdk.gen";
import {
  LabOrderDto,
  LabTestDto,
  MedicalRecordDto,
  PrescriptionDto,
  VisitDto,
  VisitStatusEnum,
} from "@/sdk/output/types.gen";
import {
  Activity,
  ArrowLeft,
  FileText,
  FlaskConical,
  Loader2,
  Pill,
  Save,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function DoctorVisitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const visitId = params.id as string;

  const [visit, setVisit] = useState<VisitDto | null>(null);
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecordDto | null>(
    null
  );
  const [labTests, setLabTests] = useState<LabTestDto[]>([]);
  const [labOrders, setLabOrders] = useState<LabOrderDto[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    if (!visitId) return;

    // 1. Fetch Visit
    const visitData = await safeApiCall(
      getVisitApiVisitsVisitIdGet({
        path: { visit_id: visitId },
      })
    );
    if (visitData) setVisit(visitData);

    // 2. Fetch Medical Record for this visit
    const records = await safeApiCall(
      listMedicalRecordsApiMedicalRecordsGet({
        query: { visit_id: visitId, limit: 100 },
      })
    );
    if (records) {
      setMedicalRecord(records[0] || null);
    }

    // 3. Fetch Lab Tests
    const tests = await safeApiCall(listLabTestsApiLabTestsGet());
    if (tests) setLabTests(tests);

    // 4. Fetch Lab Orders
    const orders = await safeApiCall(
      listLabOrdersApiLabOrdersGet({
        query: { visit_id: visitId, limit: 100 },
      })
    );
    if (orders) {
      setLabOrders(orders);
    }

    // 5. Fetch Prescriptions
    const prescs = await safeApiCall(
      listPrescriptionsApiPrescriptionsGet({
        query: { visit_id: visitId, limit: 100 },
      })
    );
    if (prescs) {
      setPrescriptions(prescs);
    }

    setIsLoading(false);
  }, [visitId]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleFinishConsultation = async () => {
    if (!visit) return;
    if (confirm("Are you sure you want to finish this consultation?")) {
      await safeApiCall(
        updateVisitApiVisitsVisitIdPatch({
          path: { visit_id: visit.id },
          body: {
            visit_status: VisitStatusEnum.COMPLETED,
          },
        }),
        { successMessage: "Consultation finished" }
      );
      router.push("/dashboard/doctor");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!visit) {
    return <div>Visit not found</div>;
  }

  return (
    <div className="space-y-8 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/doctor">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <H2 className="text-primary text-2xl font-bold tracking-tight">
              Consultation: {visit.patient_id.substring(0, 8)}...
            </H2>
            <div className="mt-1 flex items-center gap-2">
              <P className="text-muted-foreground">
                ID: {visit.id.substring(0, 8)}
              </P>
              <Badge>{visit.visit_status}</Badge>
              {/* Patient info placeholder */}
              <Badge variant="outline">Patient Info</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">View History</Button>
          <Button
            className="gap-2"
            onClick={handleFinishConsultation}
            disabled={visit.visit_status === VisitStatusEnum.COMPLETED}
          >
            <Save className="h-4 w-4" />
            Finish Consultation
          </Button>
        </div>
      </div>

      <Tabs defaultValue="record" className="space-y-6">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="record" className="gap-2">
            <FileText className="h-4 w-4" />
            Medical Record
          </TabsTrigger>
          <TabsTrigger value="prescription" className="gap-2">
            <Pill className="h-4 w-4" />
            Prescriptions
          </TabsTrigger>
          <TabsTrigger value="labs" className="gap-2">
            <FlaskConical className="h-4 w-4" />
            Lab Orders
          </TabsTrigger>
          <TabsTrigger value="wearables" className="gap-2">
            <Activity className="h-4 w-4" />
            Wearables Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="record">
          <MedicalRecordTab
            visitId={visitId}
            medicalRecord={medicalRecord}
            onUpdate={setMedicalRecord}
          />
        </TabsContent>

        <TabsContent value="prescription">
          <PrescriptionTab
            visitId={visitId}
            prescriptions={prescriptions}
            onRefresh={fetchAllData}
          />
        </TabsContent>

        <TabsContent value="labs">
          <LabOrderTab
            visitId={visitId}
            labOrders={labOrders}
            labTests={labTests}
            onRefresh={fetchAllData}
          />
        </TabsContent>

        <TabsContent value="wearables">
          <WearableDataTab patientId={visit.patient_id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
