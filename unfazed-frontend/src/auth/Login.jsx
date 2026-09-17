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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useData();

  const [role, setRole] = useState('therapist');

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
    <div className="min-h-screen bg-vanilla text-midnight font-sans lg:grid lg:grid-cols-2">

      {/* LEFT SIDE */}
      <motion.section
        initial={{ opacity: 0, x: -25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex relative overflow-hidden bg-midnight text-vanilla p-12 xl:p-16 flex-col justify-between"
      >
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-rosewood/20 blur-3xl" />

        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-blush/10 blur-3xl" />

        {/* LOGO */}
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
              Therapist Practice Hub
            </p>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="relative z-10 max-w-xl space-y-7">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rosewood/20 border border-rosewood/30 text-blush text-xs font-bold">
            <Sparkles size={13} />
            A calmer way to work.
          </div>

          <div>
            <h2 className="font-display text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight">
              Your practice,
              <br />
              <span className="text-blush">unfazed.</span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-misty max-w-lg">
              Manage your clients, schedule, clinical notes, payments
              and communication from one calm, connected workspace.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3">
              <HeartHandshake size={16} className="text-blush" />
              <span className="text-vanilla/90">
                Client-first practice management
              </span>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck size={16} className="text-blush" />
              <span className="text-vanilla/90">
                Private & secure workspace
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Stethoscope size={16} className="text-blush" />
              <span className="text-vanilla/90">
                Scheduling, documentation & billing
              </span>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-[11px] text-misty">
          A calmer operating system for modern therapy practices.
        </p>
      </motion.section>

      {/* RIGHT SIDE */}
      <section className="min-h-screen flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-vanilla">

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >

          {/* MOBILE LOGO */}
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
                Therapist Practice Hub
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-7 sm:p-10 border border-misty/30 card-shadow shadow-xl">

            {/* HEADING */}
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-wider text-rosewood mb-1">
                Welcome back
              </p>

              <h2 className="text-3xl font-bold font-display text-midnight tracking-tight">
                Sign In
              </h2>

              <p className="text-xs text-midnight-muted mt-2">
                Choose your account type to continue.
              </p>
            </div>

            {/* ROLE SELECTION */}
            <div className="mb-6">
              <label className="block font-bold text-xs mb-2">
                Sign in as
              </label>

              <div className="grid grid-cols-2 gap-3">

                {/* THERAPIST */}
                <button
                  type="button"
                  onClick={() => setRole('therapist')}
                  className={`p-4 rounded-2xl border text-left transition ${
                    role === 'therapist'
                      ? 'border-rosewood bg-rosewood/5'
                      : 'border-misty/40 hover:border-rosewood/40'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${
                      role === 'therapist'
                        ? 'bg-rosewood text-white'
                        : 'bg-misty/20 text-midnight'
                    }`}
                  >
                    <Stethoscope size={17} />
                  </div>

                  <p className="font-bold text-xs">
                    Therapist
                  </p>

                  <p className="text-[10px] text-midnight-muted mt-1">
                    Manage your practice
                  </p>
                </button>

                {/* CLIENT */}
                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`p-4 rounded-2xl border text-left transition ${
                    role === 'client'
                      ? 'border-rosewood bg-rosewood/5'
                      : 'border-misty/40 hover:border-rosewood/40'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${
                      role === 'client'
                        ? 'bg-rosewood text-white'
                        : 'bg-misty/20 text-midnight'
                    }`}
                  >
                    <UserRound size={17} />
                  </div>

                  <p className="font-bold text-xs">
                    Client
                  </p>

                  <p className="text-[10px] text-midnight-muted mt-1">
                    Access your portal
                  </p>
                </button>

              </div>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4 text-xs text-midnight"
            >

              {/* EMAIL */}
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
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-misty/40 focus:outline-none focus:border-rosewood"
                  />
                </div>
              </div>

              {/* PASSWORD */}
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
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-misty/40 focus:outline-none focus:border-rosewood font-mono"
                  />
                </div>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-rosewood hover:bg-rosewood-hover disabled:opacity-60 text-white font-bold text-xs transition shadow-md shadow-rosewood/20 flex items-center justify-center gap-2 mt-2"
              >
                <span>
                  {loading
                    ? 'Signing in...'
                    : role === 'client'
                      ? 'Sign In as Client'
                      : 'Sign In as Therapist'}
                </span>

                <ArrowRight size={14} />
              </button>

            </form>

            {/* REGISTER */}
            <div className="pt-5 mt-6 border-t border-misty/20 text-center text-xs text-midnight-muted">
              Don't have an account?{' '}

              <Link
                to={`/register?role=${role}`}
                className="font-bold text-rosewood hover:underline"
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