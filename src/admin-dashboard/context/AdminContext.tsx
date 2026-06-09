import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AdminContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>({
    id: 'admin-1',
    name: 'Super Admin',
    email: 'admin@caffelino.com',
    role: 'platform_owner'
  }); // Mocked for now since admin login logic varies

  const logout = () => {
    localStorage.removeItem('token');
    setAdmin(null);
    window.location.href = '/login';
  };

  return (
    <AdminContext.Provider value={{ admin, isAuthenticated: !!admin, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};
