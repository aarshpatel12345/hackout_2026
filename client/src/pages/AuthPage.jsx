import { useState } from "react";
import {
	Eye,
	EyeOff,
	ChevronRight,
	Check,
	Leaf,
	Shield,
	Cpu,
	Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
	const [isLogin, setIsLogin] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [localError, setLocalError] = useState("");
	const navigate = useNavigate();
	const { login, register, loading, error: authError, clearError } = useAuth();

	// Form states
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		setLocalError("");
		clearError();
	};

	const validateForm = () => {
		if (!isLogin && !formData.name.trim()) return "Name is required";
		if (!formData.email.trim()) return "Email is required";
		if (!/\S+@\S+\.\S+/.test(formData.email))
			return "Please enter a valid email address";
		if (!formData.password) return "Password is required";
		if (!isLogin && formData.password.length < 6)
			return "Password must be at least 6 characters";
		if (!isLogin && formData.password !== formData.confirmPassword) {
			return "Passwords do not match";
		}
		return null;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const validationError = validateForm();
		if (validationError) {
			setLocalError(validationError);
			return;
		}

		try {
			if (isLogin) {
				await login({
					email: formData.email,
					password: formData.password,
				});
			} else {
				await register({
					name: formData.name,
					email: formData.email,
					password: formData.password,
				});
			}
			// Redirect to dashboard on success
			navigate("/dashboard");
		} catch (err) {
			// Error is caught and stored in AuthContext as well
		}
	};

	const toggleAuthMode = () => {
		setIsLogin(!isLogin);
		setLocalError("");
		clearError();
		setFormData({ name: "", email: "", password: "", confirmPassword: "" });
	};

	const displayError = localError || authError;

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#071312] p-4 sm:p-8 text-[#EAF7F2]">
			<div className="w-full max-w-6xl flex flex-col lg:flex-row bg-[#10231F] rounded-3xl overflow-hidden shadow-2xl border border-[#1D3932] min-h-[750px]">
				{/* LEFT SIDE - Auth Form Panel */}
				<div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col relative bg-[#10231F]">
					{/* Logo */}
					<div className="flex items-center space-x-2.5 mb-12">
						<div className="w-10 h-10 rounded-xl bg-[#20D68A]/10 border border-[#20D68A]/30 flex items-center justify-center text-[#20D68A]">
							<Leaf className="w-5 h-5" />
						</div>
						<span className="text-2xl font-bold tracking-tight text-[#EAF7F2]">
							Carbon
						</span>
						<span className="text-2xl font-bold tracking-tight text-[#20D68A]">
							Trace
						</span>
					</div>

					<div className="flex-grow flex flex-col justify-center max-w-sm mx-auto w-full">
						<div className="text-center mb-8">
							<h1 className="text-3xl font-semibold text-[#EAF7F2] mb-2">
								{isLogin ? "Welcome back" : "Create an account"}
							</h1>
							<p className="text-[#91AAA2] text-sm">
								{isLogin
									? "Sign in to access your Carbon Trace dashboard"
									: "Sign up to start tracking your carbon footprint"}
							</p>
						</div>

						{/* Form */}
						<form onSubmit={handleSubmit} className="space-y-4">
							{displayError && (
								<div className="p-3 bg-[#FF5C5C]/10 text-[#FF5C5C] text-sm rounded-lg border border-[#FF5C5C]/30 flex items-center space-x-2">
									<span>{displayError}</span>
								</div>
							)}

							{!isLogin && (
								<div className="space-y-1.5">
									<label className="text-sm font-medium text-[#EAF7F2]">
										Full Name
									</label>
									<input
										type="text"
										name="name"
										value={formData.name}
										onChange={handleChange}
										className="w-full px-4 py-2.5 rounded-lg bg-[#071312] border border-[#1D3932] text-[#EAF7F2] placeholder-[#91AAA2]/50 focus:ring-2 focus:ring-[#20D68A] focus:border-transparent outline-none transition-all text-sm"
										placeholder="Jane Doe"
									/>
								</div>
							)}

							<div className="space-y-1.5">
								<label className="text-sm font-medium text-[#EAF7F2]">
									Email Address
								</label>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									className="w-full px-4 py-2.5 rounded-lg bg-[#071312] border border-[#1D3932] text-[#EAF7F2] placeholder-[#91AAA2]/50 focus:ring-2 focus:ring-[#20D68A] focus:border-transparent outline-none transition-all text-sm"
									placeholder="name@example.com"
								/>
							</div>

							<div className="space-y-1.5">
								<label className="text-sm font-medium text-[#EAF7F2]">
									Password
								</label>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										name="password"
										value={formData.password}
										onChange={handleChange}
										className="w-full px-4 py-2.5 rounded-lg bg-[#071312] border border-[#1D3932] text-[#EAF7F2] placeholder-[#91AAA2]/50 focus:ring-2 focus:ring-[#20D68A] focus:border-transparent outline-none transition-all text-sm pr-10"
										placeholder="••••••••"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-[#91AAA2] hover:text-[#20D68A] transition-colors"
									>
										{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
							</div>

							{!isLogin && (
								<div className="space-y-1.5">
									<label className="text-sm font-medium text-[#EAF7F2]">
										Confirm Password
									</label>
									<div className="relative">
										<input
											type={showConfirmPassword ? "text" : "password"}
											name="confirmPassword"
											value={formData.confirmPassword}
											onChange={handleChange}
											className="w-full px-4 py-2.5 rounded-lg bg-[#071312] border border-[#1D3932] text-[#EAF7F2] placeholder-[#91AAA2]/50 focus:ring-2 focus:ring-[#20D68A] focus:border-transparent outline-none transition-all text-sm pr-10"
											placeholder="••••••••"
										/>
										<button
											type="button"
											onClick={() =>
												setShowConfirmPassword(!showConfirmPassword)
											}
											className="absolute right-3 top-1/2 -translate-y-1/2 text-[#91AAA2] hover:text-[#20D68A] transition-colors"
										>
											{showConfirmPassword ? (
												<EyeOff size={18} />
											) : (
												<Eye size={18} />
											)}
										</button>
									</div>
								</div>
							)}

							{isLogin && (
								<div className="flex items-center justify-between text-sm pt-1">
									<label className="flex items-center text-[#91AAA2] cursor-pointer hover:text-[#EAF7F2] transition-colors">
										<input
											type="checkbox"
											className="mr-2 rounded border-[#1D3932] bg-[#071312] text-[#20D68A] focus:ring-[#20D68A]"
										/>
										Remember me
									</label>
									<a
										href="#"
										className="font-medium text-[#20D68A] hover:underline"
									>
										Forgot Password?
									</a>
								</div>
							)}

							<button
								type="submit"
								disabled={loading}
								className="w-full py-3 bg-[#20D68A] text-[#071312] font-semibold rounded-lg hover:bg-[#0FAF70] transition-colors text-sm flex items-center justify-center disabled:opacity-70 mt-3 shadow-lg shadow-[#20D68A]/10"
							>
								{loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
								{!loading && (
									<ChevronRight size={16} className="ml-1 stroke-[3]" />
								)}
							</button>
						</form>

						<p className="text-center text-sm text-[#91AAA2] mt-8">
							{isLogin
								? "Don't have an account? "
								: "Already have an account? "}
							<button
								onClick={toggleAuthMode}
								className="font-medium text-[#20D68A] hover:underline"
							>
								{isLogin ? "Sign up" : "Sign in"}
							</button>
						</p>
					</div>

					<div className="mt-auto pt-12 flex justify-between items-center text-xs text-[#91AAA2]">
						<span>© 2026 Carbon Trace™</span>
						<div className="space-x-4">
							<a href="#" className="hover:text-[#EAF7F2] transition-colors">
								Terms of Service
							</a>
							<a href="#" className="hover:text-[#EAF7F2] transition-colors">
								Privacy
							</a>
						</div>
					</div>
				</div>

				{/* RIGHT SIDE - Branding & Info Section */}
				<div className="hidden lg:flex w-1/2 bg-[#0B211C] p-16 flex-col relative overflow-hidden border-l border-[#1D3932]">
					{/* Background decorative glowing circles */}
					<div className="absolute top-0 right-0 w-96 h-96 bg-[#38D9E8]/10 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
					<div className="absolute bottom-0 left-0 w-96 h-96 bg-[#A78BFA]/10 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>

					<div className="relative z-10 max-w-md mt-12">
						<div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#20D68A]/10 border border-[#20D68A]/30 text-[#20D68A] text-xs font-semibold uppercase tracking-wider mb-6">
							<Activity size={14} />
							<span>Next-Gen Sustainability</span>
						</div>

						<h2 className="text-[38px] leading-[1.18] font-bold text-[#EAF7F2] mb-6">
							Empowering Precision Carbon Tracking & Verification
						</h2>
						<p className="text-[#91AAA2] leading-relaxed mb-12 text-[15px]">
							Carbon Trace combines AI intelligence with immutable ledger
							verification to deliver automated carbon footprint monitoring for
							modern enterprises.
						</p>

						<div className="relative">
							{/* Testimonial border line */}
							<div className="absolute left-0 top-0 bottom-0 w-1 bg-[#20D68A] rounded-full"></div>
							<div className="pl-6 py-1">
								<p className="text-[14px] text-[#EAF7F2] leading-relaxed mb-6 italic">
									"Carbon Trace transformed how we measure and report our scope
									1-3 emissions. The automated verification saved hundreds of
									hours for our sustainability team."
								</p>
								<div className="flex items-center space-x-3">
									<div className="w-10 h-10 rounded-full overflow-hidden border border-[#20D68A]/40 bg-[#10231F]">
										<img
											src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
											alt="Elena Vance"
											className="w-full h-full object-cover"
										/>
									</div>
									<div>
										<h4 className="text-sm font-semibold text-[#EAF7F2]">
											Elena Vance
										</h4>
										<p className="text-xs text-[#91AAA2]">
											Head of ESG, BioGrid Global
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="mt-auto relative z-10 mb-6">
						<div className="flex items-center justify-center space-x-2 mb-6">
							<Check size={14} className="text-[#20D68A]" />
							<span className="text-xs font-semibold uppercase tracking-wider text-[#91AAA2]">
								Trusted by Enterprise Leaders & ESG Pioneers
							</span>
						</div>

						{/* Enterprise badge simulation */}
						<div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 text-[#91AAA2]/70 text-sm font-semibold">
							<div className="flex items-center hover:text-[#38D9E8] transition-colors">
								<Shield size={16} className="mr-1.5 text-[#38D9E8]" /> EcoCert
							</div>
							<div className="flex items-center hover:text-[#20D68A] transition-colors">
								<Leaf size={16} className="mr-1.5 text-[#20D68A]" /> BioGrid
							</div>
							<div className="flex items-center hover:text-[#A78BFA] transition-colors">
								<Cpu size={16} className="mr-1.5 text-[#A78BFA]" /> SynapseAI
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
