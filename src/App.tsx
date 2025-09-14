import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Schemes from "./pages/Schemes";
import Users from "./pages/Users";
import Rules from "./pages/Rules";
import Rewards from "./pages/Rewards";
import Notifications from "./pages/Notifications";
import AnalyticsLanding from "./pages/analytics/AnalyticsLanding";
import SchemeReports from "./pages/analytics/SchemeReports";
import UserReports from "./pages/analytics/UserReports";
import AdvancedAnalytics from "./pages/analytics/AdvancedAnalytics";
import DataIngestion from "./pages/data/DataIngestion";
import MappingStudio from "./pages/data/MappingStudio";
import ValidationCenter from "./pages/data/ValidationCenter";
import MonitoringDashboard from "./pages/data/MonitoringDashboard";
import DataSettings from "./pages/data/DataSettings";
import DataIntegrations from "./pages/data/DataIntegrations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/users" element={<Users />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/analytics" element={<AnalyticsLanding />} />
          <Route path="/analytics/schemes" element={<SchemeReports />} />
          <Route path="/analytics/users" element={<UserReports />} />
          <Route path="/analytics/advanced" element={<AdvancedAnalytics />} />
          <Route path="/data/ingestion" element={<DataIngestion />} />
          <Route path="/data/mapping" element={<MappingStudio />} />
          <Route path="/data/validation" element={<ValidationCenter />} />
          <Route path="/data/monitoring" element={<MonitoringDashboard />} />
          <Route path="/data/settings" element={<DataSettings />} />
          <Route path="/data/integrations" element={<DataIntegrations />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
