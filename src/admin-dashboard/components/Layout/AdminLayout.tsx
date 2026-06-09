// Admin Layout Component
import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import Sidebar from './Sidebar';
import Header from './Header';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100%;
  flex: 1;
  background-color: ${theme.colors.cream};
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-left: ${theme.componentSizes.sidebarWidth};
  width: calc(100% - ${theme.componentSizes.sidebarWidth});
  transition: all ${theme.transitions.base};

  @media (max-width: ${theme.breakpoints.lg}) {
    margin-left: 0;
    width: 100%;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 16px;
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 12px;
  }
`;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <LayoutContainer>
      <Sidebar isOpen={sidebarOpen} />
      <MainContent>
        <Header onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />
        <ContentArea>{children}</ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default AdminLayout;
