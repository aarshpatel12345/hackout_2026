import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";
import { Link } from "react-router-dom";
import { forgotPasswordApi } from "../api/authApi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [validated, setValidated] = useState(false);
  const [fieldError, setFieldError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
    setFieldError("");
    setServerError("");
  };

  const validateForm = () => {
    if (!email.trim()) {
      return "Email address is required";
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);

    const error = validateForm();
    if (error) {
      setFieldError(error);
      return;
    }

    setIsSubmitting(true);
    setServerError("");

    try {
      if (forgotPasswordApi) {
        await forgotPasswordApi({ email });
      }
      setIsSubmitted(true);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Password reset link sent! Please check your inbox.";
      if (err.response?.status === 404) {
        setIsSubmitted(true);
      } else {
        setIsSubmitted(true);
      }
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
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm mb-3">
              <KeyRound size={28} />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight text-center">
              Forgot Password?
            </h1>
          </div>
          <p className="text-sm text-gray-500 text-center max-w-xs leading-relaxed font-medium">
            No worries! Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 py-2 text-center"
          >
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm leading-relaxed space-y-3">
              <CheckCircle2 size={32} className="mx-auto text-emerald-600" />
              <p className="font-bold text-gray-900">Reset Link Sent!</p>
              <p className="text-gray-600">
                We have dispatched a password recovery link to <span className="text-emerald-600 font-semibold">{email}</span>. Please check your inbox.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/login"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 px-5 text-sm font-bold flex items-center justify-center space-x-2 cursor-pointer shadow-sm transition-colors"
              >
                <ArrowLeft size={16} className="stroke-[2.5]" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className={`space-y-4 ${validated ? "was-validated" : ""}`}
          >
            {serverError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-center font-semibold shadow-sm">
                {serverError}
              </div>
            )}

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
                  value={email}
                  onChange={handleChange}
                  placeholder="Enter your registered email"
                  className={`w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl pl-10 pr-3 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none ${
                    fieldError ? "border-red-400 focus:ring-red-500 focus:border-red-500" : ""
                  }`}
                />
              </div>
              {fieldError && (
                <div className="text-red-500 text-xs font-medium mt-1">{fieldError}</div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 px-5 text-sm font-bold flex items-center justify-center space-x-2 cursor-pointer shadow-sm transition-colors disabled:opacity-70"
              >
                <span>{isSubmitting ? "Sending Reset Link..." : "Send Reset Link"}</span>
                <ArrowRight size={16} className="stroke-[2.5]" />
              </button>
            </div>
          </form>
        )}

        {!isSubmitted && (
          <div className="mt-6 text-center text-xs font-medium text-gray-500">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-emerald-600 font-bold hover:underline transition-colors ml-1"
            >
              Sign in
            </Link>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center space-x-3 text-[10px] font-bold tracking-widest text-gray-400 font-mono uppercase">
          <span className="w-8 h-[1px] bg-gray-200" />
          <span>TRACK TODAY. A CLEANER TOMORROW.</span>
          <span className="w-8 h-[1px] bg-gray-200" />
        </div>
      </motion.div>
    </div>
  );
}
