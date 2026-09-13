import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [validated, setValidated] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const auth = useAuth();
  const login = auth?.login;
  const authError = auth?.error;
  const clearError = auth?.clearError;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    if (clearError) clearError();
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      errors.password = "Password is required";
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
      let res;
      if (login) {
        res = await login({
          email: formData.email,
          password: formData.password,
        });
      }
      if (res?.isOnboarded) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    } catch (err) {
      // Handled by auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-gray-50 text-gray-900 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-hidden font-sans select-none">
      
      <div className="hidden xl:flex flex-col justify-between absolute left-12 top-0 bottom-0 py-16 z-10 pointer-events-none text-gray-400 font-mono text-xs tracking-[0.35em] leading-relaxed">
        <div className="space-y-4">
          <p className="hover:text-emerald-500 transition-colors">MEASURE</p>
          <p className="hover:text-emerald-500 transition-colors">VERIFY</p>
          <p className="hover:text-emerald-500 transition-colors">TRACE</p>
          <p className="hover:text-emerald-500 transition-colors">SUSTAIN</p>
        </div>
        <div className="space-y-1">
          <p className="text-emerald-600 font-bold tracking-[0.25em]">CARBONTRACE</p>
          <p className="text-[10px] tracking-[0.2em] text-gray-400">
            FOR A SUSTAINABLE PLANET
          </p>
        </div>
      </div>

      <div className="hidden xl:flex flex-col justify-center absolute right-16 top-0 bottom-0 py-16 z-10 pointer-events-none text-right text-gray-400 font-mono text-xs tracking-[0.35em] leading-relaxed space-y-4">
        <p className="hover:text-emerald-500 transition-colors">REAL DATA</p>
        <p className="hover:text-emerald-500 transition-colors">REAL IMPACT</p>
        <p className="hover:text-emerald-500 transition-colors">A CLEANER</p>
        <p className="hover:text-emerald-500 transition-colors">TOMORROW</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[430px] rounded-3xl bg-white border border-gray-200 p-5 sm:p-7 shadow-xl"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-b-full pointer-events-none" />

        <div className="flex flex-col items-center mb-6">
          <div className="flex flex-col items-center justify-center mb-4">
            <img src="/logo.jpg" alt="CarbonTrace Logo" className="h-16 w-auto object-contain rounded-xl shadow-md border border-gray-800 mb-4" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight text-center">
              Welcome Back
            </h1>
          </div>
          <p className="text-sm text-gray-500 text-center max-w-xs leading-relaxed font-medium">
            Sign in to access your Carbon Trace dashboard.
          </p>
        </div>

        {authError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-center font-semibold shadow-sm"
          >
            {authError}
          </motion.div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className={`space-y-4 ${validated ? "was-validated" : ""}`}
        >
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Email Address
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-gray-400 pointer-events-none z-10">
                <Mail size={18} />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={`w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl pl-10 pr-3 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none ${
                  fieldErrors.email ? "border-red-400 focus:ring-red-500 focus:border-red-500" : ""
                }`}
              />
            </div>
            {fieldErrors.email && (
              <div className="text-red-500 text-xs font-medium mt-1">{fieldErrors.email}</div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">
              Password
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-gray-400 pointer-events-none z-10">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl pl-10 pr-10 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none ${
                  fieldErrors.password ? "border-red-400 focus:ring-red-500 focus:border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-gray-400 hover:text-emerald-600 transition-colors focus:outline-none z-10 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.password && (
              <div className="text-red-500 text-xs font-medium mt-1">{fieldErrors.password}</div>
            )}
          </div>

          <div className="flex items-center justify-between text-sm pt-1 select-none">
            <label className="flex items-center space-x-2 cursor-pointer text-gray-600 hover:text-gray-900 transition-colors group">
              <div className="relative flex items-center justify-center shrink-0 w-4 h-4">
                <input
                  type="checkbox"
                  id="rememberMeCheckbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded appearance-none cursor-pointer border border-gray-300 bg-white checked:bg-emerald-500 checked:border-emerald-500 transition-all outline-none"
                />
                {rememberMe && (
                  <Check
                    size={12}
                    className="absolute pointer-events-none text-white stroke-[3]"
                  />
                )}
              </div>
              <span className="text-xs font-semibold leading-none whitespace-nowrap">
                Remember Me
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-bold text-emerald-600 hover:underline hover:text-emerald-700 transition-colors whitespace-nowrap"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 px-5 text-sm font-bold flex items-center justify-center space-x-2 cursor-pointer shadow-sm transition-colors disabled:opacity-70"
            >
              <span>{isSubmitting ? "Signing In..." : "Sign In"}</span>
              <ArrowRight size={16} className="stroke-[2.5]" />
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs font-medium text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-emerald-600 font-bold hover:underline transition-colors ml-1"
          >
            Sign up
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center space-x-3 text-[10px] font-bold tracking-widest text-gray-400 font-mono uppercase">
          <span className="w-8 h-[1px] bg-gray-200" />
          <span>TRACK TODAY. A CLEANER TOMORROW.</span>
          <span className="w-8 h-[1px] bg-gray-200" />
        </div>
      </motion.div>
    </div>
  );
}
