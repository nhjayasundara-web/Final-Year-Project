import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Learn from './pages/Learn';
import SelfExam from './pages/SelfExam';
import RiskAssessment from './pages/RiskAssessment';
import AiScreening from './pages/AiScreening';
import Medicines from './pages/Medicines';
import Providers from './pages/Providers';
import Community from './pages/Community';
import Support from './pages/Support';
import Dashboard from './pages/Dashboard';
import AuthPage from './pages/AuthPage';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="min-h-screen bg-hope-cream text-slate-900">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/self-exam" element={<SelfExam />} />
          <Route path="/risk" element={<RiskAssessment />} />
          <Route path="/ai-screening" element={<AiScreening />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/providers" element={<Providers />} />
          <Route path="/community" element={<Community />} />
          <Route path="/support" element={<Support />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
