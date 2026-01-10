import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { initGA, logPageView } from './utils/analytics';

// Existing Pages
import Home from './pages/Home';
import ManagerLogin from './pages/ManagerLogin';
import ManagerDashboard from './pages/ManagerDashboard';
import StandardPage from './pages/StandardPage';
import WeeklyPage from './pages/WeeklyPage';
import WinterSchoolPage from './pages/WinterSchoolPage';
import EducationColumn from './pages/EducationColumn';
import ColumnDetail from './pages/ColumnDetail';
import BranchPromotion from './pages/BranchPromotion';
import Locations from './pages/Locations';
import StoryPage from './pages/StoryPage';
import DiagnosisPage from './pages/DiagnosisPage';
import FranchiseInquiry from './pages/FranchiseInquiry';
import OperationManual from './pages/OperationManual';
import CompanyAbout from './pages/CompanyAbout';
import Features from './pages/Features';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Payment Pages
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailPage from './pages/PaymentFailPage';
import ErrorBoundary from './components/ErrorBoundary';

// Router wrapper for page tracking
function RouterTracker() {
  const location = useLocation();

  useEffect(() => {
    logPageView(location.pathname + location.search);
  }, [location]);

  return null;
}

function App() {
  useEffect(() => {
    // Initialize Google Analytics on app load
    initGA();
  }, []);

  return (
    <>
      <ErrorBoundary>
        <BrowserRouter>
          <RouterTracker />
          <Routes>
            {/* Homepage */}
            <Route path="/" element={<Home />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

            {/* Existing Routes */}
            <Route path="/story" element={<StoryPage />} />
            <Route path="/diagnosis" element={<DiagnosisPage />} />
            <Route path="/manager" element={<ManagerLogin />} />
            <Route path="/manager/dashboard" element={<ManagerDashboard />} />
            <Route path="/programs/standard" element={<StandardPage />} />
            <Route path="/programs/weekly" element={<WeeklyPage />} />
            <Route path="/programs/winter-school" element={<WinterSchoolPage />} />

            {/* Blog Pages (Existing - with 30-year expert tone) */}
            <Route path="/columns" element={<EducationColumn />} />
            <Route path="/column/:slug" element={<ColumnDetail />} />

            {/* Other Pages */}
            <Route path="/franchise" element={<FranchiseInquiry />} />
            <Route path="/branches" element={<BranchPromotion />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/manual" element={<OperationManual />} />

            {/* Footer Pages */}
            <Route path="/about" element={<CompanyAbout />} />
            <Route path="/features" element={<Features />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />

            {/* Payment Pages */}
            <Route path="/pay/:token" element={<PaymentPage />} />
            <Route path="/pay/:token/success" element={<PaymentSuccessPage />} />
            <Route path="/pay/:token/fail" element={<PaymentFailPage />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
      <Analytics />
    </>
  );
}

export default App;
