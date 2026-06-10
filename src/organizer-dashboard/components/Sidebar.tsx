import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useOrganizer } from '../context/OrganizerContext';
import { theme } from '../../admin-dashboard/styles/theme';

const SidebarContainer = styled.aside<{ isOpen: boolean }>`
  width: ${theme.componentSizes.sidebarWidth};
  background: ${theme.colors.white};
  border-right: 1px solid ${theme.colors.gray200};
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
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 20px;
  font-weight: 700;
  color: ${theme.colors.coffeeDark};
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
  color: ${(props) => (props.isActive ? theme.colors.gold : theme.colors.gray600)};
  background-color: ${(props) => props.isActive ? 'rgba(212, 175, 55, 0.1)' : 'transparent'};
  text-decoration: none;
  font-weight: ${(props) => (props.isActive ? '600' : 'normal')};
  border-left: 3px solid ${(props) => (props.isActive ? theme.colors.gold : 'transparent')};

  &:hover {
    background-color: rgba(212, 175, 55, 0.1);
    color: ${theme.colors.gold};
  }
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
`;

const Sidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const location = useLocation();
  const { logout } = useOrganizer();

  const isActive = (path: string) => {
    if (path === '/organizer' && location.pathname !== '/organizer') return false;
    return location.pathname.startsWith(path);
  };

  const links = [
    { name: 'My Events', path: '/organizer/my-events', icon: '📅' },
    { name: 'Registrations', path: '/organizer/registrations', icon: '👥' },
    { name: 'My Event Revenue', path: '/organizer/event-revenue', icon: '💰' },
    { name: 'Dashboard Summary', path: '/organizer/earnings', icon: '📈' },
    { name: 'Payout History', path: '/organizer/settlements', icon: '🏦' },
    { name: 'Refunds', path: '/organizer/refunds', icon: '💸' },
  ];

  return (
    <SidebarContainer isOpen={isOpen}>
      <Logo>
        <span style={{ fontSize: '24px' }}>🎪</span>
        Organizer Hub
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

export default Sidebar;
