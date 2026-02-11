import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "./components/Layout";
import { AdminLayout } from "./components/AdminLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Roadmaps from "./pages/Roadmaps";
import RoadmapDetail from "./pages/RoadmapDetail";
import Notes from "./pages/Notes";
import Projects from "./pages/Projects";
import Resume from "./pages/Resume";
import Placements from "./pages/Placements";
import Learning from "./pages/Learning";
import Interview from "./pages/Interview";
import Uploads from "./pages/Uploads";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminApprovals from "./pages/admin/AdminApprovals";
import AdminNotes from "./pages/admin/AdminNotes";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminRoadmapManager from "./pages/admin/AdminRoadmapManager";
import AdminLearning from "./pages/admin/AdminLearning";
import AdminProjectManager from "./pages/admin/AdminProjectManager";
import AdminResumeManager from "./pages/admin/AdminResumeManager";
import AdminNotifications from "./pages/admin/AdminNotifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const UserRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const AdminRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute requireAdmin>
    <AdminLayout>{children}</AdminLayout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Auth */}
            <Route path="/auth" element={<Auth />} />

            {/* Admin */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/approvals" element={<AdminRoute><AdminApprovals /></AdminRoute>} />
            <Route path="/admin/notes" element={<AdminRoute><AdminNotes /></AdminRoute>} />
            <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
            <Route path="/admin/roadmaps" element={<AdminRoute><AdminRoadmapManager /></AdminRoute>} />
            <Route path="/admin/learning" element={<AdminRoute><AdminLearning /></AdminRoute>} />
            <Route path="/admin/projects" element={<AdminRoute><AdminProjectManager /></AdminRoute>} />
            <Route path="/admin/resume" element={<AdminRoute><AdminResumeManager /></AdminRoute>} />
            <Route path="/admin/notifications" element={<AdminRoute><AdminNotifications /></AdminRoute>} />

            {/* User panels */}
            <Route path="/" element={<UserRoute><Index /></UserRoute>} />
            <Route path="/roadmaps" element={<UserRoute><Roadmaps /></UserRoute>} />
            <Route path="/roadmaps/:id" element={<UserRoute><RoadmapDetail /></UserRoute>} />
            <Route path="/learning" element={<UserRoute><Learning /></UserRoute>} />
            <Route path="/notes" element={<UserRoute><Notes /></UserRoute>} />
            <Route path="/projects" element={<UserRoute><Projects /></UserRoute>} />
            <Route path="/resume" element={<UserRoute><Resume /></UserRoute>} />
            <Route path="/interview" element={<UserRoute><Interview /></UserRoute>} />
            <Route path="/placements" element={<UserRoute><Placements /></UserRoute>} />
            <Route path="/uploads" element={<UserRoute><Uploads /></UserRoute>} />
            <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />
            <Route path="/notifications" element={<UserRoute><Notifications /></UserRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
