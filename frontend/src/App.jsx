import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CategoriesProvider } from './context/CategoriesContext';
import PrivateRoute from './components/common/PrivateRoute';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import TicketListPage from './pages/TicketListPage';
import TicketDetailPage from './pages/TicketDetailPage';
import AssignedTasksPage from './pages/AssignedTasksPage';
import AgentPerformancePage from './pages/AgentPerformancePage';
import AgentDetailPage from './pages/AgentDetailPage';
import CategoryManagementPage from './pages/CategoryManagementPage';
import CannedResponsesPage from './pages/CannedResponsesPage';
import ContactsPage from './pages/ContactsPage';
import ContactDetailPage from './pages/ContactDetailPage';
import SlaSettingsPage from './pages/SlaSettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <CategoriesProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/tickets" element={<TicketListPage />} />
              <Route path="/tickets/:id" element={<TicketDetailPage />} />
              <Route path="/assigned" element={<AssignedTasksPage />} />
              <Route path="/agents" element={<AgentPerformancePage />} />
              <Route path="/agents/:agentId" element={<AgentDetailPage />} />
              <Route path="/categories" element={<CategoryManagementPage />} />
              <Route path="/canned-responses" element={<CannedResponsesPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/contacts/:contactId" element={<ContactDetailPage />} />
              <Route path="/sla-settings" element={<SlaSettingsPage />} />
            </Route>
          </Route>
        </Routes>
      </CategoriesProvider>
    </AuthProvider>
  );
}
