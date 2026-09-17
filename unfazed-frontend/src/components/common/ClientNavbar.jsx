import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  BookOpen,
  MessageCircle,
  Settings,
  Menu,
  X,
  HeartHandshake,
  User,
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const ClientNavbar = () => {
  const navigate = useNavigate();

  const {
    currentClient,
    currentTherapist,
  } = useAuth();

  const {
    therapist: demoTherapist,
    messages = [],
  } = useData();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  // =========================================================
  // ACTUAL LOGGED-IN CLIENT
  // =========================================================

  const client = currentClient || {};

  // =========================================================
  // ACTUAL CLIENT'S THERAPIST
  // =========================================================

  const therapist =
    client?.therapist ||
    currentTherapist ||
    demoTherapist ||
    {};

  const clientName =
    client?.name ||
    client?.fullName ||
    'Client';

  const therapistName =
    therapist?.name ||
    'Your Therapist';

  // =========================================================
  // CLIENT AVATAR
  // =========================================================

  const avatar =
    client?.avatar ||
    client?.profileImage ||
    client?.photo ||
    null;

  // First letter fallback instead of broken <img>
  const avatarLetter =
    clientName?.trim()?.charAt(0)?.toUpperCase() ||
    'C';

  // =========================================================
  // UNREAD MESSAGES
  // =========================================================

  const unreadCount = messages.filter(
    (message) =>
      message?.sender === 'therapist' &&
      !message?.read
  ).length;

  // =========================================================
  // NAVIGATION
  // =========================================================

  const links = [
    {
      name: 'My Sanctuary',
      path: '/client/portal',
      icon: Sparkles,
    },
    {
      name: 'Shared Notes',
      path: '/client/notes',
      icon: BookOpen,
    },
    {
      name: `Chat with ${therapistName}`,
      path: '/client/chat',
      icon: MessageCircle,
      badge: unreadCount,
    },
    {
      name: 'Book Session',
      path: '/client/booking',
      icon: Calendar,
      highlight: true,
    },
    {
      name: 'Settings',
      path: '/client/settings',
      icon: Settings,
    },
  ];

  // =========================================================
  // THERAPIST PUBLIC PAGE
  // =========================================================

  const therapistSlug =
    therapist?.slug || 'dr-aditi-sharma';

  const therapistPublicPath =
    `/${therapistSlug}`;

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem('unfazed_auth_token');
    localStorage.removeItem('unfazed_role');

    navigate('/login', {
      replace: true,
    });

    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-30 bg-vanilla-light/95 backdrop-blur-md border-b border-blush/40 px-4 sm:px-8 py-3.5 shadow-sm">

      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* =====================================================
            LEFT — CLIENT / THERAPIST BRANDING
        ===================================================== */}

        <div className="flex items-center gap-3">

          <button
            onClick={() =>
              navigate('/client/portal')
            }
            className="flex items-center gap-2.5 text-left group"
          >

            <div className="w-10 h-10 rounded-2xl bg-blush-light border border-blush flex items-center justify-center text-rosewood shadow-sm group-hover:scale-105 transition">

              <HeartHandshake size={20} />

            </div>

            <div>

              <span className="text-xs font-bold uppercase tracking-wider text-rosewood">
                Client Sanctuary
              </span>

              <h2 className="text-base font-bold font-display text-midnight tracking-tight leading-tight">
                {clientName}
              </h2>

            </div>

          </button>

        </div>

        {/* =====================================================
            DESKTOP NAVIGATION
        ===================================================== */}

        <nav className="hidden md:flex items-center gap-1 bg-white/70 p-1.5 rounded-2xl border border-misty/30 shadow-sm">

          {links.map((link) => {

            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-midnight text-vanilla shadow-sm font-bold'
                      : link.highlight
                      ? 'bg-blush-light text-rosewood hover:bg-blush'
                      : 'text-midnight-muted hover:text-midnight hover:bg-vanilla-dark/30'
                  }`
                }
              >

                <Icon size={15} />

                <span>
                  {link.name}
                </span>

                {link.badge ? (
                  <span className="w-2 h-2 rounded-full bg-rosewood animate-pulse" />
                ) : null}

              </NavLink>
            );

          })}

        </nav>

        {/* =====================================================
            RIGHT — ACTUAL CLIENT PROFILE
        ===================================================== */}

        <div className="hidden sm:flex items-center gap-3">

          <div className="flex items-center gap-2.5 bg-white px-3 py-1.5 rounded-2xl border border-misty/30 shadow-sm">

            {/* Avatar */}
            {avatar ? (

              <img
                src={avatar}
                alt={clientName}
                className="w-7 h-7 rounded-xl object-cover border border-blush"
                onError={(event) => {
                  event.currentTarget.style.display =
                    'none';

                  event.currentTarget.nextElementSibling.style.display =
                    'flex';
                }}
              />

            ) : null}

            {/* Safe letter avatar */}
            <div
              className={`w-7 h-7 rounded-xl border border-blush bg-blush-light text-rosewood items-center justify-center text-xs font-bold ${
                avatar ? 'hidden' : 'flex'
              }`}
            >
              {avatarLetter}
            </div>

            <div className="text-left">

              <p className="text-xs font-bold text-midnight leading-tight">
                {clientName}
              </p>

              <span className="text-[10px] text-sage-dark font-medium">
                Session #9 Confirmed
              </span>

            </div>

          </div>

        </div>

        {/* =====================================================
            MOBILE MENU BUTTON
        ===================================================== */}

        <div className="md:hidden flex items-center gap-2">

          <button
            onClick={() =>
              setMobileMenuOpen(
                !mobileMenuOpen
              )
            }
            className="p-2 text-midnight hover:bg-blush-light rounded-xl transition"
          >

            {mobileMenuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}

          </button>

        </div>

      </div>

      {/* =======================================================
          MOBILE MENU
      ======================================================= */}

      {mobileMenuOpen && (

        <div className="md:hidden mt-3 pt-3 border-t border-blush/30 space-y-1.5 pb-2">

          {links.map((link) => {

            const Icon = link.icon;

            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-midnight text-vanilla'
                      : 'text-midnight hover:bg-blush-light'
                  }`
                }
              >

                <div className="flex items-center gap-3">

                  <Icon size={18} />

                  <span>
                    {link.name}
                  </span>

                </div>

                {link.badge ? (
                  <span className="w-2 h-2 rounded-full bg-rosewood animate-pulse" />
                ) : null}

              </NavLink>
            );

          })}

          {/* Therapist Public Page */}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              navigate(therapistPublicPath);
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-midnight hover:bg-blush-light transition"
          >

            <User size={18} />

            <span>
              Therapist Public Page
            </span>

          </button>

          {/* Logout */}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rosewood hover:bg-blush-light transition"
          >

            <X size={18} />

            <span>
              Logout
            </span>

          </button>

        </div>

      )}

    </header>
  );
};

export default ClientNavbar;