import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Button } from './index';
import { AlertCircle } from 'lucide-react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  background: ${theme.colors.white};
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  text-align: center;
  max-width: 500px;
  margin: 40px auto;
`;

const IconWrapper = styled.div`
  color: ${theme.colors.error};
  margin-bottom: 16px;
  svg {
    width: 64px;
    height: 64px;
  }
`;

const Title = styled.h3`
  margin: 0 0 8px 0;
  color: ${theme.colors.coffeeDark};
  font-size: 20px;
`;

const Message = styled.p`
  margin: 0 0 24px 0;
  color: ${theme.colors.gray600};
`;

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = "Unable to connect to server.", 
  onRetry 
}) => {
  return (
    <Container>
      <IconWrapper>
        <AlertCircle />
      </IconWrapper>
      <Title>Connection Error</Title>
      <Message>{message}</Message>
      {onRetry && (
        <Button variant="primary" onClick={onRetry}>
          Retry
        </Button>
      )}
    </Container>
  );
};
