import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  margin?: string;
}

export const SkeletonBox = styled.div<SkeletonProps>`
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '20px'};
  border-radius: ${(props) => props.borderRadius || '8px'};
  margin: ${(props) => props.margin || '0'};
  background: ${theme.colors.gray200};
  background-image: linear-gradient(
    90deg,
    ${theme.colors.gray200} 0px,
    ${theme.colors.gray100} 50%,
    ${theme.colors.gray200} 100%
  );
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite linear;
`;

export const SkeletonCard: React.FC = () => {
  return (
    <div style={{ padding: '24px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <SkeletonBox width="40%" height="20px" />
        <SkeletonBox width="48px" height="48px" borderRadius="12px" />
      </div>
      <SkeletonBox width="70%" height="36px" margin="0 0 12px 0" />
      <SkeletonBox width="30%" height="16px" />
    </div>
  );
};
