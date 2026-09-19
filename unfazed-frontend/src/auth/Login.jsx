import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  UserRound,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useData();

  const [role, setRole] = useState('therapist');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      showToast(
        'Please enter your email and password.',
        'error'
      );
      return;
    }

    setLoading(true);

    try {
      const data = await login(
        formData.email.trim(),
        formData.password,
        role
      );

      if (!data?.success) {
        showToast(
          data?.message ||
            'Unable to sign in. Please check your email and password.',
          'error'
        );
        return;
      }

      if (data.role === 'client') {
        showToast('Welcome back!');
        navigate('/client-portal');
        return;
      }

      showToast('Welcome back to your practice!');
      navigate('/therapist/dashboard');
    } catch (error) {
      console.error('Login error:', error);

      showToast(
        error?.response?.data?.message ||
          error?.message ||
          'Unable to sign in. Please check your email and password.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-vanilla text-midnight font-sans lg:flex">

      {/* ================= LEFT BRAND PANEL ================= */}
      <motion.section
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65 }}
        className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-midnight text-vanilla px-12 xl:px-16 py-12 flex-col justify-between"
      >
        {/* Decorative shapes */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-rosewood/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blush/10 blur-3xl" />

        <div className="absolute top-1/2 right-0 w-32 h-32 rounded-full bg-blush/5 blur-2xl" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blush to-rosewood flex items-center justify-center shadow-xl">
            <span className="font-display font-black text-2xl text-midnight">
              U
            </span>
          </div>

          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight">
              Unfazed
            </h1>

            <p className="text-xs text-misty">
              Therapist Practice Hub
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-xl">

          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-blush text-[11px] font-bold mb-7">
            <Sparkles size={13} />
            A calmer way to work.
          </div>

          <h2 className="font-display text-5xl xl:text-6xl font-black leading-[1.05] tracking-tight">
            Your practice,
            <br />
            <span className="text-blush">unfazed.</span>
          </h2>

          <p className="mt-6 text-sm leading-7 text-misty max-w-md">
            One calm workspace for clients, appointments,
            clinical documentation, payments and communication.
          </p>

          {/* Feature cards */}
          <div className="mt-9 grid gap-3 max-w-md">

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-rosewood/30 flex items-center justify-center">
                <HeartHandshake
                  size={18}
                  className="text-blush"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-vanilla">
                  Client-first management
                </p>

                <p className="text-[10px] text-misty mt-1">
                  Keep your practice organised and connected.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-rosewood/30 flex items-center justify-center">
                <ShieldCheck
                  size={18}
                  className="text-blush"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-vanilla">
                  Private workspace
                </p>

                <p className="text-[10px] text-misty mt-1">
                  Designed around professional workflows.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-rosewood/30 flex items-center justify-center">
                <Stethoscope
                  size={18}
                  className="text-blush"
                />
              </div>

              <div>
                <p className="text-xs font-bold text-vanilla">
                  Everything in one place
                </p>

                <p className="text-[10px] text-misty mt-1">
                  Schedule, notes, billing and communication.
                </p>
              </div>
            </div>

          </div>
        </div>

        <p className="relative z-10 text-[11px] text-misty">
          A calmer operating system for modern therapy practices.
        </p>
      </motion.section>

      {/* ================= RIGHT SIDE ================= */}
      <section className="flex-1 min-h-screen flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[480px]"
        >

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-2xl bg-midnight flex items-center justify-center shadow-md">
              <span className="font-display font-black text-2xl text-blush">
                U
              </span>
            </div>

            <div>
              <h1 className="font-display text-xl font-extrabold">
                Unfazed
              </h1>

              <p className="text-[11px] text-midnight-muted">
                Therapist Practice Hub
              </p>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-[2rem] p-7 sm:p-9 border border-misty/30 shadow-[0_20px_70px_rgba(47,68,84,0.12)]">

            {/* Heading */}
            <div className="mb-8">
              <div className="w-11 h-11 rounded-2xl bg-rosewood/10 flex items-center justify-center mb-5">
                <Lock
                  size={19}
                  className="text-rosewood"
                />
              </div>

              <p className="text-[11px] uppercase tracking-[0.18em] font-extrabold text-rosewood">
                Welcome back
              </p>

              <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight mt-1">
                Sign in
              </h2>

              <p className="text-xs text-midnight-muted mt-2">
                Continue to your Unfazed workspace.
              </p>
            </div>

            {/* Role switch */}
            <div className="mb-7">
              <label className="block text-[11px] font-extrabold uppercase tracking-wide mb-2.5 text-midnight-muted">
                Account type
              </label>

              <div className="grid grid-cols-2 gap-2 p-1.5 bg-vanilla rounded-2xl border border-misty/30">

                <button
                  type="button"
                  onClick={() => setRole('therapist')}
                  className={`relative flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                    role === 'therapist'
                      ? 'bg-midnight text-white shadow-md'
                      : 'text-midnight-muted hover:text-midnight'
                  }`}
                >
                  <Stethoscope size={15} />
                  Therapist
                </button>

                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`relative flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                    role === 'client'
                      ? 'bg-midnight text-white shadow-md'
                      : 'text-midnight-muted hover:text-midnight'
                  }`}
                >
                  <UserRound size={15} />
                  Client
                </button>

              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wide mb-2 text-midnight-muted">
                  Email address
                </label>

                <div className="relative group">
                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-muted group-focus-within:text-rosewood transition-colors"
                  />

                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    className="w-full h-12 pl-11 pr-4 rounded-2xl border border-misty/40 bg-white text-sm outline-none transition-all focus:border-rosewood focus:ring-4 focus:ring-rosewood/10 placeholder:text-midnight-muted/50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wide mb-2 text-midnight-muted">
                  Password
                </label>

                <div className="relative group">
                  <Lock
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-muted group-focus-within:text-rosewood transition-colors"
                  />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    className="w-full h-12 pl-11 pr-12 rounded-2xl border border-misty/40 bg-white text-sm outline-none transition-all focus:border-rosewood focus:ring-4 focus:ring-rosewood/10 placeholder:text-midnight-muted/50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-midnight-muted hover:text-rosewood transition"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full h-13 rounded-2xl bg-rosewood hover:bg-rosewood-hover disabled:opacity-60 text-white font-extrabold text-xs transition-all shadow-lg shadow-rosewood/20 flex items-center justify-center gap-2 mt-2"
              >
                <span>
                  {loading
                    ? 'Signing in...'
                    : role === 'client'
                      ? 'Sign in as Client'
                      : 'Sign in as Therapist'}
                </span>

                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

            </form>

            {/* Trust line */}
            <div className="flex items-center justify-center gap-2 mt-6 text-[10px] text-midnight-muted">
              <CheckCircle2
                size={13}
                className="text-rosewood"
              />
              Secure account access
            </div>

            {/* Register */}
            <div className="pt-6 mt-6 border-t border-misty/20 text-center text-xs text-midnight-muted">
              Don't have an account?{' '}

              <Link
                to={`/register?role=${role}`}
                className="font-extrabold text-rosewood hover:underline"
              >
                {role === 'client'
                  ? 'Create client account'
                  : 'Create therapist account'}
              </Link>
            </div>

          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Login;