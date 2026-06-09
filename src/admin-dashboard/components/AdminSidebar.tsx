import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAdmin } from '../context/AdminContext';
import { theme } from '../styles/theme';

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

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: ${theme.colors.gold}; border-radius: 9999px; }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 700;
  color: ${theme.colors.gold};

  svg { width: 28px; height: 28px; }
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
  padding: 12px;
  border-radius: 12px;
  color: ${(props) => (props.isActive ? theme.colors.gold : theme.colors.cream)};
  background-color: ${(props) => props.isActive ? 'rgba(212, 175, 55, 0.1)' : 'transparent'};
  text-decoration: none;
  font-weight: ${(props) => (props.isActive ? '600' : 'normal')};
  border-left: 3px solid ${(props) => (props.isActive ? theme.colors.gold : 'transparent')};

  &:hover {
    background-color: rgba(212, 175, 55, 0.1);
    color: ${theme.colors.gold};
  }

  svg { width: 20px; height: 20px; }
`;

const NavLabel = styled.span` font-size: 14px; `;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  background-color: rgba(244, 67, 54, 0.1);
  color: #FF6B6B;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  margin-top: 24px;

  &:hover { background-color: rgba(244, 67, 54, 0.2); }
`;

const AdminSidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const location = useLocation();
  const { logout } = useAdmin();

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname !== '/admin') return false;
    return location.pathname.startsWith(path);
  };

  const links = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Events', path: '/admin/events', icon: '📅' },
    { name: 'Organizers', path: '/admin/organizers', icon: '🏪' },
    { name: 'Registrations', path: '/admin/registrations', icon: '👥' },
    { name: 'Revenue', path: '/admin/revenue', icon: '💰' },
    { name: 'Settlements', path: '/admin/settlements', icon: '🏦' },
    { name: 'Verification', path: '/admin/verification', icon: '✓' },
  ];

  return (
    <SidebarContainer isOpen={isOpen}>
      <Logo>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path d="M12 6v6l4 2" strokeWidth="2" />
        </svg>
        Caffelino Platform
      </Logo>

      <NavList>
        {links.map(link => (
          <NavItem key={link.name} to={link.path} isActive={isActive(link.path)}>
            <span>{link.icon}</span>
            <NavLabel>{link.name}</NavLabel>
          </NavItem>
        ))}
      </NavList>

      <LogoutButton onClick={logout}>
        <span>🚪</span> Logout
      </LogoutButton>
    </SidebarContainer>
  );
};

export default AdminSidebar;
