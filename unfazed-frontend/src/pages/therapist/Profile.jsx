import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  Globe,
  ExternalLink,
  Copy,
  Check,
  Camera,
  Save,
  ShieldCheck
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Profile = () => {
  const navigate = useNavigate();
  const { therapist, updateTherapist, showToast } = useData();
  const [copied, setCopied] = useState(false);

  // Dynamic therapist initial
  const therapistInitial =
    (therapist?.name || 'Therapist')
      .trim()
      .charAt(0)
      .toUpperCase();

  // Form State
  const [formData, setFormData] = useState({
    name: therapist.name,
    title: therapist.title,
    qualification: therapist.qualification,
    email: therapist.email,
    phone: therapist.phone,
    location: therapist.location,
    bio: therapist.bio,
    slug: therapist.slug,
    languages:
      therapist.languages?.join(', ') ||
      'English, Hindi, Kannada',
    specializations:
      therapist.specializations?.join(', ') || ''
  });

  const handleCopyLink = () => {
    const fullUrl =
      `${window.location.origin}/therapist/${therapist.slug}`;

    navigator.clipboard.writeText(fullUrl);

    setCopied(true);

    showToast(
      'Branded public profile link copied!'
    );

    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateTherapist({
      name: formData.name,
      title: formData.title,
      qualification: formData.qualification,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      bio: formData.bio,
      slug: formData.slug,
      languages: formData.languages
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean),
      specializations: formData.specializations
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    });
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-vanilla pb-16">

      {/* Top Header */}
      <div className="bg-white border-b border-misty/30 px-6 sm:px-8 py-6">

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>
            <div className="flex items-center gap-2">

              <span className="text-xs font-bold uppercase tracking-wider text-rosewood">
                Therapist Identity
              </span>

              <span className="w-1.5 h-1.5 rounded-full bg-sage" />

              <span className="text-xs font-semibold text-midnight-muted">
                RCI Licensure Verified
              </span>

            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-display text-midnight tracking-tight mt-1">
              Therapist Profile & Branded Link
            </h1>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() =>
                navigate(
                  `/therapist/${therapist.slug}`
                )
              }
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-midnight text-vanilla text-xs font-semibold hover:bg-midnight-light transition shadow-sm"
            >
              <ExternalLink size={14} />
              <span>
                Preview Public Branded Page
              </span>
            </button>

          </div>

        </div>

      </div>

      <main className="p-6 sm:p-8 max-w-5xl mx-auto w-full space-y-8">

        {/* Branded Profile Link Spotlight Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-midnight via-midnight-light to-midnight text-vanilla border border-blush/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>

            <span className="text-xs font-bold uppercase tracking-wider text-blush">
              Your Branded Practice Address
            </span>

            <h3 className="text-lg font-bold font-display text-white mt-0.5">
              Share one link with clients for intake, booking, and payment
            </h3>

            <p className="text-xs text-misty mt-1 font-mono">
              unfazed.in/{formData.slug}
            </p>

          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-2xl bg-rosewood hover:bg-rosewood-hover text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-md"
            >
              {copied ? (
                <Check size={14} className="text-sage" />
              ) : (
                <Copy size={14} />
              )}

              <span>
                {copied ? 'Copied' : 'Copy Link'}
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/therapist/${therapist.slug}`
                )
              }
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
            >
              Open Page
            </button>

          </div>

        </div>

        {/* Profile Editor Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-misty/30 card-shadow space-y-6"
        >

          {/* Avatar & Cover Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-misty/20">

            <div className="relative">

              {/* Dynamic Avatar - No Broken Image */}
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blush to-rosewood border-4 border-blush shadow-md flex items-center justify-center">

                <span className="font-display font-black text-4xl text-midnight">
                  {therapistInitial}
                </span>

              </div>

              <button
                type="button"
                className="absolute bottom-0 right-0 p-2 rounded-xl bg-midnight text-vanilla hover:bg-midnight-light transition shadow-md"
                title="Change Photo"
              >
                <Camera size={14} />
              </button>

            </div>

            <div className="space-y-1 text-center sm:text-left">

              <h3 className="text-lg font-bold font-display text-midnight">
                {therapist.name}
              </h3>

              <p className="text-xs text-midnight-muted">
                {therapist.title}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs">

                <span className="px-2.5 py-0.5 rounded-full bg-sage-light text-sage-dark font-semibold border border-sage/40 flex items-center gap-1">
                  <ShieldCheck size={12} />
                  RCI Registered
                </span>

                <span className="px-2.5 py-0.5 rounded-full bg-vanilla text-midnight font-medium border border-misty/30">
                  {therapist.experience}
                </span>

              </div>

            </div>

          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block text-xs font-bold text-midnight mb-1">
                Full Name & Honorific *
              </label>

              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-midnight mb-1">
                Professional Title *
              </label>

              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
              />
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="block text-xs font-bold text-midnight mb-1">
                Qualifications & Licensure *
              </label>

              <input
                type="text"
                required
                value={formData.qualification}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    qualification: e.target.value
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-midnight mb-1">
                Public Custom Slug (URL)
              </label>

              <div className="flex items-center rounded-xl border border-misty/50 overflow-hidden">

                <span className="px-3 py-2.5 bg-vanilla/60 text-xs text-midnight-muted border-r border-misty/30">
                  unfazed.in/
                </span>

                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: e.target.value
                    })
                  }
                  className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
                />

              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <div>
              <label className="block text-xs font-bold text-midnight mb-1">
                Practice Email
              </label>

              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-midnight mb-1">
                Phone / WhatsApp
              </label>

              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-midnight mb-1">
                Consultation Languages
              </label>

              <input
                type="text"
                value={formData.languages}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    languages: e.target.value
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
              />
            </div>

          </div>

          <div>
            <label className="block text-xs font-bold text-midnight mb-1">
              Therapist Clinical Biography & Approach
            </label>

            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  bio: e.target.value
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-midnight mb-1">
              Specializations (Comma Separated)
            </label>

            <input
              type="text"
              value={formData.specializations}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specializations: e.target.value
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-misty/50 text-sm focus:outline-none focus:border-rosewood"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-misty/20">

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-rosewood text-white font-semibold text-sm hover:bg-rosewood-hover transition shadow-md shadow-rosewood/20"
            >
              <Save size={16} />
              <span>Save Practice Profile</span>
            </button>

          </div>

        </form>

      </main>

    </div>
  );
};

export default Profile;