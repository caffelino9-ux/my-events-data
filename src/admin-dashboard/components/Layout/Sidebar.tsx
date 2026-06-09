// Sidebar Navigation Component
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { useAdmin } from '../../context/AdminContext';

const SidebarContainer = styled.aside<{ isOpen: boolean }>`
  width: ${theme.componentSizes.sidebarWidth};
  background: linear-gradient(135deg, ${theme.colors.coffeeDark} 0%, ${theme.colors.coffeeMedium} 100%);
  color: ${theme.colors.cream};
  padding: 16px;
  overflow-y: auto;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 100;
  transition: transform ${theme.transitions.base};

  @media (max-width: ${theme.breakpoints.lg}) {
    transform: translateX(${(props) => (props.isOpen ? '0' : '-100%')});
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.gold};
    border-radius: 9999px;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 700;
  color: ${theme.colors.gold};

  svg {
    width: 32px;
    height: 32px;
  }
`;

const NavSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: 12px;
  font-weight: 600;
  color: ${theme.colors.coffeeLight};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  padding: 0 8px;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NavItem = styled(Link)<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 12px;
  border-radius: 12px;
  color: ${(props) => (props.isActive ? theme.colors.gold : theme.colors.cream)};
  background-color: ${(props) =>
    props.isActive ? 'rgba(212, 175, 55, 0.1)' : 'transparent'};
  transition: all ${theme.transitions.fast};
  text-decoration: none;
  font-weight: ${(props) => (props.isActive ? '600' : 'normal')};
  border-left: 3px solid ${(props) => (props.isActive ? theme.colors.gold : 'transparent')};

  &:hover {
    background-color: rgba(212, 175, 55, 0.1);
    color: ${theme.colors.gold};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const NavLabel = styled.span`
  font-size: 14px;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 12px;
  border-radius: 12px;
  background-color: rgba(244, 67, 54, 0.1);
  color: #FF6B6B;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all ${theme.transitions.fast};
  margin-top: 24px;

  &:hover {
    background-color: rgba(244, 67, 54, 0.2);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const { logout } = useAdmin();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    // Redirect to login page handled by router
  };

  return (
    <SidebarContainer isOpen={isOpen}>
      <Logo>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path d="M12 6v6l4 2" strokeWidth="2" />
        </svg>
        Caffelino
      </Logo>

      <NavSection>
        <SectionTitle>Main</SectionTitle>
        <NavList>
          <NavItem to="/admin" isActive={isActive('/admin') && location.pathname === '/admin'}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="7" strokeWidth="2" />
              <rect x="14" y="3" width="7" height="7" strokeWidth="2" />
              <rect x="3" y="14" width="7" height="7" strokeWidth="2" />
              <rect x="14" y="14" width="7" height="7" strokeWidth="2" />
            </svg>
            <NavLabel>Dashboard</NavLabel>
          </NavItem>
        </NavList>
      </NavSection>

      <NavSection>
        <SectionTitle>Management</SectionTitle>
        <NavList>
          <NavItem to="/admin/events" isActive={isActive('/admin/events')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
              <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2" />
            </svg>
            <NavLabel>Events</NavLabel>
          </NavItem>
          <NavItem to="/admin/organizers" isActive={isActive('/admin/organizers')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2" />
              <circle cx="9" cy="7" r="4" strokeWidth="2" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeWidth="2" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeWidth="2" />
            </svg>
            <NavLabel>Organizers</NavLabel>
          </NavItem>
          <NavItem to="/admin/registrations" isActive={isActive('/admin/registrations')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" strokeWidth="2" />
            </svg>
            <NavLabel>Registrations</NavLabel>
          </NavItem>
        </NavList>
      </NavSection>

      <NavSection>
        <SectionTitle>Operations</SectionTitle>
        <NavList>
          <NavItem to="/admin/revenue" isActive={isActive('/admin/revenue')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="1" x2="12" y2="23" strokeWidth="2" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeWidth="2" />
            </svg>
            <NavLabel>Revenue</NavLabel>
          </NavItem>
          <NavItem to="/admin/analytics" isActive={isActive('/admin/analytics')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2" />
              <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" />
              <path d="M12 5l4 4m-8 0l4-4m0 14l-4-4m8 4l-4-4" strokeWidth="2" />
            </svg>
            <NavLabel>Analytics</NavLabel>
          </NavItem>
          <NavItem to="/admin/tickets" isActive={isActive('/admin/tickets')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="2" y="7" width="20" height="14" rx="2" strokeWidth="2" />
              <path d="M16 5V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2" strokeWidth="2" />
            </svg>
            <NavLabel>Tickets</NavLabel>
          </NavItem>
        </NavList>
      </NavSection>

      <NavSection>
        <SectionTitle>Platform</SectionTitle>
        <NavList>
          <NavItem to="/admin/verification" isActive={isActive('/admin/verification')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="20 6 9 17 4 12" strokeWidth="2" />
            </svg>
            <NavLabel>Verification</NavLabel>
          </NavItem>
          <NavItem to="/admin/cafes" isActive={isActive('/admin/cafes')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 3L5 7v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7l-4-4z" strokeWidth="2" />
            </svg>
            <NavLabel>Cafes</NavLabel>
          </NavItem>
          <NavItem to="/admin/users" isActive={isActive('/admin/users')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" />
              <circle cx="12" cy="7" r="4" strokeWidth="2" />
            </svg>
            <NavLabel>Users</NavLabel>
          </NavItem>
          <NavItem to="/admin/settings" isActive={isActive('/admin/settings')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="3" strokeWidth="2" />
              <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m2.12 2.12l4.24 4.24M1 12h6m6 0h6m-17.78 7.78l4.24-4.24m2.12-2.12l4.24-4.24" strokeWidth="2" />
            </svg>
            <NavLabel>Settings</NavLabel>
          </NavItem>
        </NavList>
      </NavSection>

      <LogoutButton onClick={handleLogout}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeWidth="2" />
          <polyline points="16 17 21 12 16 7" strokeWidth="2" />
          <line x1="21" y1="12" x2="9" y2="12" strokeWidth="2" />
        </svg>
        Logout
      </LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;
