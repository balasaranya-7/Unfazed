import React, { useState } from 'react';
import {
  useNavigate,
  Link,
  useSearchParams,
} from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Mail,
  Lock,
  Award,
  ArrowRight,
  Sparkles,
  HeartHandshake,
  User,
  Users,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { register } = useAuth();
  const { showToast, updateTherapist } = useData();

  const selectedRole =
    searchParams.get('role') === 'client'
      ? 'client'
      : 'therapist';

  const isClient = selectedRole === 'client';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    qualification: '',
    password: '',
    confirmPassword: '',
    therapistSlug: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (formData.password.length < 6) {
      showToast(
        'Password must be at least 6 characters',
        'error'
      );
      return;
    }

    setLoading(true);

    try {
      if (isClient) {
        const response = await fetch(
          'https://unfazed-3b31.onrender.com/api/auth/register-client',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formData.name.trim(),
              email: formData.email.trim(),
              password: formData.password,
              therapistSlug:
                formData.therapistSlug.trim(),
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              'Unable to create client account.'
          );
        }

        showToast(
          `${data?.client?.name || formData.name}'s client account created successfully!`
        );

        navigate('/login?role=client');

        return;
      }

      const data = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        qualification:
          formData.qualification.trim(),
      });

      if (data?.therapist) {
        updateTherapist(data.therapist);
      }

      showToast(
        `${data?.therapist?.name || formData.name}'s practice account created successfully!`
      );

      navigate('/therapist/dashboard');
    } catch (error) {
      showToast(
        error?.response?.data?.message ||
          error?.message ||
          'Unable to create account.',
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
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-rosewood/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blush/10 blur-3xl" />

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
              {isClient
                ? 'Client Wellness Portal'
                : 'Therapist Practice Hub'}
            </p>
          </div>
        </div>

        {/* Main */}
        <div className="relative z-10 max-w-xl">

          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-blush text-[11px] font-bold mb-7">
            <Sparkles size={13} />

            {isClient
              ? 'Your private wellness space.'
              : 'Build your practice with clarity.'}
          </div>

          <h2 className="font-display text-5xl xl:text-6xl font-black leading-[1.05] tracking-tight">
            {isClient ? (
              <>
                Your wellness,
                <br />
                <span className="text-blush">
                  your space.
                </span>
              </>
            ) : (
              <>
                Start your
                <br />
                <span className="text-blush">
                  Unfazed
                </span>{' '}
                practice.
              </>
            )}
          </h2>

          <p className="mt-6 text-sm leading-7 text-misty max-w-md">
            {isClient
              ? 'Create your private client space and keep your sessions, bookings and conversations connected.'
              : 'Create your professional workspace and bring clients, scheduling, notes and billing together.'}
          </p>

          {/* Feature cards */}
          <div className="mt-9 grid gap-3 max-w-md">

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-rosewood/30 flex items-center justify-center">
                {isClient ? (
                  <Users
                    size={18}
                    className="text-blush"
                  />
                ) : (
                  <HeartHandshake
                    size={18}
                    className="text-blush"
                  />
                )}
              </div>

              <div>
                <p className="text-xs font-bold">
                  {isClient
                    ? 'Personal wellness portal'
                    : 'Client-first management'}
                </p>

                <p className="text-[10px] text-misty mt-1">
                  {isClient
                    ? 'Your own connected client space.'
                    : 'Keep your practice organised.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-rosewood/30 flex items-center justify-center">
                <Award
                  size={18}
                  className="text-blush"
                />
              </div>

              <div>
                <p className="text-xs font-bold">
                  {isClient
                    ? 'Sessions & shared reflections'
                    : 'Professional profile'}
                </p>

                <p className="text-[10px] text-misty mt-1">
                  {isClient
                    ? 'Stay connected with your therapist.'
                    : 'Build your branded practice identity.'}
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
                <p className="text-xs font-bold">
                  {isClient
                    ? 'Booking & communication'
                    : 'Scheduling & documentation'}
                </p>

                <p className="text-[10px] text-misty mt-1">
                  One connected experience.
                </p>
              </div>
            </div>

          </div>
        </div>

        <p className="relative z-10 text-[11px] text-misty">
          {isClient
            ? 'A calmer space for your wellness journey.'
            : 'A calmer operating system for modern therapy practices.'}
        </p>
      </motion.section>

      {/* ================= RIGHT FORM ================= */}
      <section className="flex-1 min-h-screen flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[500px]"
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
                {isClient
                  ? 'Client Wellness Portal'
                  : 'Therapist Practice Hub'}
              </p>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-[2rem] p-7 sm:p-9 border border-misty/30 shadow-[0_20px_70px_rgba(47,68,84,0.12)]">

            {/* Header */}
            <div className="mb-7">
              <div className="w-11 h-11 rounded-2xl bg-rosewood/10 flex items-center justify-center mb-5">
                {isClient ? (
                  <User
                    size={19}
                    className="text-rosewood"
                  />
                ) : (
                  <Stethoscope
                    size={19}
                    className="text-rosewood"
                  />
                )}
              </div>

              <p className="text-[11px] uppercase tracking-[0.18em] font-extrabold text-rosewood">
                {isClient
                  ? 'New client'
                  : 'New practice'}
              </p>

              <h2 className="font-display text-3xl sm:text-4xl font-black tracking-tight mt-1">
                {isClient
                  ? 'Create your account'
                  : 'Create your practice'}
              </h2>

              <p className="text-xs text-midnight-muted mt-2">
                {isClient
                  ? 'Set up your private client space.'
                  : 'Set up your professional Unfazed workspace.'}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* Name */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wide mb-2 text-midnight-muted">
                  Full name
                </label>

                <div className="relative group">
                  <User
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-muted group-focus-within:text-rosewood transition-colors"
                  />

                  <input
                    type="text"
                    required
                    placeholder={
                      isClient
                        ? 'Your full name'
                        : 'Dr. / Ms. / Mr.'
                    }
                    value={formData.name}
                    onChange={(e) =>
                      handleChange(
                        'name',
                        e.target.value
                      )
                    }
                    className="w-full h-12 pl-11 pr-4 rounded-2xl border border-misty/40 bg-white text-sm outline-none transition-all focus:border-rosewood focus:ring-4 focus:ring-rosewood/10 placeholder:text-midnight-muted/50"
                  />
                </div>
              </div>

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
                      handleChange(
                        'email',
                        e.target.value
                      )
                    }
                    className="w-full h-12 pl-11 pr-4 rounded-2xl border border-misty/40 bg-white text-sm outline-none transition-all focus:border-rosewood focus:ring-4 focus:ring-rosewood/10 placeholder:text-midnight-muted/50"
                  />
                </div>
              </div>

              {/* Qualification */}
              {!isClient && (
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wide mb-2 text-midnight-muted">
                    Qualification
                  </label>

                  <div className="relative group">
                    <Award
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-muted group-focus-within:text-rosewood transition-colors"
                    />

                    <input
                      type="text"
                      placeholder="e.g. M.Phil Clinical Psychology"
                      value={formData.qualification}
                      onChange={(e) =>
                        handleChange(
                          'qualification',
                          e.target.value
                        )
                      }
                      className="w-full h-12 pl-11 pr-4 rounded-2xl border border-misty/40 bg-white text-sm outline-none transition-all focus:border-rosewood focus:ring-4 focus:ring-rosewood/10 placeholder:text-midnight-muted/50"
                    />
                  </div>
                </div>
              )}

              {/* Therapist branded link */}
              {isClient && (
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wide mb-2 text-midnight-muted">
                    Therapist branded link
                  </label>

                  <div className="relative group">
                    <Stethoscope
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-muted group-focus-within:text-rosewood transition-colors"
                    />

                    <input
                      type="text"
                      required
                      placeholder="e.g. dr-aditi-sharma"
                      value={formData.therapistSlug}
                      onChange={(e) =>
                        handleChange(
                          'therapistSlug',
                          e.target.value
                        )
                      }
                      className="w-full h-12 pl-11 pr-4 rounded-2xl border border-misty/40 bg-white text-sm outline-none transition-all focus:border-rosewood focus:ring-4 focus:ring-rosewood/10 placeholder:text-midnight-muted/50"
                    />
                  </div>

                  <p className="text-[10px] text-midnight-muted mt-1.5">
                    Enter the branded link shared by your therapist.
                  </p>
                </div>
              )}

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
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    required
                    minLength={6}
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={(e) =>
                      handleChange(
                        'password',
                        e.target.value
                      )
                    }
                    className="w-full h-12 pl-11 pr-12 rounded-2xl border border-misty/40 bg-white text-sm outline-none transition-all focus:border-rosewood focus:ring-4 focus:ring-rosewood/10 placeholder:text-midnight-muted/50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-midnight-muted hover:text-rosewood transition"
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wide mb-2 text-midnight-muted">
                  Confirm password
                </label>

                <div className="relative group">
                  <Lock
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-muted group-focus-within:text-rosewood transition-colors"
                  />

                  <input
                    type={
                      showConfirmPassword
                        ? 'text'
                        : 'password'
                    }
                    required
                    minLength={6}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleChange(
                        'confirmPassword',
                        e.target.value
                      )
                    }
                    className="w-full h-12 pl-11 pr-12 rounded-2xl border border-misty/40 bg-white text-sm outline-none transition-all focus:border-rosewood focus:ring-4 focus:ring-rosewood/10 placeholder:text-midnight-muted/50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-midnight-muted hover:text-rosewood transition"
                  >
                    {showConfirmPassword ? (
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
                    ? 'Creating account...'
                    : isClient
                      ? 'Create Client Account'
                      : 'Create Practice Account'}
                </span>

                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

            </form>

            {/* Security */}
            <div className="flex items-center justify-center gap-2 mt-5 text-[10px] text-midnight-muted">
              <CheckCircle2
                size={13}
                className="text-rosewood"
              />
              Your account details are securely handled.
            </div>

            {/* Login */}
            <div className="pt-6 mt-6 border-t border-misty/20 text-center text-xs text-midnight-muted">
              Already have an account?{' '}

              <Link
                to={`/login?role=${selectedRole}`}
                className="font-extrabold text-rosewood hover:underline"
              >
                Sign in
              </Link>
            </div>

          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Register;