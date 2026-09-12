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
import OnboardingPage from "./pages/OnboardingPage";

function App() {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route path="/" element={<RegisterPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/signup" element={<RegisterPage />} />
					<Route path="/login" element={<AuthPage />} />
					<Route path="/forgot-password" element={<ForgotPasswordPage />} />
					<Route path="/onboarding" element={<OnboardingPage />} />
					<Route path="/dashboard" element={<Dashboard />} />
					<Route path="*" element={<Navigate to="/register" replace />} />
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;

