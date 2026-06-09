// Reusable UI Components
import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { motion } from 'framer-motion';

// Button Component
export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' | 'success'; size?: 'small' | 'medium' | 'large' }>`
  padding: ${(props) => (props.size === 'small' ? `8px 12px` : `12px 24px`)};
  border: none;
  border-radius: 12px;
  font-size: ${(props) => (props.size === 'small' ? '14px' : '16px')};
  font-weight: 600;
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  display: inline-flex;
  align-items: center;
  gap: 8px;

  ${(props) => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, ${theme.colors.coffeeMedium}, ${theme.colors.gold});
          color: ${theme.colors.white};
          &:hover {
            box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
          }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.cream};
          color: ${theme.colors.coffeeDark};
          border: 2px solid ${theme.colors.coffeeMedium};
          &:hover {
            background: ${theme.colors.darkCream};
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.error};
          color: ${theme.colors.white};
          &:hover {
            background: #d32f2f;
          }
        `;
      case 'success':
        return `
          background: ${theme.colors.success};
          color: ${theme.colors.white};
          &:hover {
            background: #45a049;
          }
        `;
      default:
        return '';
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Badge Component
export const Badge = styled.span<{ variant?: 'success' | 'warning' | 'error' | 'info' }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;

  ${(props) => {
    switch (props.variant) {
      case 'success':
        return `
          background: ${theme.colors.successLight};
          color: ${theme.colors.success};
        `;
      case 'warning':
        return `
          background: ${theme.colors.warningLight};
          color: ${theme.colors.warning};
        `;
      case 'error':
        return `
          background: ${theme.colors.errorLight};
          color: ${theme.colors.error};
        `;
      case 'info':
        return `
          background: ${theme.colors.infoLight};
          color: ${theme.colors.info};
        `;
      default:
        return '';
    }
  }}
`;

// Input Component
export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: 12px;
  font-size: 16px;
  font-family: ${theme.typography.fontFamily};
  transition: all ${theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${theme.colors.gold};
    box-shadow: 0 0 0 3px ${theme.colors.goldOverlay};
  }

  &::placeholder {
    color: ${theme.colors.gray500};
  }
`;

// Textarea Component
export const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: 12px;
  font-size: 16px;
  font-family: ${theme.typography.fontFamily};
  resize: vertical;
  min-height: 120px;
  transition: all ${theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${theme.colors.gold};
    box-shadow: 0 0 0 3px ${theme.colors.goldOverlay};
  }

  &::placeholder {
    color: ${theme.colors.gray500};
  }
`;

// Select Component
export const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: 12px;
  font-size: 16px;
  font-family: ${theme.typography.fontFamily};
  color: ${theme.colors.coffeeDark};
  cursor: pointer;
  background-color: ${theme.colors.white};
  transition: all ${theme.transitions.fast};
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 20px;
  padding-right: 40px;

  &:focus {
    outline: none;
    border-color: ${theme.colors.gold};
    box-shadow: 0 0 0 3px ${theme.colors.goldOverlay};
  }
`;

// Modal Component
export const Modal = styled(motion.div)<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: ${theme.zIndex.modal};
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const ModalContent = styled(motion.div)`
  background: ${theme.colors.white};
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid ${theme.colors.gray200};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  color: ${theme.colors.coffeeDark};
`;

export const ModalClose = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${theme.colors.gray600};
  transition: color ${theme.transitions.fast};

  &:hover {
    color: ${theme.colors.coffeeDark};
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
`;

export const ModalFooter = styled.div`
  padding: 24px;
  border-top: 1px solid ${theme.colors.gray200};
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

// Loading Spinner
export const Spinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid ${theme.colors.creamLight};
  border-top-color: ${theme.colors.gold};
  border-radius: 9999px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

// Empty State
export const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${theme.colors.gray600};

  svg {
    width: 80px;
    height: 80px;
    margin-bottom: 16px;
    color: ${theme.colors.gray300};
  }

  p {
    margin: 0;
    font-size: 18px;
  }
`;

// Card Component
export const Card = styled(motion.div)`
  background: ${theme.colors.white};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all ${theme.transitions.base};

  &:hover {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
`;

// Grid Component
export const Grid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns || 4}, 1fr);
  gap: 24px;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

// Flex Component
export const Flex = styled.div<{ gap?: number; direction?: 'row' | 'column'; align?: string; justify?: string }>`
  display: flex;
  gap: ${(props) => `${(props.gap || 4) * 4}px`};
  flex-direction: ${(props) => props.direction || 'row'};
  align-items: ${(props) => props.align || 'center'};
  justify-content: ${(props) => props.justify || 'flex-start'};
`;

export * from './Skeleton';
export * from './ErrorState';
