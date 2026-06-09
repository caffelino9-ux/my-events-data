import React, { createContext, useContext, useState } from 'react';

interface Organizer {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface OrganizerContextType {
  organizer: Organizer | null;
  isAuthenticated: boolean;
  logout: () => void;
}

const OrganizerContext = createContext<OrganizerContextType | undefined>(undefined);

export const OrganizerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organizer, setOrganizer] = useState<Organizer | null>({
    id: 'org-1',
    name: 'Sample Organizer',
    email: 'organizer@example.com',
    role: 'organizer'
  }); // Mocking logged-in user for now

  const logout = () => {
    localStorage.removeItem('token');
    setOrganizer(null);
    window.location.href = '/login';
  };

  return (
    <OrganizerContext.Provider value={{ organizer, isAuthenticated: !!organizer, logout }}>
      {children}
    </OrganizerContext.Provider>
  );
};

export const useOrganizer = () => {
  const context = useContext(OrganizerContext);
  if (!context) throw new Error('useOrganizer must be used within OrganizerProvider');
  return context;
};
