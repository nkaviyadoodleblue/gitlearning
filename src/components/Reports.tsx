import { useState, useEffect } from "react";
import { Layout } from "./Layout";
import { fetchPatients } from "@/store/patientSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowLeft, Users,Download, BarChart3} from "lucide-react";
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppDispatch } from "@/hooks/use-dispatch";
import { useSelector } from "react-redux";
import { downloadPatientReport, fetchPatientReport } from "@/store/reportSlice";
import { useAppSelector } from "@/hooks/use-selector";
import { Progress } from "@radix-ui/react-progress";

interface ReportsProps {
  onNavigate: (page: string) => void;
}

const groupAppointmentsByProvider = (appointments: any[]) => {
  const grouped: { [key: string]: any[] } = {};
  appointments.forEach((appointment) => {
    if (!grouped[appointment.serviceProvider]) {
      grouped[appointment.serviceProvider] = [];
    }
    grouped[appointment.serviceProvider].push(appointment);
  });
  return grouped;
};

export const Reports = ({ onNavigate }: ReportsProps) => {
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [isDownloading, setIsDownloading] = useState(false);
  const dispatch = useAppDispatch();

  const reportData = useAppSelector((state: any) => state.report?.reportData || null);
  const isLoading = useSelector((state: any) => state.report?.isLoading || false);
  const patientList = useAppSelector((state: any) => state.patient.patientList.list);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  const handleGenerateReport = async () => {
    if (!selectedPatient) return;

    const patient = patientList.find((p: any) => p._id === selectedPatient);
    if (!patient) return;
    await dispatch(fetchPatientReport(patient._id));
  };
  const handleDownloadExcel = async () => {
    if (!selectedPatient) return;
    setIsDownloading(true);
    try {
      await dispatch(downloadPatientReport(selectedPatient));
    } finally {
      setIsDownloading(false);
    }
  };
  useEffect(() => {
  }, [patientList]);

  useEffect(() => {
  }, [reportData]);

  const getProgressPercentage = (steps: string[]) => {
  if (!Array.isArray(steps) || steps.length === 0) return 0;

  const completedSteps = steps.filter(step => step === "Completed").length;
  return Math.round((completedSteps / steps.length) * 100);
};



  return (
    <Layout title="Patient Reports" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Patient Reports</h1>
            <p className="text-sm text-muted-foreground">
              Generate comprehensive patient reports with all service details
            </p>
          </div>
        </div>

        {/* Report Generation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Generate Patient Report
            </CardTitle>
            <CardDescription>
              Select a patient to generate their complete report with all services and details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="patient-select">Patient Name</Label>
                <Select
                  value={selectedPatient}
                  onValueChange={setSelectedPatient}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patientList.map((patient: any) => (
                      <SelectItem key={patient._id} value={patient._id}>
                        {patient.name} (ID: {patient._id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleGenerateReport}
                disabled={!selectedPatient || isLoading}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                {isLoading ? "Generating..." : "Generate Report"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Report */}
        {reportData ? (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Patient Report: {reportData.patientName || reportData.patient}
                  </CardTitle>
                  <CardDescription>
                    Complete patient details and service history
                  </CardDescription>
                </div>
                  <Button
                onClick={handleDownloadExcel}
                disabled={!selectedPatient || isDownloading}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                {isDownloading ? "Downloading..." : "Download Excel"}
              </Button>
              </div>
            </CardHeader>
            <CardContent>
              {reportData.appointments?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left">Provider</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Treatment</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">Current Balance</th>
                        <th className="border border-gray-300 px-4 py-2 text-right">Final Balance</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Case Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.appointments.map((appointment: any, idx: number) => (
                        <tr
                          key={idx}
                          className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="border border-gray-300 px-4 py-2">{appointment.providerName}</td>
                          <td className="border border-gray-300 px-4 py-2">{appointment.treatmentDetails}</td>
                          <td className="border border-gray-300 px-4 py-2">{appointment.appointmentDate}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">${appointment.currentBalance}</td>
                          <td className="border border-gray-300 px-4 py-2 text-right">${appointment.finalBalance}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <Badge
                              variant={appointment.appointmentStatus === "Completed" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {appointment.appointmentStatus}
                            </Badge>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {Array.isArray(appointment.caseProgress) && appointment.caseProgress.length > 0 ? (
                              <>
                                <Progress value={getProgressPercentage(appointment.caseProgress)} className="h-2 mb-1" />
                                <div className="text-xs text-right">{getProgressPercentage(appointment.caseProgress)}%</div>
                              </>
                            ) : (
                              "N/A"
                            )}
                          </td>


                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground">No appointments found for this patient.</p>
              )}

            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Report Generated</h3>
              <p className="text-muted-foreground">
                Select a patient from the dropdown above and click "Generate Report" to view their complete details.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};
