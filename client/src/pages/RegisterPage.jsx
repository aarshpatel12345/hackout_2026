import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ParticleBackground from "../components/ParticleBackground";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [validated, setValidated] = useState(false);
	const [fieldErrors, setFieldErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const navigate = useNavigate();
	const auth = useAuth();
	const register = auth?.register;
	const authError = auth?.error;
	const clearError = auth?.clearError;

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		setFieldErrors((prev) => ({ ...prev, [name]: "" }));
		if (clearError) clearError();
	};

	const validateForm = () => {
		const errors = {};
		if (!formData.name.trim()) {
			errors.name = "Full name is required";
		}
		if (!formData.email.trim()) {
			errors.email = "Email address is required";
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			errors.email = "Please enter a valid email address";
		}
		if (!formData.password) {
			errors.password = "Password is required";
		} else if (formData.password.length < 6) {
			errors.password = "Password must be at least 6 characters";
		}
		if (!formData.confirmPassword) {
			errors.confirmPassword = "Confirm password is required";
		} else if (formData.password !== formData.confirmPassword) {
			errors.confirmPassword = "Passwords do not match";
		}
		return errors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setValidated(true);

		const errors = validateForm();
		if (Object.keys(errors).length > 0) {
			setFieldErrors(errors);
			return;
		}

		setIsSubmitting(true);
		try {
			if (register) {
				await register({
					name: formData.name,
					email: formData.email,
					password: formData.password,
				});
			}
			navigate("/onboarding");
		} catch (err) {
			// Handled by context
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="relative min-h-screen w-full bg-[#030908] text-[#EAF7F2] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-hidden font-sans select-none">
			{/* Animated Background Canvas */}
			<ParticleBackground />

			{/* Left Side Typography Overlays */}
			<div className="hidden xl:flex flex-col justify-between absolute left-12 top-0 bottom-0 py-16 z-10 pointer-events-none text-[#86A399]/75 font-mono text-xs tracking-[0.35em] leading-relaxed">
				<div className="space-y-4">
					<p className="hover:text-[#20D68A] transition-colors">MEASURE</p>
					<p className="hover:text-[#20D68A] transition-colors">VERIFY</p>
					<p className="hover:text-[#20D68A] transition-colors">TRACE</p>
					<p className="hover:text-[#20D68A] transition-colors">SUSTAIN</p>
				</div>
				<div className="space-y-1">
					<p className="text-[#20D68A] font-bold tracking-[0.25em]">CARBONTRACE</p>
					<p className="text-[10px] tracking-[0.2em] text-[#86A399]/50">
						FOR A SUSTAINABLE PLANET
					</p>
				</div>
			</div>

			{/* Right Side Typography Overlays */}
			<div className="hidden xl:flex flex-col justify-center absolute right-16 top-0 bottom-0 py-16 z-10 pointer-events-none text-right text-[#86A399]/75 font-mono text-xs tracking-[0.35em] leading-relaxed space-y-4">
				<p className="hover:text-[#20D68A] transition-colors">REAL DATA</p>
				<p className="hover:text-[#20D68A] transition-colors">REAL IMPACT</p>
				<p className="hover:text-[#20D68A] transition-colors">A CLEANER</p>
				<p className="hover:text-[#20D68A] transition-colors">TOMORROW</p>
			</div>

			{/* Central Glass Container with Border Glow Shadow */}
			<motion.div
				initial={{ opacity: 0, y: 25, scale: 0.96 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
				className="relative z-10 w-full max-w-[430px] rounded-3xl bg-[#071916]/80 backdrop-blur-2xl border-glow p-5 sm:p-7 shadow-[0_0_50px_rgba(32,214,138,0.2)]"
			>
				{/* Top Inner Subtle Glow Bar */}
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-0.5 bg-gradient-to-r from-transparent via-[#20D68A] to-transparent blur-sm rounded-full pointer-events-none" />

				{/* Logo Header with Compact Size */}
				<div className="flex flex-col items-center mb-4">
					<div className="flex flex-col items-center justify-center mb-2">
						<img
							src="/logo.png"
							alt="CarbonTrace Logo"
							className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_0_20px_rgba(32,214,138,0.5)] mb-1"
							onError={(e) => {
								e.currentTarget.style.display = 'none';
							}}
						/>
					</div>

					<h1 className="text-xl sm:text-2xl font-semibold text-[#EAF7F2] tracking-tight mb-1 text-center">
						Create Your Account
					</h1>
					<p className="text-xs text-[#86A399] text-center max-w-xs leading-normal">
						Join the movement for a more transparent and sustainable future.
					</p>
				</div>

				{/* Global Auth Error Alert */}
				{authError && (
					<motion.div
						initial={{ opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						className="mb-4 p-2.5 rounded-xl bg-[#FF5C5C]/10 border border-[#FF5C5C]/40 text-[#FF7575] text-xs text-center font-medium shadow-[0_0_15px_rgba(255,92,92,0.2)]"
					>
						{authError}
					</motion.div>
				)}

				{/* Registration Form with Bootstrap Validation */}
				<form
					onSubmit={handleSubmit}
					noValidate
					className={`space-y-3 ${validated ? "was-validated" : ""}`}
				>
					{/* FULL NAME */}
					<div className="space-y-1">
						<label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#86A399]">
							Full Name
						</label>
						<div className="relative flex items-center">
							<div className="absolute left-3.5 text-[#86A399] pointer-events-none z-10">
								<User size={16} />
							</div>
							<input
								type="text"
								name="name"
								required
								value={formData.name}
								onChange={handleChange}
								placeholder="Enter your full name"
								className={`w-full bg-[#04120E]/90 border border-[#16362E] text-[#EAF7F2] placeholder-[#86A399]/40 rounded-xl pl-9 pr-3 py-2 text-xs input-glow transition-all outline-none ${
									fieldErrors.name ? "is-invalid" : ""
								}`}
							/>
						</div>
						{fieldErrors.name && (
							<div className="invalid-feedback d-block">{fieldErrors.name}</div>
						)}
					</div>

					{/* EMAIL ADDRESS */}
					<div className="space-y-1">
						<label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#86A399]">
							Email Address
						</label>
						<div className="relative flex items-center">
							<div className="absolute left-3.5 text-[#86A399] pointer-events-none z-10">
								<Mail size={16} />
							</div>
							<input
								type="email"
								name="email"
								required
								value={formData.email}
								onChange={handleChange}
								placeholder="Enter your email address"
								className={`w-full bg-[#04120E]/90 border border-[#16362E] text-[#EAF7F2] placeholder-[#86A399]/40 rounded-xl pl-9 pr-3 py-2 text-xs input-glow transition-all outline-none ${
									fieldErrors.email ? "is-invalid" : ""
								}`}
							/>
						</div>
						{fieldErrors.email && (
							<div className="invalid-feedback d-block">{fieldErrors.email}</div>
						)}
					</div>

					{/* PASSWORD */}
					<div className="space-y-1">
						<label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#86A399]">
							Password
						</label>
						<div className="relative flex items-center">
							<div className="absolute left-3.5 text-[#86A399] pointer-events-none z-10">
								<Lock size={16} />
							</div>
							<input
								type={showPassword ? "text" : "password"}
								name="password"
								required
								minLength={6}
								value={formData.password}
								onChange={handleChange}
								placeholder="Create a password"
								className={`w-full bg-[#04120E]/90 border border-[#16362E] text-[#EAF7F2] placeholder-[#86A399]/40 rounded-xl pl-9 pr-9 py-2 text-xs input-glow transition-all outline-none ${
									fieldErrors.password ? "is-invalid" : ""
								}`}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3.5 text-[#86A399] hover:text-[#20D68A] transition-colors focus:outline-none z-10 cursor-pointer"
							>
								{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
							</button>
						</div>
						{fieldErrors.password && (
							<div className="invalid-feedback d-block">{fieldErrors.password}</div>
						)}
					</div>

					{/* CONFIRM PASSWORD */}
					<div className="space-y-1">
						<label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[#86A399]">
							Confirm Password
						</label>
						<div className="relative flex items-center">
							<div className="absolute left-3.5 text-[#86A399] pointer-events-none z-10">
								<Lock size={16} />
							</div>
							<input
								type={showConfirmPassword ? "text" : "password"}
								name="confirmPassword"
								required
								value={formData.confirmPassword}
								onChange={handleChange}
								placeholder="Confirm your password"
								className={`w-full bg-[#04120E]/90 border border-[#16362E] text-[#EAF7F2] placeholder-[#86A399]/40 rounded-xl pl-9 pr-9 py-2 text-xs input-glow transition-all outline-none ${
									fieldErrors.confirmPassword ? "is-invalid" : ""
								}`}
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="absolute right-3.5 text-[#86A399] hover:text-[#20D68A] transition-colors focus:outline-none z-10 cursor-pointer"
							>
								{showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
							</button>
						</div>
						{fieldErrors.confirmPassword && (
							<div className="invalid-feedback d-block">
								{fieldErrors.confirmPassword}
							</div>
						)}
					</div>

					{/* DIRECT OUTLINE TO SOLID FILL BUTTON (NO HOVER TRANSITION) */}
					<div className="pt-2">
						<button
							type="submit"
							disabled={isSubmitting}
							className="btn-direct-fill w-full rounded-xl py-2.5 px-5 text-xs font-semibold flex items-center justify-center space-x-2 cursor-pointer shadow-md"
						>
							<span>{isSubmitting ? "Creating Account..." : "Create Account"}</span>
							<ArrowRight size={15} className="stroke-[2.5]" />
						</button>
					</div>
				</form>

				{/* React Router Navigation to Sign In */}
				<div className="mt-4 text-center text-xs text-[#86A399]">
					Already have an account?{" "}
					<Link
						to="/login"
						className="text-[#20D68A] font-semibold hover:underline transition-colors ml-0.5"
					>
						Sign in
					</Link>
				</div>

				{/* Decorative Slogan Line */}
				<div className="mt-4 flex items-center justify-center space-x-3 text-[9px] tracking-[0.2em] text-[#86A399]/40 font-mono uppercase">
					<span className="w-8 h-[1px] bg-[#16362E]" />
					<span>TRACK TODAY. A CLEANER TOMORROW.</span>
					<span className="w-8 h-[1px] bg-[#16362E]" />
				</div>
			</motion.div>
		</div>
	);
}
