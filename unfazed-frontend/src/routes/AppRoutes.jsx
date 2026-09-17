import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Common Components
import Sidebar from '../components/common/Sidebar';
import QuickRoleBar from '../components/common/QuickRoleBar';
import Toast from '../components/common/Toast';

// Auth
import { useAuth } from '../context/AuthContext';

// Auth Pages
import Login from '../auth/Login';
import Register from '../auth/Register';

// Therapist Pages
import Dashboard from '../pages/therapist/Dashboard';
import Clients from '../pages/therapist/Clients';
import Schedule from '../pages/therapist/Schedule';
import Notes from '../pages/therapist/Notes';
import Payments from '../pages/therapist/Payments';
import Packages from '../pages/therapist/Packages';
import Analytics from '../pages/therapist/Analytics';
import Chat from '../pages/therapist/Chat';
import Profile from '../pages/therapist/Profile';
import Settings from '../pages/therapist/Settings';
import Subscription from '../pages/therapist/Subscription';

// Client Pages
import PublicProfile from '../pages/client/PublicProfile';
import BookingPage from '../pages/client/BookingPage';
import Payment from '../pages/client/Payment';
import BookingConfirmation from '../pages/client/BookingConfirmation';
import ClientPortal from '../pages/client/ClientPortal';
import ClientNotes from '../pages/client/ClientNotes';
import ClientChat from '../pages/client/ClientChat';
import ClientSettings from '../pages/client/ClientSettings';
import ClientIntake from '../pages/client/ClientIntake';
import ClientConsent from '../pages/client/ClientConsent';


// ============================================================
// Authentication + Role Protected Route
// ============================================================

const ProtectedRoute = ({ allowedRole }) => {
  const {
    isAuthenticated,
    role,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-vanilla flex items-center justify-center">
        <div className="w-9 h-9 rounded-full border-4 border-misty/30 border-t-rosewood animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    if (role === 'therapist') {
      return (
        <Navigate
          to="/therapist/dashboard"
          replace
        />
      );
    }

    if (role === 'client') {
      return (
        <Navigate
          to="/client/portal"
          replace
        />
      );
    }

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};


// ============================================================
// Therapist Layout Wrapper
// ============================================================

const TherapistLayout = () => {
  return (
    <div className="flex min-h-screen bg-vanilla text-midnight font-sans">

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </div>

    </div>
  );
};


// ============================================================
// App Routes
// ============================================================

export const AppRoutes = () => {

  const {
    isAuthenticated,
    role,
  } = useAuth();

  // ==========================================================
  // Where should authenticated user go?
  // ==========================================================

  const authenticatedHome =
    role === 'client'
      ? '/client/portal'
      : '/therapist/dashboard';

  return (
    <>
      <Routes>

        {/* ==================================================
            ROOT
            ================================================== */}

        <Route
          path="/"
          element={
            isAuthenticated
              ? <Navigate
                  to={authenticatedHome}
                  replace
                />
              : <Navigate
                  to="/login"
                  replace
                />
          }
        />


        {/* ==================================================
            AUTHENTICATION
            ================================================== */}

        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate
                  to={authenticatedHome}
                  replace
                />
              : <Login />
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated
              ? <Navigate
                  to={authenticatedHome}
                  replace
                />
              : <Register />
          }
        />

        {/* Legacy client auth URLs */}
        <Route
          path="/client/login"
          element={
            isAuthenticated
              ? <Navigate
                  to={authenticatedHome}
                  replace
                />
              : <Login />
          }
        />

        <Route
          path="/client/register"
          element={
            isAuthenticated
              ? <Navigate
                  to={authenticatedHome}
                  replace
                />
              : <Register />
          }
        />


        {/* ==================================================
            PUBLIC BRANDED PROFILE
            No login required
            ================================================== */}

        <Route
          path="/dr-aditi-sharma"
          element={<PublicProfile />}
        />

        <Route
          path="/therapist/:slug"
          element={<PublicProfile />}
        />


        {/* ==================================================
            THERAPIST AREA
            THERAPIST ONLY
            ================================================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRole="therapist"
            />
          }
        >

          <Route
            path="/therapist"
            element={<TherapistLayout />}
          >

            <Route
              index
              element={
                <Navigate
                  to="/therapist/dashboard"
                  replace
                />
              }
            />

            <Route
              path="dashboard"
              element={<Dashboard />}
            />

            <Route
              path="clients"
              element={<Clients />}
            />

            <Route
              path="clients/:id"
              element={<Clients />}
            />

            <Route
              path="schedule"
              element={<Schedule />}
            />

            <Route
              path="notes"
              element={<Notes />}
            />

            <Route
              path="payments"
              element={<Payments />}
            />

            <Route
              path="packages"
              element={<Packages />}
            />

            <Route
              path="analytics"
              element={<Analytics />}
            />

            <Route
              path="chat"
              element={<Chat />}
            />

            <Route
              path="profile"
              element={<Profile />}
            />

            <Route
              path="settings"
              element={<Settings />}
            />

            <Route
              path="subscription"
              element={<Subscription />}
            />

          </Route>

        </Route>


        {/* ==================================================
            CLIENT AREA
            CLIENT ONLY
            ================================================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRole="client"
            />
          }
        >

          <Route
            path="/client"
            element={<Outlet />}
          >

            {/* /client → /client/portal */}
            <Route
              index
              element={
                <Navigate
                  to="/client/portal"
                  replace
                />
              }
            />

            <Route
              path="portal"
              element={<ClientPortal />}
            />

            <Route
              path="booking"
              element={<BookingPage />}
            />

            <Route
              path="intake"
              element={<ClientIntake />}
            />

            <Route
              path="consent"
              element={<ClientConsent />}
            />

            <Route
              path="payment"
              element={<Payment />}
            />

            <Route
              path="confirmation"
              element={<BookingConfirmation />}
            />

            <Route
              path="notes"
              element={<ClientNotes />}
            />

            <Route
              path="chat"
              element={<ClientChat />}
            />

            <Route
              path="settings"
              element={<ClientSettings />}
            />

          </Route>


          {/* ==================================================
              CLIENT PORTAL ALIAS

              QuickRoleBar / older components may use this.
              Both URLs open the same client portal.
              ================================================== */}

          <Route
            path="/client-portal"
            element={<ClientPortal />}
          />

        </Route>


        {/* ==================================================
            FALLBACK
            ================================================== */}

        <Route
          path="*"
          element={
            isAuthenticated
              ? (
                  <Navigate
                    to={authenticatedHome}
                    replace
                  />
                )
              : (
                  <Navigate
                    to="/login"
                    replace
                  />
                )
          }
        />

      </Routes>


      {/* ==================================================
          DEMO CONTROL
          Role-based inside QuickRoleBar
          ================================================== */}

      {isAuthenticated && <QuickRoleBar />}


      {/* ==================================================
          GLOBAL TOAST
          ================================================== */}

      <Toast />

    </>
  );
};

export default AppRoutes;