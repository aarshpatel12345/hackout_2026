import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RegisterPage from "./pages/RegisterPage";
import AuthPage from "./pages/AuthPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import Dashboard from "./pages/Dashboard";
import EmissionLeakDetector from "./pages/EmissionLeakDetector";
import OnboardingPage from "./pages/OnboardingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import AiInsights from "./pages/AiInsights";
import RoiCalculator from "./pages/RoiCalculator";
import InterventionPlanner from "./pages/InterventionPlanner";
import WasteExchange from "./pages/WasteExchange";
import Reports from "./pages/Reports";
import DataManagement from "./pages/DataManagement";
import SettingsPage from "./pages/Settings";

function App() {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					{/* Public Routes - Only accessible when NOT logged in */}
					<Route element={<PublicRoute />}>
						<Route path="/" element={<Navigate to="/login" replace />} />
						<Route path="/register" element={<RegisterPage />} />
						<Route path="/signup" element={<RegisterPage />} />
						<Route path="/login" element={<AuthPage />} />
						<Route path="/forgot-password" element={<ForgotPasswordPage />} />
					</Route>

					{/* Protected Routes - Only accessible when logged in */}
					<Route element={<ProtectedRoute />}>
						<Route path="/onboarding" element={<OnboardingPage />} />
						<Route path="/dashboard" element={<Dashboard />} />
						<Route path="/leak-detector" element={<EmissionLeakDetector />} />
						<Route path="/ai-insights" element={<AiInsights />} />
						<Route path="/roi-calculator" element={<RoiCalculator />} />
						<Route path="/intervention-planner" element={<InterventionPlanner />} />
						<Route path="/waste-exchange" element={<WasteExchange />} />
						<Route path="/reports" element={<Reports />} />
						<Route path="/data-management" element={<DataManagement />} />
						<Route path="/settings" element={<SettingsPage />} />
					</Route>

					<Route path="*" element={<Navigate to="/login" replace />} />
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;

