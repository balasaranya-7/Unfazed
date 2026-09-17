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
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { registerTherapist } = useAuth();
  const { showToast, updateTherapist } = useData();

  /*
    Role comes from:
    /register?role=therapist
    /register?role=client

    Therapist is the default.
  */
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
        /*
          Client registration is handled by the
          client registration API.
        */
        const response = await fetch(
          'http://localhost:5000/api/auth/register-client',
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

      /*
        Existing therapist registration flow
      */
      const data = await registerTherapist({
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
          LEFT BRANDING PANEL
      ====================================================== */}
      <motion.section
        initial={{ opacity: 0, x: -25 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden lg:flex relative overflow-hidden bg-midnight text-vanilla p-12 xl:p-16 flex-col justify-between"
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-rosewood/20 blur-3xl" />

        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-blush/10 blur-3xl" />

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

        {/* Main branding */}
        <div className="relative z-10 max-w-xl space-y-7">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rosewood/20 border border-rosewood/30 text-blush text-xs font-bold">
            <Sparkles size={13} />

            {isClient
              ? 'Your private wellness space.'
              : 'Build your practice with clarity.'}
          </div>

          <div>
            <h2 className="font-display text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight">

              {isClient ? (
                <>
                  Create your{' '}
                  <span className="text-blush">
                    Unfazed
                  </span>{' '}
                  client space.
                </>
              ) : (
                <>
                  Start your{' '}
                  <span className="text-blush">
                    Unfazed
                  </span>{' '}
                  practice space.
                </>
              )}

            </h2>

            <p className="mt-5 text-sm leading-7 text-misty max-w-lg">
              {isClient
                ? 'Create your client account to access your sessions, shared reflections, bookings, payments and conversations in one private space.'
                : 'Create your therapist account and manage your clients, schedule, notes, payments and branded link from one workspace.'}
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-3 text-xs">

            <div className="flex items-center gap-3">
              {isClient ? (
                <Users
                  size={16}
                  className="text-blush"
                />
              ) : (
                <HeartHandshake
                  size={16}
                  className="text-blush"
                />
              )}

              <span className="text-vanilla/90">
                {isClient
                  ? 'Personal client wellness portal'
                  : 'Client-first practice management'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Award
                size={16}
                className="text-blush"
              />

              <span className="text-vanilla/90">
                {isClient
                  ? 'Sessions, reflections & shared notes'
                  : 'Professional profile & branded link'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Stethoscope
                size={16}
                className="text-blush"
              />

              <span className="text-vanilla/90">
                {isClient
                  ? 'Booking, payments & communication'
                  : 'Scheduling, documentation & billing'}
              </span>
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
          RIGHT FORM
      ====================================================== */}
      <section className="min-h-screen flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-vanilla">

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">

            <div className="w-11 h-11 rounded-2xl bg-midnight text-vanilla flex items-center justify-center shadow-md">
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

          <div className="bg-white rounded-3xl p-7 sm:p-10 border border-misty/30 card-shadow shadow-xl">

            {/* Header */}
            <div className="mb-7">

              <p className="text-xs font-bold uppercase tracking-wider text-rosewood mb-1">
                {isClient
                  ? 'New client'
                  : 'New practice'}
              </p>

              <h2 className="text-3xl font-bold font-display text-midnight tracking-tight">

                {isClient
                  ? 'Create Client Account'
                  : 'Create Therapist Account'}

              </h2>

              <p className="text-xs text-midnight-muted mt-2">

                {isClient
                  ? 'Create your private client account to continue.'
                  : 'Set up your workspace and your branded practice identity.'}

              </p>

            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4 text-xs text-midnight"
            >

              {/* Full Name */}
              <div>
                <label className="block font-bold mb-1.5">
                  Full Name *
                </label>

                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-midnight-muted"
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-misty/40 focus:outline-none focus:border-rosewood"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-bold mb-1.5">
                  Email Address *
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-midnight-muted"
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-misty/40 focus:outline-none focus:border-rosewood"
                  />
                </div>
              </div>

              {/* Therapist-specific qualification */}
              {!isClient && (
                <div>
                  <label className="block font-bold mb-1.5">
                    Qualification
                  </label>

                  <div className="relative">
                    <Award
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-midnight-muted"
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
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-misty/40 focus:outline-none focus:border-rosewood"
                    />
                  </div>
                </div>
              )}

              {/* Client therapist slug */}
              {isClient && (
                <div>
                  <label className="block font-bold mb-1.5">
                    Therapist Branded Link *
                  </label>

                  <div className="relative">
                    <Stethoscope
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-midnight-muted"
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
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-misty/40 focus:outline-none focus:border-rosewood"
                    />
                  </div>

                  <p className="text-[10px] text-midnight-muted mt-1.5">
                    Enter the branded link shared by your therapist.
                  </p>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block font-bold mb-1.5">
                  Password *
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-midnight-muted"
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-misty/40 focus:outline-none focus:border-rosewood font-mono"
                  />
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="block font-bold mb-1.5">
                  Confirm Password *
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-midnight-muted"
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
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-misty/40 focus:outline-none focus:border-rosewood font-mono"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-rosewood hover:bg-rosewood-hover disabled:opacity-60 text-white font-bold text-xs transition shadow-md shadow-rosewood/20 flex items-center justify-center gap-2 mt-2"
              >
                <span>
                  {loading
                    ? 'Creating account...'
                    : isClient
                    ? 'Create Client Account'
                    : 'Create Practice Account'}
                </span>

                <ArrowRight size={14} />
              </button>

            </form>

            {/* Sign in */}
            <div className="pt-5 mt-6 border-t border-misty/20 text-center text-xs text-midnight-muted">

              Already have an account?{' '}

              <Link
                to={`/login?role=${selectedRole}`}
                className="font-bold text-rosewood hover:underline"
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