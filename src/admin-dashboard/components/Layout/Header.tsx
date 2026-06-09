// Header Component
import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { useAdmin } from '../../context/AdminContext';
import { formatTimeAgo } from '../../utils/formatters';

const HeaderContainer = styled.header`
  height: ${theme.componentSizes.headerHeight};
  background: ${theme.colors.white};
  border-bottom: 1px solid ${theme.colors.gray200};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 50;

  @media (max-width: ${theme.breakpoints.md}) {
    padding: 0 16px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.coffeeDark};
  font-size: 24px;
  padding: 8px;

  @media (max-width: ${theme.breakpoints.lg}) {
    display: block;
  }
`;

const PageTitle = styled.h1`
  font-size: 24px;
  color: ${theme.colors.coffeeDark};
  margin: 0;
  font-weight: 600;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: ${theme.breakpoints.md}) {
    gap: 16px;
  }
`;

const NotificationContainer = styled.div`
  position: relative;
`;

const NotificationButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: ${theme.colors.coffeeMedium};
  position: relative;
  padding: 4px;
  transition: color ${theme.transitions.fast};

  &:hover {
    color: ${theme.colors.gold};
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 10px;
    height: 10px;
    background: ${theme.colors.error};
    border-radius: 9999px;
  }
`;

const NotificationDropdown = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  position: absolute;
  top: 100%;
  right: 0;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.gray200};
  border-radius: 12px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  min-width: 400px;
  max-width: 400px;
  margin-top: 8px;
  z-index: 1000;

  @media (max-width: ${theme.breakpoints.sm}) {
    min-width: 300px;
    max-width: 300px;
  }
`;

const NotificationHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${theme.colors.gray200};
  font-weight: 600;
  color: ${theme.colors.coffeeDark};
`;

const NotificationList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const NotificationItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${theme.colors.gray100};
  cursor: pointer;
  transition: background-color ${theme.transitions.fast};

  &:hover {
    background-color: ${theme.colors.creamLight};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const NotificationTitle = styled.p`
  font-weight: 600;
  color: ${theme.colors.coffeeDark};
  margin: 0 0 4px 0;
  font-size: 14px;
`;

const NotificationMessage = styled.p`
  color: ${theme.colors.gray600};
  margin: 0;
  font-size: 12px;
  line-height: ${theme.typography.lineHeights.tight};
`;

const NotificationTime = styled.p`
  color: ${theme.colors.gray500};
  font-size: 12px;
  margin: 4px 0 0 0;
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px;
  border-left: 1px solid ${theme.colors.gray200};

  @media (max-width: ${theme.breakpoints.sm}) {
    display: none;
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background: linear-gradient(135deg, ${theme.colors.coffeeMedium}, ${theme.colors.gold});
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.white};
  font-weight: 700;
  font-size: 18px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.coffeeDark};
`;

const UserRole = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${theme.colors.gray600};
`;

interface HeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, sidebarOpen }) => {
  const { admin, notifications, markNotificationAsRead } = useAdmin();
  const [notificationOpen, setNotificationOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (id: string) => {
    markNotificationAsRead(id);
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <MenuButton onClick={onMenuClick}>☰</MenuButton>
        <PageTitle>Dashboard</PageTitle>
      </LeftSection>

      <RightSection>
        <NotificationContainer>
          <NotificationButton onClick={() => setNotificationOpen(!notificationOpen)}>
            🔔
          </NotificationButton>

          <NotificationDropdown isOpen={notificationOpen}>
            <NotificationHeader>
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </NotificationHeader>
            <NotificationList>
              {notifications.length === 0 ? (
                <NotificationItem>
                  <NotificationMessage>No notifications</NotificationMessage>
                </NotificationItem>
              ) : (
                notifications.map((notif) => (
                  <NotificationItem
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif.id)}
                  >
                    <NotificationTitle>{notif.title}</NotificationTitle>
                    <NotificationMessage>{notif.message}</NotificationMessage>
                    <NotificationTime>{formatTimeAgo(notif.createdAt)}</NotificationTime>
                  </NotificationItem>
                ))
              )}
            </NotificationList>
          </NotificationDropdown>
        </NotificationContainer>

        {admin && (
          <UserContainer>
            <UserAvatar>{admin.name.charAt(0).toUpperCase()}</UserAvatar>
            <UserInfo>
              <UserName>{admin.name}</UserName>
              <UserRole>{admin.role}</UserRole>
            </UserInfo>
          </UserContainer>
        )}
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;
