import React, { useState } from 'react';
import styled from 'styled-components';
import AdminSidebar from './AdminSidebar';
import { theme } from '../styles/theme';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  flex: 1;
  background-color: ${theme.colors.cream};
`;

const MainContent = styled.main<{ isSidebarOpen: boolean }>`
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  margin-left: ${theme.componentSizes.sidebarWidth};
  transition: margin-left ${theme.transitions.base};

  @media (max-width: ${theme.breakpoints.lg}) {
    margin-left: 0;
    padding: 16px;
  }
`;

const MobileHeader = styled.div`
  display: none;
  align-items: center;
  padding: 16px;
  background: ${theme.colors.white};
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 24px;
  border-radius: 12px;

  @media (max-width: ${theme.breakpoints.lg}) {
    display: flex;
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: ${theme.colors.coffeeDark};
  
  svg { width: 24px; height: 24px; }
`;

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <LayoutContainer>
      <AdminSidebar isOpen={isSidebarOpen} />
      
      <MainContent isSidebarOpen={isSidebarOpen}>
        <MobileHeader>
          <MenuButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </MenuButton>
        </MobileHeader>
        {children}
      </MainContent>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 90
          }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </LayoutContainer>
  );
};

export default AdminLayout;
