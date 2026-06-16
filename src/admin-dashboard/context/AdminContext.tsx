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
  notifications: any[];
  markNotificationAsRead: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>({
    id: 'admin-1',
    name: 'Super Admin',
    email: 'admin@caffelino.com',
    role: 'platform_owner'
  }); // Mocked for now since admin login logic varies

  const [notifications, setNotifications] = useState<any[]>([
    { id: '1', title: 'New Organizer Request', message: 'Coffee Connect requested verification.', read: false, createdAt: new Date().toISOString() },
    { id: '2', title: 'Event Sold Out', message: 'The Weekend Hackathon is sold out!', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  ]);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAdmin(null);
    window.location.href = '/login';
  };

  return (
    <AdminContext.Provider value={{ admin, isAuthenticated: !!admin, logout, notifications, markNotificationAsRead }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};
