"use client";

import { WearableChart } from "@/components/dashboard/WearableChart";
import { H2, P } from "@/components/elements/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { heartRateData, spo2Data } from "@/data/mock-data";
import { safeApiCall } from "@/lib/api-handler";
import {
  createMedicalRecordApiMedicalRecordsPost,
  getVisitApiVisitsVisitIdGet,
  listLabOrdersApiLabOrdersGet,
  listLabTestsApiLabTestsGet,
  listMedicalRecordsApiMedicalRecordsGet,
  listPrescriptionsApiPrescriptionsGet,
  updateMedicalRecordApiMedicalRecordsRecordIdPut,
  updateVisitApiVisitsVisitIdPut,
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
import { useEffect, useState } from "react";

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
  const [prescriptions, setPrescriptions] = useState<PrescriptionDto[]>([]); // Placeholder for now
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form States for Medical Record
  const [anamnesis, setAnamnesis] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [physicalExam, setPhysicalExam] = useState("");
  const [plan, setPlan] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      if (!visitId) return;

      // 1. Fetch Visit
      const visitData = await safeApiCall(
        getVisitApiVisitsVisitIdGet({
          path: { visit_id: visitId },
        })
      );
      if (visitData) setVisit(visitData);

      // 2. Fetch Medical Record for this visit
      // Since list filter by visit_id is not explicitly clear in SDK signature for `listMedicalRecordsApiMedicalRecordsGet` (it usually has query params),
      // we might need to fetch all and filter or rely on the backend connection.
      // Checking `ListMedicalRecordsApiMedicalRecordsGetData`: query params: page, limit, patient_id?
      // If no visit_id filter, we might need `patient_id` from visit.
      // Let's assume for now we might create one if none exists or fetch if we can.
      // Ideally, the VisitDto would link it, or we fetch by patient.
      // Let's try fetching by patient if we had patient ID. `visitData.patient_id`.

      const records = await safeApiCall(
        listMedicalRecordsApiMedicalRecordsGet({
          query: { limit: 100 }, // And potentially patient_id if we had it
        })
      );
      if (records && visitData) {
        const record = records.find(r => r.visit_id === visitId);
        if (record) {
          setMedicalRecord(record);
          setAnamnesis(record.anamnesis || "");
          setDiagnosis(record.diagnosis || "");
          setPhysicalExam(record.physical_exam || "");
          setPlan(record.treatment_plan || "");
        }
      }

      // 3. Fetch Lab Tests
      const tests = await safeApiCall(listLabTestsApiLabTestsGet());
      if (tests) setLabTests(tests);

      // 4. Fetch Lab Orders
      const orders = await safeApiCall(listLabOrdersApiLabOrdersGet());
      // Filter provided client side for now as SDK query param support for visit_id might be missing
      if (orders && visitData) {
        setLabOrders(orders.filter(o => o.visit_id === visitId));
      }

      // 5. Fetch Prescriptions
      const prescs = await safeApiCall(listPrescriptionsApiPrescriptionsGet());
      if (prescs && visitData) {
        setPrescriptions(prescs.filter(p => p.visit_id === visitId));
      }

      setIsLoading(false);
    };

    fetchAllData();
  }, [visitId]);

  const handleSaveRecord = async () => {
    if (!visit) return;
    setIsSaving(true);

    try {
      if (medicalRecord) {
        // Update
        await safeApiCall(
          updateMedicalRecordApiMedicalRecordsRecordIdPut({
            path: { record_id: medicalRecord.id },
            body: {
              anamnesis,
              diagnosis,
              physical_exam: physicalExam,
              treatment_plan: plan,
              // outcome: medicalRecord.outcome // Keep existing or update
            },
          }),
          { successMessage: "Medical record updated" }
        );
      } else {
        // Create
        const newRecord = await safeApiCall(
          createMedicalRecordApiMedicalRecordsPost({
            body: {
              visit_id: visit.id,
              anamnesis,
              diagnosis,
              physical_exam: physicalExam,
              treatment_plan: plan,
            },
          }),
          { successMessage: "Medical record created" }
        );

        if (newRecord) setMedicalRecord(newRecord);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleFinishConsultation = async () => {
    if (!visit) return;
    if (confirm("Are you sure you want to finish this consultation?")) {
      await safeApiCall(
        updateVisitApiVisitsVisitIdPut({
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
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle className="text-primary text-lg">
                Clinical Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label htmlFor="complaint">Anamnesis / Chief Complaint</Label>
                <Textarea
                  id="complaint"
                  placeholder="Patient's chief complaint..."
                  className="min-h-[80px]"
                  value={anamnesis}
                  onChange={e => setAnamnesis(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Input
                    id="diagnosis"
                    placeholder="ICD-10 or description"
                    value={diagnosis}
                    onChange={e => setDiagnosis(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vitals (Physical Exam)</Label>
                  <Textarea
                    placeholder="BP, HR, Temp, Weight, etc."
                    value={physicalExam}
                    onChange={e => setPhysicalExam(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">Treatment Plan</Label>
                <Textarea
                  id="plan"
                  placeholder="Action plan, medication strategy..."
                  value={plan}
                  onChange={e => setPlan(e.target.value)}
                />
              </div>
              <Button onClick={handleSaveRecord} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Record
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescription">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/20 flex flex-row items-center justify-between border-b">
              <CardTitle className="text-primary text-lg">
                e-Prescription
              </CardTitle>
              <Button size="sm" variant="secondary" disabled>
                Add Medicine (Coming Soon)
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {prescriptions.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No prescriptions found.
                </p>
              ) : (
                <ul className="list-disc pl-5">
                  {prescriptions.map(p => (
                    <li key={p.id}>
                      Prescription ID: {p.id} - Status: {p.prescription_status}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/20 border-b">
              <CardTitle className="text-primary text-lg">Lab Orders</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-4">
                <H2 className="text-base font-semibold">Existing Orders</H2>
                {labOrders.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No lab orders found.
                  </p>
                ) : (
                  <ul className="list-disc pl-5">
                    {labOrders.map(o => (
                      <li key={o.id}>
                        Test:{" "}
                        {labTests.find(t => t.id === o.lab_test_id)
                          ?.test_name || o.lab_test_id}{" "}
                        - Status: {o.order_status}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-8">
                <H2 className="mb-2 text-base font-semibold">
                  Available Tests
                </H2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {labTests.map(test => (
                    <div
                      key={test.id}
                      className="hover:bg-muted/50 flex cursor-pointer items-center space-x-2 rounded-md border p-3"
                    >
                      <Input
                        type="checkbox"
                        id={test.id}
                        className="h-4 w-4"
                        disabled
                      />
                      <Label
                        htmlFor={test.id}
                        className="flex-1 cursor-pointer"
                      >
                        {test.test_name} ({test.category})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wearables">
          <div className="grid gap-6 md:grid-cols-2">
            <WearableChart
              title="Heart Rate (24h)"
              data={heartRateData}
              dataKey="value"
              color="#ef4444"
              unit=" bpm"
            />
            <WearableChart
              title="SpO2 (24h)"
              data={spo2Data}
              dataKey="value"
              color="#3b82f6"
              unit="%"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
