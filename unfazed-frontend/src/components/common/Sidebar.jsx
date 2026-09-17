import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  CreditCard,
  Package,
  BarChart3,
  MessageSquare,
  User,
  Settings,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Menu,
  X,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { therapist, messages, showToast } = useData();
  const [copied, setCopied] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Unread messages for therapist
  const unreadMessagesCount =
    messages.filter(
      (m) => m.sender === 'client' && !m.read
    ).length || 2;

  const navItems = [
    {
      name: 'Dashboard',
      path: '/therapist/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Clients',
      path: '/therapist/clients',
      icon: Users,
    },
    {
      name: 'Schedule',
      path: '/therapist/schedule',
      icon: Calendar,
    },
    {
      name: 'Notes',
      path: '/therapist/notes',
      icon: FileText,
    },
    {
      name: 'Payments',
      path: '/therapist/payments',
      icon: CreditCard,
    },
    {
      name: 'Packages',
      path: '/therapist/packages',
      icon: Package,
    },
    {
      name: 'Analytics',
      path: '/therapist/analytics',
      icon: BarChart3,
    },
    {
      name: 'Chat',
      path: '/therapist/chat',
      icon: MessageSquare,
      badge: unreadMessagesCount,
    },
    {
      name: 'Profile',
      path: '/therapist/profile',
      icon: User,
    },
    {
      name: 'Settings',
      path: '/therapist/settings',
      icon: Settings,
    },
    {
      name: 'Subscription',
      path: '/therapist/subscription',
      icon: Sparkles,
      highlight: true,
    },
  ];

  const handleCopyLink = () => {
    const fullUrl = `${window.location.origin}/therapist/${therapist.slug}`;

    navigator.clipboard.writeText(fullUrl);

    setCopied(true);

    showToast('Branded link copied to clipboard!');

    setTimeout(() => setCopied(false), 2000);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-midnight text-vanilla justify-between p-4 sm:p-5 select-none">

      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between pb-6 mb-3 border-b border-midnight-light">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blush to-rosewood flex items-center justify-center shadow-md">
              <span className="font-display font-black text-xl text-midnight">
                U
              </span>
            </div>

            <div>
              <div className="flex items-center gap-1.5">

                <span className="font-display font-extrabold text-xl tracking-tight text-vanilla">
                  Unfazed
                </span>

                <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-rosewood/40 text-blush">
                  Pro
                </span>

              </div>

              <p className="text-[11px] text-misty">
                Therapist Practice Hub
              </p>
            </div>

          </div>

          {mobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-2 text-misty hover:text-vanilla rounded-lg"
            >
              <X size={20} />
            </button>
          )}

        </div>

        {/* Branded Link Pill */}
        <div className="mb-5 p-3 rounded-2xl bg-midnight-light/60 border border-misty/20">

          <div className="flex items-center justify-between mb-1.5">

            <span className="text-[11px] font-semibold text-misty flex items-center gap-1">
              Your Branded Link
            </span>

            <span className="w-2 h-2 rounded-full bg-sage animate-pulse" />

          </div>

          <div className="flex items-center justify-between gap-2 bg-midnight/80 p-2 rounded-xl border border-midnight-soft">

            <span className="text-xs font-mono text-blush truncate">
              unfazed.in/{therapist.slug}
            </span>

            <div className="flex items-center gap-1">

              <button
                onClick={handleCopyLink}
                title="Copy public link"
                className="p-1 hover:text-vanilla text-misty rounded hover:bg-midnight-light transition"
              >
                {copied ? (
                  <Check size={13} className="text-sage" />
                ) : (
                  <Copy size={13} />
                )}
              </button>

              <button
                onClick={() =>
                  navigate(`/therapist/${therapist.slug}`)
                }
                title="Open public profile preview"
                className="p-1 hover:text-vanilla text-misty rounded hover:bg-midnight-light transition"
              >
                <ExternalLink size={13} />
              </button>

            </div>

          </div>

        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">

          {navItems.map((item) => {

            const Icon = item.icon;

            const isActive =
              location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-rosewood text-white shadow-md shadow-rosewood/20 font-semibold'
                    : 'text-misty hover:text-vanilla hover:bg-midnight-light/70'
                }`}
              >

                <div className="flex items-center gap-3">

                  <Icon
                    size={18}
                    className={
                      isActive
                        ? 'text-white'
                        : 'text-misty group-hover:text-blush transition-colors'
                    }
                  />

                  <span>{item.name}</span>

                </div>

                {item.badge ? (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-blush text-midnight">
                    {item.badge}
                  </span>
                ) : item.highlight ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blush/20 text-blush">
                    {therapist.subscription?.tier || 'Pro'}
                  </span>
                ) : null}

                {/* Animated active pill */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute left-0 w-1.5 h-6 rounded-r-full bg-blush"
                    transition={{
                      type: 'spring',
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}

              </NavLink>
            );

          })}

        </nav>

      </div>

      {/* Bottom Profile Footer */}
      <div className="pt-4 border-t border-midnight-light mt-4">

        <NavLink
          to="/therapist/profile"
          className="flex items-center gap-3 p-2 rounded-2xl hover:bg-midnight-light/70 transition"
        >

          {/* FIXED: No broken image */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blush to-rosewood flex items-center justify-center border-2 border-blush/40 shadow-sm flex-shrink-0">
            <span className="font-display font-extrabold text-lg text-midnight">
              {(therapist?.name || 'Therapist')
                .charAt(0)
                .toUpperCase()}
            </span>
          </div>

          <div className="flex-1 min-w-0">

            <h4 className="text-sm font-semibold text-vanilla truncate">
              {therapist.name}
            </h4>

            <p className="text-[11px] text-misty truncate">
              {therapist.title}
            </p>

          </div>

        </NavLink>

      </div>

    </div>
  );

  return (
    <>
      {/* Mobile Hamburger Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-midnight text-vanilla px-4 py-3 flex items-center justify-between border-b border-midnight-light">

        <div className="flex items-center gap-2.5">

          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blush to-rosewood flex items-center justify-center">
            <span className="font-display font-black text-midnight text-sm">
              U
            </span>
          </div>

          <span className="font-display font-bold text-lg text-vanilla">
            Unfazed
          </span>

        </div>

        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-misty hover:text-vanilla rounded-xl hover:bg-midnight-light"
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 xl:w-72 h-screen sticky top-0 flex-shrink-0 z-20">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">

          <div
            className="fixed inset-0 bg-midnight/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs h-full z-10">
            {navContent}
          </div>

        </div>
      )}

    </>
  );
};

export default Sidebar;