import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [role, setRole] = useState(
    () => localStorage.getItem('unfazed_role') || null
  );

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem('unfazed_auth_token'))
  );

  const [loading, setLoading] = useState(true);

  // =========================================================
  // RESTORE LOGIN SESSION
  // =========================================================

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem(
        'unfazed_auth_token'
      );

      const storedRole = localStorage.getItem(
        'unfazed_role'
      );

      // No previous login
      if (!token || !storedRole) {
        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        // =====================================================
        // CLIENT SESSION
        // =====================================================

        if (storedRole === 'client') {
          const response = await axiosInstance.get(
            '/clients/me'
          );

          const client =
            response.data?.client || null;

          const therapist =
            response.data?.therapist || null;

          if (!client) {
            throw new Error(
              'Client profile could not be restored'
            );
          }

          const clientUser = {
            ...client,
            therapist,
          };

          setUser(clientUser);
          setRole('client');
          setIsAuthenticated(true);

          return;
        }

        // =====================================================
        // THERAPIST SESSION
        // =====================================================

        if (storedRole === 'therapist') {
          const response = await axiosInstance.get(
            '/auth/me'
          );

          const therapist =
            response.data?.therapist || null;

          if (!therapist) {
            throw new Error(
              'Therapist profile could not be restored'
            );
          }

          setUser(therapist);
          setRole('therapist');
          setIsAuthenticated(true);

          return;
        }

        // Unknown role
        throw new Error('Invalid stored role');

      } catch (error) {
        console.error(
          'Session restore failed:',
          error
        );

        localStorage.removeItem(
          'unfazed_auth_token'
        );

        localStorage.removeItem(
          'unfazed_role'
        );

        setUser(null);
        setRole(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  // =========================================================
  // LOGIN
  // =========================================================

  const login = async (
    email,
    password,
    selectedRole = 'therapist'
  ) => {
    const response = await axiosInstance.post(
      '/auth/login',
      {
        email,
        password,
        role: selectedRole,
      }
    );

    const data = response.data;

    const loggedInRole =
      data?.role || selectedRole;

    let loggedInUser = null;

    // =====================================================
    // CLIENT
    // =====================================================

    if (loggedInRole === 'client') {
      loggedInUser = {
        ...(data?.client || {}),
        therapist:
          data?.therapist || null,
      };
    }

    // =====================================================
    // THERAPIST
    // =====================================================

    if (loggedInRole === 'therapist') {
      loggedInUser =
        data?.therapist || null;
    }

    if (!loggedInUser) {
      throw new Error(
        'User information was not returned by the server'
      );
    }

    // Save authentication
    if (data?.token) {
      localStorage.setItem(
        'unfazed_auth_token',
        data.token
      );
    }

    localStorage.setItem(
      'unfazed_role',
      loggedInRole
    );

    // Update React state immediately
    setUser(loggedInUser);
    setRole(loggedInRole);
    setIsAuthenticated(true);

    return {
      success: true,
      role: loggedInRole,
      user: loggedInUser,
      therapist:
        data?.therapist || null,
      client:
        data?.client || null,
    };
  };

  // =========================================================
  // THERAPIST REGISTER
  // =========================================================

  const register = async (formData) => {
    const response = await axiosInstance.post(
      '/auth/register',
      formData
    );

    const data = response.data;

    if (data?.token) {
      localStorage.setItem(
        'unfazed_auth_token',
        data.token
      );
    }

    localStorage.setItem(
      'unfazed_role',
      'therapist'
    );

    setUser(data?.therapist || null);
    setRole('therapist');
    setIsAuthenticated(true);

    return {
      success: true,
      role: 'therapist',
      user: data?.therapist || null,
      therapist:
        data?.therapist || null,
    };
  };

  // =========================================================
  // COMPATIBILITY ALIASES
  // =========================================================
  // Some existing client components may still use
  // currentClient/currentTherapist.
  // Keep them available so those pages don't crash.

  const currentClient =
    role === 'client' ? user : null;

  const currentTherapist =
    role === 'therapist'
      ? user
      : user?.therapist || null;

  // =========================================================
  // LOGOUT
  // =========================================================

  const logout = () => {
    localStorage.removeItem(
      'unfazed_auth_token'
    );

    localStorage.removeItem(
      'unfazed_role'
    );

    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        loading,

        login,
        register,
        logout,

        // Compatibility for existing pages
        currentClient,
        currentTherapist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// =========================================================
// USE AUTH
// =========================================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
};

export default AuthContext;