import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Helper to get storage keys for a given role
const getStorageKeys = (role) => ({
  user: `hrms_${role}_user`,
  token: `hrms_${role}_token`,
});

export const AuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [employeeUser, setEmployeeUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore both sessions from localStorage
  useEffect(() => {
    const adminKeys = getStorageKeys('admin');
    const userKeys = getStorageKeys('user');

    const storedAdmin = localStorage.getItem(adminKeys.user);
    const adminToken = localStorage.getItem(adminKeys.token);
    if (storedAdmin && adminToken) {
      setAdminUser(JSON.parse(storedAdmin));
    }

    const storedUser = localStorage.getItem(userKeys.user);
    const userToken = localStorage.getItem(userKeys.token);
    if (storedUser && userToken) {
      setEmployeeUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // Login stores the session under the correct role key
  const login = (userData, token) => {
    const role = userData.role; // 'admin' or 'user'
    const keys = getStorageKeys(role);
    localStorage.setItem(keys.user, JSON.stringify(userData));
    localStorage.setItem(keys.token, token);

    if (role === 'admin') {
      setAdminUser(userData);
    } else {
      setEmployeeUser(userData);
    }
  };

  // Logout only clears the specified role's session
  const logout = (role) => {
    const keys = getStorageKeys(role);
    localStorage.removeItem(keys.user);
    localStorage.removeItem(keys.token);

    if (role === 'admin') {
      setAdminUser(null);
    } else {
      setEmployeeUser(null);
    }
  };

  // Get the current active user based on role
  const getUserForRole = (role) => {
    return role === 'admin' ? adminUser : employeeUser;
  };

  // Get token for a specific role
  const getTokenForRole = (role) => {
    const keys = getStorageKeys(role);
    return localStorage.getItem(keys.token);
  };

  return (
    <AuthContext.Provider value={{
      adminUser,
      employeeUser,
      login,
      logout,
      loading,
      getUserForRole,
      getTokenForRole,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
