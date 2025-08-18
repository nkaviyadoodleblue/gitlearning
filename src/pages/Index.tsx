import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { Dashboard } from "@/components/Dashboard";
import { PatientList } from "@/components/PatientList";
import { PatientDetailedInfo } from "@/components/PatientDetailedInfo";
import { BalanceReductionManagement } from "@/components/BalanceReductionManagement";
import { Reports } from "@/components/Reports";
import { CSVUpload } from "@/components/CSVUpload";
import { useAppSelector } from "@/hooks/use-selector";

const Index = () => {
  const user = useAppSelector(state => state?.auth?.user);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>("");

  const handleNavigate = (page: string, id?: string) => {
    setCurrentPage(page);
    if (page === "patient-details" && id) {
      setSelectedPatientId(id);
    } else if (page === "balance-reduction" && id) {
      setSelectedAppointmentId(id);
    }
  };

  if (!user) {
    return <LoginForm />;
  }

  // Main application routing
  switch (currentPage) {
    case "patients":
      return <PatientList />;
    case "patient-details":
      return <PatientDetailedInfo />;
    case "balance-reduction":
      return <BalanceReductionManagement onNavigate={handleNavigate} appointmentId={selectedAppointmentId} />;
    case "import":
      return <CSVUpload onNavigate={handleNavigate} />;
    case "reports":
      return <Reports onNavigate={handleNavigate} />;
    default:
      return <Dashboard />;
  }
};

export default Index;
