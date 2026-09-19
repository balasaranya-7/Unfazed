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
  CheckCircle2,
  Eye,
  EyeOff,
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
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen bg-vanilla text-midnight font-sans overflow-hidden">

      {/* ==================================================
          DESKTOP SPLIT SCREEN
      ================================================== */}

      <div className="min-h-screen lg:grid lg:grid-cols-[1.05fr_0.95fr]">

        {/* ==================================================
            LEFT BRAND PANEL
        ================================================== */}

        <motion.section
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65 }}
          className="
            hidden lg:flex
            relative
            overflow-hidden
            bg-midnight
            text-vanilla
            p-12
            xl:p-16
            flex-col
            justify-between
          "
        >

          {/* Decorative background */}
          <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-rosewood/20 blur-3xl" />

          <div className="absolute top-1/2 -left-40 w-96 h-96 rounded-full bg-blush/10 blur-3xl" />

          <div className="absolute -bottom-40 right-10 w-80 h-80 rounded-full bg-sunwashed/10 blur-3xl" />

          <div className="absolute inset-0 opacity-[0.035]">
            <div
              className="
                absolute inset-0
                bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)]
                bg-[size:28px_28px]
              "
            />
          </div>

          {/* LOGO */}

          <div className="relative z-10 flex items-center gap-3">

            <div
              className="
                w-12 h-12
                rounded-2xl
                bg-gradient-to-br
                from-blush
                to-rosewood
                flex
                items-center
                justify-center
                shadow-lg
                shadow-black/20
              "
            >
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


          {/* MAIN CONTENT */}

          <div className="relative z-10 max-w-xl">

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55 }}
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                bg-white/5
                border
                border-white/10
                text-blush
                text-xs
                font-bold
                mb-7
              "
            >
              <Sparkles size={14} />

              <span>
                A calmer way to work.
              </span>
            </motion.div>


            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6 }}
              className="
                font-display
                text-5xl
                xl:text-6xl
                font-black
                leading-[1.05]
                tracking-tight
              "
            >
              Your practice,

              <br />

              <span className="text-blush">
                beautifully unfazed.
              </span>
            </motion.h2>


            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.6 }}
              className="
                mt-6
                text-sm
                leading-7
                text-misty
                max-w-lg
              "
            >
              Manage your clients, schedule, clinical notes,
              payments and communication from one calm,
              connected workspace.
            </motion.p>


            {/* FEATURES */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-9 space-y-4"
            >

              <div className="flex items-center gap-3">

                <div className="
                  w-8 h-8
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  flex
                  items-center
                  justify-center
                ">
                  <HeartHandshake
                    size={15}
                    className="text-blush"
                  />
                </div>

                <span className="text-sm text-vanilla/90">
                  Client-first practice management
                </span>

              </div>


              <div className="flex items-center gap-3">

                <div className="
                  w-8 h-8
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  flex
                  items-center
                  justify-center
                ">
                  <ShieldCheck
                    size={15}
                    className="text-blush"
                  />
                </div>

                <span className="text-sm text-vanilla/90">
                  Private & secure workspace
                </span>

              </div>


              <div className="flex items-center gap-3">

                <div className="
                  w-8 h-8
                  rounded-xl
                  bg-white/5
                  border
                  border-white/10
                  flex
                  items-center
                  justify-center
                ">
                  <Stethoscope
                    size={15}
                    className="text-blush"
                  />
                </div>

                <span className="text-sm text-vanilla/90">
                  Scheduling, documentation & billing
                </span>

              </div>

            </motion.div>

          </div>


          {/* FOOTER */}

          <div className="relative z-10 flex items-center justify-between">

            <p className="text-[11px] text-misty">
              A calmer operating system for modern therapy practices.
            </p>

            <div className="flex items-center gap-2 text-[10px] text-misty">
              <CheckCircle2 size={13} className="text-blush" />
              Secure workspace
            </div>

          </div>

        </motion.section>


        {/* ==================================================
            RIGHT LOGIN AREA
        ================================================== */}

        <section
          className="
            min-h-screen
            flex
            items-center
            justify-center
            p-5
            sm:p-8
            lg:p-10
            xl:p-14
            bg-vanilla
            relative
          "
        >

          {/* Mobile decorative shapes */}

          <div className="
            lg:hidden
            absolute
            -top-32
            -right-24
            w-72
            h-72
            rounded-full
            bg-sunwashed/30
            blur-3xl
          " />

          <div className="
            lg:hidden
            absolute
            -bottom-32
            -left-24
            w-72
            h-72
            rounded-full
            bg-dewy-blue/30
            blur-3xl
          " />


          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              ease: 'easeOut'
            }}
            className="w-full max-w-md relative z-10"
          >

            {/* MOBILE LOGO */}

            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">

              <div
                className="
                  w-12 h-12
                  rounded-2xl
                  bg-midnight
                  flex
                  items-center
                  justify-center
                  shadow-lg
                "
              >
                <span className="font-display font-black text-2xl text-blush">
                  U
                </span>
              </div>

              <div>
                <h1 className="font-display text-2xl font-extrabold">
                  Unfazed
                </h1>

                <p className="text-[11px] text-midnight-muted">
                  Therapist Practice Hub
                </p>
              </div>

            </div>


            {/* LOGIN CARD */}

            <div
              className="
                bg-white
                rounded-[2rem]
                p-6
                sm:p-8
                xl:p-9
                border
                border-misty/30
                shadow-[0_25px_70px_rgba(47,68,84,0.12)]
              "
            >

              {/* HEADER */}

              <div className="mb-7">

                <div className="
                  w-11 h-11
                  rounded-2xl
                  bg-sunwashed/40
                  flex
                  items-center
                  justify-center
                  mb-5
                ">
                  <Lock
                    size={19}
                    className="text-rosewood"
                  />
                </div>

                <p className="
                  text-[11px]
                  font-extrabold
                  uppercase
                  tracking-[0.16em]
                  text-rosewood
                  mb-2
                ">
                  Welcome back
                </p>

                <h2 className="
                  text-3xl
                  sm:text-4xl
                  font-black
                  font-display
                  text-midnight
                  tracking-tight
                ">
                  Sign in
                </h2>

                <p className="
                  text-xs
                  text-midnight-muted
                  mt-2
                  leading-5
                ">
                  Choose your account type and continue to your workspace.
                </p>

              </div>


              {/* ROLE SELECTOR */}

              <div className="mb-6">

                <label className="
                  block
                  font-extrabold
                  text-xs
                  text-midnight
                  mb-2.5
                ">
                  Continue as
                </label>


                <div className="
                  grid
                  grid-cols-2
                  gap-2
                  p-1.5
                  rounded-2xl
                  bg-cloud-puff
                  border
                  border-misty/30
                ">

                  {/* THERAPIST */}

                  <button
                    type="button"
                    onClick={() => setRole('therapist')}
                    className={`
                      relative
                      flex
                      items-center
                      justify-center
                      gap-2
                      py-3
                      px-3
                      rounded-xl
                      text-xs
                      font-extrabold
                      transition-all
                      duration-200
                      ${
                        role === 'therapist'
                          ? `
                            bg-midnight
                            text-vanilla
                            shadow-md
                          `
                          : `
                            text-midnight-muted
                            hover:text-midnight
                            hover:bg-white/70
                          `
                      }
                    `}
                  >

                    <Stethoscope size={16} />

                    Therapist

                  </button>


                  {/* CLIENT */}

                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`
                      relative
                      flex
                      items-center
                      justify-center
                      gap-2
                      py-3
                      px-3
                      rounded-xl
                      text-xs
                      font-extrabold
                      transition-all
                      duration-200
                      ${
                        role === 'client'
                          ? `
                            bg-midnight
                            text-vanilla
                            shadow-md
                          `
                          : `
                            text-midnight-muted
                            hover:text-midnight
                            hover:bg-white/70
                          `
                      }
                    `}
                  >

                    <UserRound size={16} />

                    Client

                  </button>

                </div>

              </div>


              {/* FORM */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5 text-xs"
              >

                {/* EMAIL */}

                <div>

                  <label className="
                    block
                    font-extrabold
                    text-xs
                    text-midnight
                    mb-2
                  ">
                    Email address
                  </label>

                  <div className="relative">

                    <Mail
                      size={17}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-midnight-muted
                        pointer-events-none
                      "
                    />

                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      className="
                        w-full
                        pl-11
                        pr-4
                        py-3.5
                        rounded-2xl
                        bg-cloud-puff/35
                        border
                        border-misty/40
                        text-sm
                        text-midnight
                        placeholder:text-midnight-muted/60
                        transition
                        focus:outline-none
                        focus:ring-4
                        focus:ring-rosewood/10
                        focus:border-rosewood
                      "
                    />

                  </div>

                </div>


                {/* PASSWORD */}

                <div>

                  <label className="
                    block
                    font-extrabold
                    text-xs
                    text-midnight
                    mb-2
                  ">
                    Password
                  </label>

                  <div className="relative">

                    <Lock
                      size={17}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-midnight-muted
                        pointer-events-none
                      "
                    />

                    <input
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      required
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                      className="
                        w-full
                        pl-11
                        pr-12
                        py-3.5
                        rounded-2xl
                        bg-cloud-puff/35
                        border
                        border-misty/40
                        text-sm
                        text-midnight
                        placeholder:text-midnight-muted/60
                        transition
                        focus:outline-none
                        focus:ring-4
                        focus:ring-rosewood/10
                        focus:border-rosewood
                      "
                    />


                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (previous) => !previous
                        )
                      }
                      className="
                        absolute
                        right-3.5
                        top-1/2
                        -translate-y-1/2
                        w-8
                        h-8
                        rounded-lg
                        flex
                        items-center
                        justify-center
                        text-midnight-muted
                        hover:text-midnight
                        hover:bg-misty/20
                        transition
                      "
                      aria-label={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                    >

                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}

                    </button>

                  </div>

                </div>


                {/* SIGN IN BUTTON */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group
                    w-full
                    py-3.5
                    rounded-2xl
                    bg-midnight
                    hover:bg-rosewood
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    text-vanilla
                    font-extrabold
                    text-sm
                    transition-all
                    duration-300
                    shadow-lg
                    shadow-midnight/15
                    flex
                    items-center
                    justify-center
                    gap-2
                    mt-2
                  "
                >

                  <span>
                    {loading
                      ? 'Signing in...'
                      : role === 'client'
                        ? 'Sign in as Client'
                        : 'Sign in as Therapist'}
                  </span>

                  {!loading && (
                    <ArrowRight
                      size={16}
                      className="
                        transition-transform
                        group-hover:translate-x-1
                      "
                    />
                  )}

                </button>

              </form>


              {/* SECURITY NOTE */}

              <div className="
                mt-5
                flex
                items-center
                justify-center
                gap-2
                text-[10px]
                text-midnight-muted
              ">

                <ShieldCheck size={13} />

                Secure account access

              </div>


              {/* REGISTER */}

              <div className="
                pt-5
                mt-5
                border-t
                border-misty/20
                text-center
                text-xs
                text-midnight-muted
              ">

                Don't have an account?{' '}

                <Link
                  to={`/register?role=${role}`}
                  className="
                    font-extrabold
                    text-rosewood
                    hover:underline
                  "
                >
                  {role === 'client'
                    ? 'Create client account'
                    : 'Create therapist account'}
                </Link>

              </div>

            </div>


            {/* BOTTOM TEXT */}

            <p className="
              text-center
              text-[10px]
              text-midnight-muted
              mt-5
            ">
              Unfazed · A calmer way to manage care
            </p>

          </motion.div>

        </section>

      </div>

    </div>
  );
};

export default Login;