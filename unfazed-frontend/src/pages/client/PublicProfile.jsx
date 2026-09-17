import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Globe,
  Heart,
  Star,
  ChevronRight,
  Video,
  ArrowRight,
  ExternalLink,
  Users,
  MessageCircle,
  Award,
  Briefcase,
  LockKeyhole,
  Check,
} from 'lucide-react';

import { useData } from '../../context/DataContext';
import { formatINR } from '../../utils/formatters';

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: 'easeOut',
    },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const PublicProfile = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { therapist } = useData();

  const services = Array.isArray(therapist?.services)
    ? therapist.services
    : [];

  const specializations = Array.isArray(therapist?.specializations)
    ? therapist.specializations
    : [];

  const languages = Array.isArray(therapist?.languages)
    ? therapist.languages
    : [];

  const availability = therapist?.availability || {};

  const [selectedService, setSelectedService] = useState(
    services[0] || null
  );

  const therapistName = therapist?.name || 'Therapist';

  const therapistInitials = useMemo(() => {
    return therapistName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join('');
  }, [therapistName]);

  const therapistAvatar =
    therapist?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      therapistName
    )}&background=FFE0E8&color=2E151B&size=400`;

  const handleBookNow = (service) => {
    const targetService = service || selectedService || services[0];

    navigate('/client/booking', {
      state: {
        serviceId: targetService?.id || targetService?._id,
        therapistSlug: slug || therapist?.slug,
      },
    });
  };

  const getAvailabilityDays = () => {
    if (Array.isArray(availability)) {
      return availability;
    }

    return Object.entries(availability).map(([day, value]) => ({
      day,
      value,
    }));
  };

  const availabilityDays = getAvailabilityDays();

  const getDayLabel = (day) => {
    if (!day) return '';

    return String(day)
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-vanilla text-midnight font-sans overflow-x-hidden">

      {/* =========================================================
          TOP NAVIGATION
      ========================================================= */}
      <nav className="sticky top-0 z-40 glass-nav border-b border-misty/20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-4">
          <div className="flex items-center justify-between gap-4">

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="flex items-center gap-3 text-left"
            >
              <div className="w-10 h-10 rounded-2xl bg-midnight text-vanilla flex items-center justify-center shadow-md">
                <span className="font-display font-black text-xl text-blush">
                  U
                </span>
              </div>

              <div className="hidden sm:block">
                <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-rosewood">
                  Unfazed
                </span>

                <p className="text-sm font-bold font-display text-midnight leading-tight">
                  Therapy Practice
                </p>
              </div>
            </motion.button>

            <div className="flex items-center gap-2 sm:gap-3">

              <button
                onClick={() => navigate('/client/login')}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-midnight hover:bg-vanilla-dark/40 transition"
              >
                Client Login
              </button>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleBookNow(services[0])}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl bg-rosewood text-white text-xs font-bold hover:bg-rosewood-hover transition shadow-lg shadow-rosewood/20"
              >
                <Calendar size={15} />
                <span>Book Consultation</span>
              </motion.button>

            </div>
          </div>
        </div>
      </nav>

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden">

        {/* Background decoration */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blush-light/40 blur-3xl pointer-events-none" />
        <div className="absolute top-40 -left-40 w-80 h-80 rounded-full bg-sage-light/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-12 sm:pt-16 lg:pt-20 pb-12">

          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-center"
          >

            {/* Therapist image */}
            <motion.div
              variants={fadeUp}
              className="flex justify-center lg:justify-start"
            >
              <div className="relative">

                <div className="absolute -inset-5 rounded-[3rem] bg-blush-light/40 rotate-3" />

                <motion.div
                  whileHover={{
                    rotate: -1,
                    scale: 1.015,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="relative w-64 h-72 sm:w-80 sm:h-[22rem] rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl bg-white"
                >
                  <img
                    src={therapistAvatar}
                    alt={therapistName}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-midnight/60 to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                    <span className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur text-[10px] font-bold text-midnight">
                      {therapistInitials}
                    </span>

                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur text-[10px] font-bold text-sage-dark">
                      <span className="w-2 h-2 rounded-full bg-sage-dark animate-pulse" />
                      Available
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.7,
                    duration: 0.45,
                  }}
                  className="absolute -bottom-5 -right-4 sm:-right-7 bg-white rounded-2xl border border-misty/30 shadow-xl px-4 py-3 flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-sage-light flex items-center justify-center">
                    <ShieldCheck
                      size={19}
                      className="text-sage-dark"
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-midnight-muted">
                      Verified Practice
                    </p>
                    <p className="text-xs font-bold text-midnight">
                      Secure & Confidential
                    </p>
                  </div>
                </motion.div>

              </div>
            </motion.div>

            {/* Hero content */}
            <motion.div
              variants={fadeUp}
              className="text-center lg:text-left"
            >

              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-blush-light text-rosewood text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-5">
                <Sparkles size={13} />
                <span>
                  Clinical Psychologist & Psychotherapist
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.02] text-midnight">
                {therapistName}
              </h1>

              {therapist?.qualification && (
                <p className="mt-4 text-sm sm:text-base font-semibold text-rosewood">
                  {therapist.qualification}
                </p>
              )}

              <p className="mt-5 text-sm sm:text-base lg:text-[15px] text-midnight/75 leading-7 max-w-2xl mx-auto lg:mx-0">
                {therapist?.bio ||
                  'A confidential and supportive space to understand yourself, work through challenges, and build meaningful change.'}
              </p>

              {/* Meta information */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2.5 mt-7">

                {therapist?.location && (
                  <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-misty/30 text-xs font-semibold text-midnight">
                    <MapPin
                      size={14}
                      className="text-rosewood"
                    />
                    {therapist.location}
                  </div>
                )}

                {languages.length > 0 && (
                  <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-misty/30 text-xs font-semibold text-midnight">
                    <Globe
                      size={14}
                      className="text-sage-dark"
                    />
                    {languages.join(', ')}
                  </div>
                )}

                <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-misty/30 text-xs font-semibold text-midnight">
                  <Video
                    size={14}
                    className="text-rosewood"
                  />
                  Online & In-Person
                </div>

              </div>

              {/* Hero actions */}
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 mt-8">

                <motion.button
                  whileHover={{
                    y: -2,
                    boxShadow:
                      '0 15px 30px rgba(46,21,27,0.14)',
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={() => handleBookNow(services[0])}
                  className="px-7 py-3.5 rounded-2xl bg-rosewood text-white text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-rosewood/20"
                >
                  <Calendar size={16} />
                  Book a Session
                  <ArrowRight size={15} />
                </motion.button>

                <button
                  onClick={() => {
                    document
                      .getElementById('services')
                      ?.scrollIntoView({
                        behavior: 'smooth',
                      });
                  }}
                  className="px-7 py-3.5 rounded-2xl bg-white border border-misty/40 text-midnight text-xs font-bold flex items-center justify-center gap-2 hover:border-rosewood/40 hover:bg-white transition"
                >
                  Explore Sessions
                  <ChevronRight size={15} />
                </button>

              </div>

              {/* Trust line */}
              <div className="flex items-center justify-center lg:justify-start gap-2 mt-6 text-[11px] text-midnight-muted">
                <LockKeyhole size={13} />
                Your information remains private and confidential.
              </div>

            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          STATS
      ========================================================= */}
      <section className="px-5 sm:px-8 lg:px-12 pb-14">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto bg-midnight rounded-[2rem] overflow-hidden"
        >

          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-vanilla/10">

            <motion.div
              variants={fadeUp}
              className="p-5 sm:p-7 text-center"
            >
              <Award
                size={20}
                className="mx-auto text-blush mb-2"
              />
              <p className="text-2xl font-display font-extrabold text-vanilla">
                8+
              </p>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-vanilla/50 mt-1">
                Years of Practice
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="p-5 sm:p-7 text-center"
            >
              <Users
                size={20}
                className="mx-auto text-blush mb-2"
              />
              <p className="text-2xl font-display font-extrabold text-vanilla">
                500+
              </p>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-vanilla/50 mt-1">
                Sessions Completed
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="p-5 sm:p-7 text-center"
            >
              <Star
                size={20}
                className="mx-auto text-blush mb-2"
              />
              <p className="text-2xl font-display font-extrabold text-vanilla">
                4.9
              </p>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-vanilla/50 mt-1">
                Client Rating
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="p-5 sm:p-7 text-center"
            >
              <MessageCircle
                size={20}
                className="mx-auto text-blush mb-2"
              />
              <p className="text-2xl font-display font-extrabold text-vanilla">
                &lt; 24h
              </p>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-vanilla/50 mt-1">
                Typical Response
              </p>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* =========================================================
          ABOUT / APPROACH
      ========================================================= */}
      <section className="bg-white border-y border-misty/20 py-16 sm:py-20 px-5 sm:px-8 lg:px-12">

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start"
        >

          <motion.div variants={fadeUp}>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] text-rosewood">
              About the Practice
            </span>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">
              A space where you can slow down and be heard.
            </h2>

            <div className="w-16 h-1 rounded-full bg-blush mt-6" />
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="space-y-5"
          >
            <p className="text-sm sm:text-base text-midnight/75 leading-7">
              Therapy is not about having all the answers immediately.
              It is about creating a safe space where you can understand
              what you are experiencing and move forward at your own pace.
            </p>

            <p className="text-sm sm:text-base text-midnight/75 leading-7">
              Sessions are collaborative, confidential, and tailored to
              your individual concerns, circumstances, and goals.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 pt-4">

              <div className="rounded-2xl bg-vanilla/60 border border-misty/30 p-5">
                <div className="w-10 h-10 rounded-xl bg-blush-light flex items-center justify-center mb-3">
                  <Heart
                    size={19}
                    className="text-rosewood"
                  />
                </div>

                <h3 className="text-sm font-bold">
                  Client-centered care
                </h3>

                <p className="text-xs text-midnight-muted leading-5 mt-1.5">
                  Sessions are shaped around your needs and personal
                  goals.
                </p>
              </div>

              <div className="rounded-2xl bg-vanilla/60 border border-misty/30 p-5">
                <div className="w-10 h-10 rounded-xl bg-sage-light flex items-center justify-center mb-3">
                  <ShieldCheck
                    size={19}
                    className="text-sage-dark"
                  />
                </div>

                <h3 className="text-sm font-bold">
                  Confidential by design
                </h3>

                <p className="text-xs text-midnight-muted leading-5 mt-1.5">
                  Your conversations and shared reflections are treated
                  with care and privacy.
                </p>
              </div>

            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* =========================================================
          SPECIALIZATIONS
      ========================================================= */}
      {specializations.length > 0 && (
        <section className="py-16 sm:py-20 px-5 sm:px-8 lg:px-12">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15,
            }}
            variants={staggerContainer}
            className="max-w-7xl mx-auto"
          >

            <motion.div
              variants={fadeUp}
              className="max-w-2xl mb-9"
            >
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] text-rosewood">
                Areas of Focus
              </span>

              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">
                Support for what you're going through.
              </h2>

              <p className="text-sm text-midnight-muted leading-6 mt-3">
                Explore the areas this practice works with and choose
                the kind of support that feels relevant to you.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {specializations.map((spec, index) => (
                <motion.div
                  key={`${spec}-${index}`}
                  variants={fadeUp}
                  whileHover={{
                    y: -5,
                  }}
                  className="group p-5 sm:p-6 rounded-3xl bg-white border border-misty/30 hover:border-blush shadow-sm hover:shadow-lg transition"
                >
                  <div className="w-11 h-11 rounded-2xl bg-blush-light flex items-center justify-center mb-4 group-hover:scale-105 transition">
                    <Heart
                      size={18}
                      className="text-rosewood"
                    />
                  </div>

                  <h3 className="text-sm font-bold text-midnight leading-snug">
                    {spec}
                  </h3>

                  <div className="flex items-center gap-1 text-[10px] font-semibold text-midnight-muted mt-3">
                    Learn more
                    <ArrowRight size={11} />
                  </div>
                </motion.div>
              ))}
            </motion.div>

          </motion.div>
        </section>
      )}

      {/* =========================================================
          SERVICES
      ========================================================= */}
      <section
        id="services"
        className="bg-white border-y border-misty/20 py-16 sm:py-20 px-5 sm:px-8 lg:px-12"
      >

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.12,
          }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto"
        >

          <motion.div
            variants={fadeUp}
            className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-10"
          >
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] text-rosewood">
                Consultation Options
              </span>

              <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">
                Choose the session that fits you.
              </h2>
            </div>

            <p className="text-xs text-midnight-muted max-w-md leading-5">
              Transparent pricing and simple booking. Choose a session,
              select a suitable time, and continue securely.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">

            {services.map((service, index) => {
              const serviceId =
                service?.id || service?._id || index;

              const isSelected =
                selectedService?.id === service?.id ||
                selectedService?._id === service?._id;

              const isPopular =
                service?.badge === 'Most Popular';

              return (
                <motion.div
                  key={serviceId}
                  variants={fadeUp}
                  whileHover={{
                    y: -7,
                  }}
                  onClick={() => setSelectedService(service)}
                  className={`relative rounded-[2rem] p-6 sm:p-7 border cursor-pointer transition ${
                    isSelected || isPopular
                      ? 'bg-midnight text-vanilla border-midnight shadow-2xl'
                      : 'bg-vanilla/50 border-misty/30 hover:border-blush bg-white'
                  }`}
                >

                  {service?.badge && (
                    <span
                      className={`absolute -top-3 left-6 px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-sm ${
                        isSelected || isPopular
                          ? 'bg-blush text-midnight'
                          : 'bg-rosewood text-white'
                      }`}
                    >
                      {service.badge}
                    </span>
                  )}

                  <div className="flex items-start justify-between gap-3">

                    <div>
                      <h3
                        className={`text-xl font-display font-extrabold ${
                          isSelected || isPopular
                            ? 'text-vanilla'
                            : 'text-midnight'
                        }`}
                      >
                        {service.title}
                      </h3>

                      <p
                        className={`text-xs leading-5 mt-2 ${
                          isSelected || isPopular
                            ? 'text-vanilla/60'
                            : 'text-midnight-muted'
                        }`}
                      >
                        {service.description}
                      </p>
                    </div>

                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSelected || isPopular
                          ? 'bg-white/10'
                          : 'bg-blush-light'
                      }`}
                    >
                      <Briefcase
                        size={17}
                        className={
                          isSelected || isPopular
                            ? 'text-blush'
                            : 'text-rosewood'
                        }
                      />
                    </div>

                  </div>

                  <div
                    className={`my-7 p-4 rounded-2xl border ${
                      isSelected || isPopular
                        ? 'bg-white/5 border-white/10'
                        : 'bg-vanilla/60 border-misty/30'
                    }`}
                  >
                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-3xl font-display font-extrabold ${
                          isSelected || isPopular
                            ? 'text-vanilla'
                            : 'text-midnight'
                        }`}
                      >
                        {formatINR(service.price)}
                      </span>

                      <span
                        className={`text-xs ${
                          isSelected || isPopular
                            ? 'text-vanilla/50'
                            : 'text-midnight-muted'
                        }`}
                      >
                        / session
                      </span>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 text-xs font-semibold mt-2 ${
                        isSelected || isPopular
                          ? 'text-blush'
                          : 'text-rosewood'
                      }`}
                    >
                      <Clock size={13} />
                      {service.duration} minutes
                    </div>
                  </div>

                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      handleBookNow(service);
                    }}
                    className={`w-full py-3.5 rounded-2xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                      isSelected || isPopular
                        ? 'bg-vanilla text-midnight hover:bg-blush'
                        : 'bg-midnight text-vanilla hover:bg-rosewood'
                    }`}
                  >
                    Book This Session
                    <ArrowRight size={14} />
                  </button>

                </motion.div>
              );
            })}

          </div>
        </motion.div>
      </section>

      {/* =========================================================
          AVAILABILITY
      ========================================================= */}
      <section className="py-16 sm:py-20 px-5 sm:px-8 lg:px-12">

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.4fr] gap-8"
        >

          <motion.div
            variants={fadeUp}
            className="bg-midnight rounded-[2rem] p-7 sm:p-9 text-vanilla"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
              <Calendar
                size={22}
                className="text-blush"
              />
            </div>

            <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-blush">
              Availability
            </span>

            <h2 className="font-display text-2xl sm:text-3xl font-extrabold mt-2">
              Find a time that works for you.
            </h2>

            <p className="text-xs text-vanilla/60 leading-6 mt-4">
              Choose from the available slots during booking. Your
              appointment is confirmed once the booking is completed.
            </p>

            <button
              onClick={() => handleBookNow(services[0])}
              className="mt-7 px-5 py-3 rounded-2xl bg-blush text-midnight text-xs font-bold hover:bg-white transition flex items-center gap-2"
            >
              Check Available Slots
              <ArrowRight size={14} />
            </button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="bg-white rounded-[2rem] border border-misty/30 p-6 sm:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-rosewood">
                  Weekly Schedule
                </p>

                <h3 className="text-lg font-display font-extrabold mt-1">
                  Typical availability
                </h3>
              </div>

              <div className="w-10 h-10 rounded-xl bg-sage-light flex items-center justify-center">
                <Clock
                  size={18}
                  className="text-sage-dark"
                />
              </div>
            </div>

            {availabilityDays.length > 0 ? (
              <div className="space-y-2.5">
                {availabilityDays.map((item, index) => {
                  const day =
                    typeof item === 'string'
                      ? item
                      : item?.day || item?.name || `Day ${index + 1}`;

                  const value =
                    typeof item === 'string'
                      ? 'Available'
                      : item?.value ||
                        item?.time ||
                        item?.slots ||
                        'Available';

                  return (
                    <div
                      key={`${day}-${index}`}
                      className="flex items-center justify-between gap-4 px-4 py-3.5 rounded-2xl bg-vanilla/50 border border-misty/20"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-sage-dark" />

                        <span className="text-xs font-bold">
                          {getDayLabel(day)}
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-midnight-muted">
                        {typeof value === 'object'
                          ? JSON.stringify(value)
                          : String(value)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl bg-vanilla/50 border border-misty/20 p-6 text-center">
                <Clock
                  size={25}
                  className="mx-auto text-midnight-muted mb-2"
                />

                <p className="text-sm font-bold">
                  Availability shown during booking
                </p>

                <p className="text-xs text-midnight-muted mt-1">
                  Select a session to view the latest available slots.
                </p>
              </div>
            )}
          </motion.div>

        </motion.div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section className="bg-white border-y border-misty/20 py-16 sm:py-20 px-5 sm:px-8 lg:px-12">

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto"
        >

          <motion.div
            variants={fadeUp}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.16em] text-rosewood">
              Simple Process
            </span>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold mt-2">
              Starting therapy can be simple.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">

            {[
              {
                number: '01',
                icon: Calendar,
                title: 'Choose a session',
                description:
                  'Select the consultation format and duration that suits your needs.',
              },
              {
                number: '02',
                icon: Clock,
                title: 'Pick a time',
                description:
                  'View available appointment slots and select a convenient time.',
              },
              {
                number: '03',
                icon: CheckCircle2,
                title: 'Confirm securely',
                description:
                  'Complete the booking process and receive your confirmation.',
              },
            ].map((step) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.number}
                  variants={fadeUp}
                  whileHover={{
                    y: -5,
                  }}
                  className="relative p-6 sm:p-7 rounded-[2rem] bg-vanilla/50 border border-misty/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-blush-light flex items-center justify-center">
                      <Icon
                        size={19}
                        className="text-rosewood"
                      />
                    </div>

                    <span className="text-3xl font-display font-black text-midnight/10">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-extrabold mt-6">
                    {step.title}
                  </h3>

                  <p className="text-xs text-midnight-muted leading-5 mt-2">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}

          </div>
        </motion.div>
      </section>

      {/* =========================================================
          TRUST / PRIVACY
      ========================================================= */}
      <section className="py-16 sm:py-20 px-5 sm:px-8 lg:px-12">

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.6,
          }}
          className="max-w-5xl mx-auto rounded-[2.5rem] bg-blush-light/50 border border-blush/40 p-8 sm:p-12 text-center"
        >

          <div className="w-14 h-14 rounded-2xl bg-white text-rosewood flex items-center justify-center mx-auto shadow-sm border border-blush">
            <ShieldCheck size={27} />
          </div>

          <span className="block text-[10px] uppercase tracking-[0.16em] font-bold text-rosewood mt-5">
            Your Privacy Matters
          </span>

          <h2 className="font-display text-2xl sm:text-3xl font-extrabold mt-2">
            A safe, confidential space for your journey.
          </h2>

          <p className="text-sm text-midnight/70 leading-6 max-w-2xl mx-auto mt-4">
            Your sessions, personal information, and shared reflections
            are handled with care. Unfazed keeps your therapy experience
            organized while protecting the information that matters.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-6">

            <span className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-[10px] font-bold text-midnight border border-misty/20">
              <Check size={13} className="text-sage-dark" />
              Private sessions
            </span>

            <span className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-[10px] font-bold text-midnight border border-misty/20">
              <Check size={13} className="text-sage-dark" />
              Secure booking
            </span>

            <span className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white text-[10px] font-bold text-midnight border border-misty/20">
              <Check size={13} className="text-sage-dark" />
              Confidential care
            </span>

          </div>

          <motion.button
            whileHover={{
              y: -2,
            }}
            whileTap={{
              scale: 0.98,
            }}
            onClick={() => handleBookNow(services[0])}
            className="mt-8 px-7 py-3.5 rounded-2xl bg-rosewood text-white text-xs font-bold hover:bg-rosewood-hover transition shadow-lg shadow-rosewood/20 inline-flex items-center gap-2"
          >
            Start Your Therapy Journey
            <ArrowRight size={14} />
          </motion.button>

        </motion.div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="bg-midnight text-vanilla py-10 px-5 sm:px-8">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-vanilla/10 flex items-center justify-center">
                  <span className="font-display font-black text-xl text-blush">
                    U
                  </span>
                </div>

                <div>
                  <p className="text-sm font-bold font-display">
                    {therapistName}
                  </p>

                  <p className="text-[9px] uppercase tracking-wider text-vanilla/40 mt-0.5">
                    Therapy Practice
                  </p>
                </div>
              </div>

              <p className="text-xs text-vanilla/45 mt-4 max-w-sm leading-5">
                A private and professional space for therapy,
                appointments, communication, and ongoing care.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">

              <button
                onClick={() => navigate('/client/login')}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-vanilla hover:bg-white/10 transition"
              >
                Client Login
              </button>

              <button
                onClick={() => handleBookNow(services[0])}
                className="px-4 py-2.5 rounded-xl bg-rosewood text-white text-[10px] font-bold hover:bg-rosewood-hover transition"
              >
                Book Consultation
              </button>

            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-[9px] text-vanilla/35">
            <p>
              Powered by Unfazed Practice OS
            </p>

            <p>
              {therapistName} Practice Link
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default PublicProfile;