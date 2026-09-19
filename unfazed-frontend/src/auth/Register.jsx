import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
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
              therapistSlug: formData.therapistSlug.trim(),
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
        qualification: formData.qualification.trim(),
      });

      if (data?.therapist) {
        updateTherapist(data.therapist);
      }

      showToast(
        `${
          data?.therapist?.name || formData.name
        }'s practice account created successfully!`
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
    <div className="min-h-screen bg-vanilla text-midnight font-sans lg:grid lg:grid-cols-2">

      {/* =====================================================
          LEFT BRAND PANEL
      ===================================================== */}
      <motion.section
        initial={{ opacity: 0, x: -35 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65 }}
        className="hidden lg:flex relative overflow-hidden bg-midnight text-vanilla p-12 xl:p-16 flex-col justify-between"
      >
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-rosewood/20 blur-3xl" />

        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blush/10 blur-3xl" />

        <div className="absolute top-1/3 right-[-100px] w-72 h-72 rounded-full border border-blush/10" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blush to-rosewood flex items-center justify-center shadow-lg">
            <span className="font-display font-black text-2xl text-midnight">
              U
            </span>
          </div>

          <div>
            <h1 className="font-display text-2xl font-extrabold">
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

          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 text-blush text-xs font-bold mb-6">
            <Sparkles size={13} />

            {isClient
              ? 'Your private wellness space.'
              : 'Build your practice with clarity.'}
          </div>

          <h2 className="font-display text-5xl xl:text-6xl font-extrabold leading-[1.05] tracking-tight">

            {isClient ? (
              <>
                Create your
                <br />
                <span className="text-blush">
                  Unfazed
                </span>{' '}
                space.
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

          <p className="mt-6 text-sm leading-7 text-misty max-w-lg">
            {isClient
              ? 'Create your client account to access sessions, bookings, payments, shared notes and conversations in one private space.'
              : 'Create your therapist account and manage clients, schedules, notes, payments and your branded practice from one workspace.'}
          </p>

          {/* Feature list */}
          <div className="mt-9 space-y-3 max-w-md">

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-blush/10 flex items-center justify-center">
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
                    ? 'Personal client portal'
                    : 'Client-first management'}
                </p>

                <p className="text-[10px] text-misty mt-1">
                  {isClient
                    ? 'Everything you need in one place.'
                    : 'Keep your practice connected.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-blush/10 flex items-center justify-center">
                <Award
                  size={18}
                  className="text-blush"
                />
              </div>

              <div>
                <p className="text-xs font-bold">
                  {isClient
                    ? 'Sessions & shared reflections'
                    : 'Professional practice identity'}
                </p>

                <p className="text-[10px] text-misty mt-1">
                  {isClient
                    ? 'Stay connected with your therapist.'
                    : 'Build your branded therapist profile.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-xl bg-blush/10 flex items-center justify-center">
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
                  {isClient
                    ? 'Simple and connected.'
                    : 'Everything your practice needs.'}
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

      {/* =====================================================
          RIGHT REGISTER
      ===================================================== */}
      <section className="min-h-screen flex items-center justify-center p-5 sm:p-8 lg:p-12 bg-vanilla relative overflow-hidden">

        <div className="lg:hidden absolute -top-32 -right-32 w-80 h-80 rounded-full bg-blush/20 blur-3xl" />

        <div className="lg:hidden absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-sunwashed/30 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-md"
        >

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-2xl bg-midnight flex items-center justify-center shadow-lg">
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
          <div className="bg-white rounded-[2rem] p-6 sm:p-9 border border-misty/30 shadow-[0_25px_70px_rgba(47,68,84,0.12)]">

            {/* Icon */}
            <div className="w-12 h-12 rounded-2xl bg-rosewood/10 flex items-center justify-center mb-5">
              {isClient ? (
                <User
                  size={21}
                  className="text-rosewood"
                />
              ) : (
                <Stethoscope
                  size={21}
                  className="text-rosewood"
                />
              )}
            </div>

            {/* Header */}
            <div className="mb-7">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-rosewood">
                {isClient
                  ? 'New client'
                  : 'New practice'}
              </p>

              <h2 className="mt-2 text-3xl sm:text-4xl font-display font-extrabold tracking-tight">
                {isClient
                  ? 'Create account'
                  : 'Create your practice'}
              </h2>

              <p className="text-xs text-midnight-muted mt-2 leading-5">
                {isClient
                  ? 'Create your private client account to continue.'
                  : 'Set up your therapist workspace in a few simple steps.'}
              </p>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center gap-2 mb-7">

              <div className="h-1.5 flex-1 rounded-full bg-rosewood" />

              <div className="h-1.5 flex-1 rounded-full bg-rosewood/20" />

              <div className="h-1.5 flex-1 rounded-full bg-rosewood/20" />

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 text-xs"
            >

              {/* Name */}
              <div>
                <label className="block font-bold mb-2">
                  Full name
                </label>

                <div className="relative group">
                  <User
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-muted group-focus-within:text-rosewood transition"
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
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-misty/40 bg-vanilla/30 focus:outline-none focus:border-rosewood focus:ring-4 focus:ring-rosewood/10 transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-bold mb-2">
                  Email address
                </label>

                <div className="relative group">
                  <Mail
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-muted group-focus-within:text-rosewood transition"
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
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-misty/40 bg-vanilla/30 focus:outline-none focus:border-rosewood focus:ring-4 focus:ring-rosewood/10 transition"
                  />
                </div>
              </div>

              {/* Qualification */}
              {!isClient && (
                <div>
                  <label className="block font-bold mb-2">
                    Qualification
                  </label>

                  <div className="relative group">
                    <Award
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-muted group-focus-within:text-rosewood transition"
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
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-misty/40 bg-vanilla/30 focus:outline-none focus:border-rosewood focus:ring-4 focus:ring-rosewood/10 transition"
                    />
                  </div>
                </div>
              )}

              {/* Therapist slug */}
              {isClient && (
                <div>
                  <label className="block font-bold mb-2">
                    Therapist branded link
                  </label>

                  <div className="relative group">
                    <Stethoscope
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-muted group-focus-within:text-rosewood transition"
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
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-misty/40 bg-vanilla/30 focus:outline-none focus:border-rosewood focus:ring-4 focus:ring-rosewood/10 transition"
                    />
                  </div>

                  <p className="text-[10px] text-midnight-muted mt-2">
                    Enter the branded link shared by your therapist.
                  </p>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block font-bold mb-2">
                  Password
                </label>

                <div className="relative group">
                  <Lock
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-muted group-focus-within:text-rosewood transition"
                  />

                  <input
                    type="password"
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
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-misty/40 bg-vanilla/30 focus:outline-none focus:border-rosewood focus:ring-4 focus:ring-rosewood/10 transition font-mono"
                  />
                </div>
              </div>

              {/* Confirm */}
              <div>
                <label className="block font-bold mb-2">
                  Confirm password
                </label>

                <div className="relative group">
                  <Lock
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight-muted group-focus-within:text-rosewood transition"
                  />

                  <input
                    type="password"
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
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-misty/40 bg-vanilla/30 focus:outline-none focus:border-rosewood focus:ring-4 focus:ring-rosewood/10 transition font-mono"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full py-4 rounded-2xl bg-rosewood hover:bg-rosewood-hover disabled:opacity-60 text-white font-bold text-xs transition-all duration-200 shadow-lg shadow-rosewood/20 flex items-center justify-center gap-2 mt-2"
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

            {/* Login */}
            <div className="pt-6 mt-6 border-t border-misty/20 text-center">
              <p className="text-xs text-midnight-muted">
                Already have an account?
              </p>

              <Link
                to={`/login?role=${selectedRole}`}
                className="inline-flex items-center gap-1 mt-1.5 font-bold text-rosewood hover:underline text-xs"
              >
                Sign in
                <ArrowRight size={12} />
              </Link>
            </div>

          </div>

          <p className="text-center text-[10px] text-midnight-muted mt-5">
            A simpler, calmer way to manage your Unfazed experience.
          </p>

        </motion.div>
      </section>
    </div>
  );
};

export default Register;