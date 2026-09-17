import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Globe2,
  LogOut,
  UserRound,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const QuickRoleBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, role, logout } = useAuth();

  const isTherapist = role === 'therapist';
  const isClient = role === 'client';

  // Same therapist slug logic used by Sidebar.jsx
  const therapistSlug = isTherapist
    ? user?.slug
    : user?.therapist?.slug;

  // IMPORTANT:
  // Sidebar opens: /therapist/${therapist.slug}
  const publicPagePath = therapistSlug
    ? `/therapist/${therapistSlug}`
    : '/therapist/dr-aditi-sharma';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (
    location.pathname === '/login' ||
    location.pathname === '/register'
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-midnight text-vanilla border border-white/10 shadow-2xl backdrop-blur-md">

        {/* ================= THERAPIST ================= */}
        {isTherapist && (
          <>
            <button
              type="button"
              onClick={() => navigate('/therapist/dashboard')}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                location.pathname.startsWith('/therapist/dashboard')
                  ? 'bg-rosewood text-white'
                  : 'hover:bg-white/10 text-misty hover:text-white'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(publicPagePath)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                location.pathname === publicPagePath
                  ? 'bg-rosewood text-white'
                  : 'hover:bg-white/10 text-misty hover:text-white'
              }`}
            >
              <Globe2 size={16} />
              <span>Public Page</span>
            </button>
          </>
        )}

        {/* ================= CLIENT ================= */}
        {isClient && (
          <>
            <button
              type="button"
              onClick={() => navigate('/client-portal')}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                location.pathname === '/client-portal'
                  ? 'bg-rosewood text-white'
                  : 'hover:bg-white/10 text-misty hover:text-white'
              }`}
            >
              <UserRound size={16} />
              <span>My Portal</span>
            </button>

            <button
              type="button"
              onClick={() => navigate(publicPagePath)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                location.pathname === publicPagePath
                  ? 'bg-rosewood text-white'
                  : 'hover:bg-white/10 text-misty hover:text-white'
              }`}
            >
              <ExternalLink size={16} />
              <span>Therapist Public Page</span>
            </button>
          </>
        )}

        {/* ================= LOGOUT ================= */}
        {(isTherapist || isClient) && (
          <>
            <div className="w-px h-6 bg-white/10 mx-1.5" />

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-misty hover:text-white hover:bg-white/10 transition"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default QuickRoleBar;