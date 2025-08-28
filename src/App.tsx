import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

import { store } from './store'
import { Provider } from 'react-redux'
import { LoginForm } from "./components/LoginForm";
import { PatientList } from "./components/PatientList";
import { PatientDetailedInfo } from "./components/PatientDetailedInfo";
import { BalanceReductionManagement } from "./components/BalanceReductionManagement";
import { Dashboard } from "./components/Dashboard";
import { Reports } from "./components/Reports";
import Protected from "./components/Protected";
import { useAppSelector } from "./hooks/use-selector";

const queryClient = new QueryClient();

const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>

        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginForm />} />
              <Route element={<Protected />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />


                <Route path="/patients" element={<PatientList />} />

                <Route path="/patients/:id" element={<PatientDetailedInfo />} />
                <Route path="/balance-reduction" element={<BalanceReductionManagement />} />
                <Route path="/import" element={<PatientDetailedInfo />} />

                <Route path="/reports" element={<Reports />} />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
